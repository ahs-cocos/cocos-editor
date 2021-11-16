import React, {useState, useEffect, Fragment} from 'react';
import {Route, NavLink} from 'react-router-dom'

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from './firebaseConfig';
import ServiceContext from './context/ServiceContext'

import {CourseService, CocosHeader, CocosFooter, CocosUser, UserService, Course, ApplicationPath, CommentService, PrivilegeManager} from 'cocos-lib'
import './App.css'
import Homepage from "./pages/Homepage";
import {Dropdown, Header} from "semantic-ui-react";
import CourseList from "./pages/CourseList";
import CourseEditor from "./pages/CourseEditor";
import moment from "moment";
import _ from 'lodash'
import uuidv4 from 'uuid/v4'
import Backoffice from "./pages/backoffice/Backoffice";

const version = require('./version')
const COCOS_EDITOR_TREFWOORDEN_CONSUMER_KEY = '6958e680-0c84-4d26-9d98-43f58a01f264'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider(),
    microsoftProvider: new firebase.auth.OAuthProvider('microsoft.com')
}

const CONTEXT_PUBLIC = 'public'
const CONTEXT_BACKOFFICE = 'backoffice'

firebase.auth().getRedirectResult()
    .then(function (result) {
        //console.log('REDIRECT RES', result)
        // User is signed in.
        // IdP data available in result.additionalUserInfo.profile.
        // OAuth access token can also be retrieved:
        // result.credential.accessToken
        // OAuth ID token can also be retrieved:
        // result.credential.idToken
    })
    .catch(function (error) {
        // Handle error.
    });

function App({user, signOut, signInWithGoogle, signInWithFacebook}) {

    //const [contentBlock, setContentBlock] = useState()
    //const [contentBlockData, setContentBlockData] = useState()
    const [componentIdentifierActive, setComponentIdentifierActive] = useState(localStorage.getItem('COCOS_COMPONENT_IDENTIFIER_ACTIVE') === 'true')
    const [privilegeManager, setPrivilegeManager] = useState()
    const [courseService] = useState(new CourseService())
    const [userService] = useState(new UserService())
    const [commentService] = useState(new CommentService())
    const [currentView, setCurrentView] = useState('home')
    const [context, setContext] = useState(CONTEXT_BACKOFFICE)
    const [cocosUser, setCocosUser] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courses, setCourses] = useState()
    const [loginState, setLoginState] = useState('loggedOut')


    console.log('UUID', uuidv4())

    //COMPONENT IDENTIFIER
    useEffect(() => {

    }, [])

    //COURSES
    useEffect(() => {
        if (!cocosUser) return
        courseService.getCourses(cocosUser).then(res => {
            setCourses(res)
        })
    }, [cocosUser, courseService])

    useEffect(() => {
        if (!user) return

        const provider = user.providerData[0]
        const cocosUser = new CocosUser()
        cocosUser.authSource = provider.providerId
        cocosUser.email = user.email
        cocosUser.displayName = user.displayName
        cocosUser.photoURL = user.photoURL ? user.photoURL : ''

        userService.getUser(cocosUser).then(res => {
            if (!res) throw new Error("No Cocos User! This shouldn't happen")
            setCocosUser(res)
            const pm = new PrivilegeManager()
            pm.setLoginUser(res)
            setPrivilegeManager(pm)
            setLoginState('loggedIn')
        })
    }, [user, userService])


    /*useEffect(() => {
        if (!contentBlock) {
            const cb = new ContentBlock()
            cb.id = 1
            setContentBlock(cb)

            courseService.getCourses().then(res => {
                console.log('COURSES', res)
            })
            courseService.getContentBlockData(cb).then(res => {
                console.log('CB DATA', res)
                setContentBlockData(res)
            })
        }
    })*/

    const onLoginClick = (method) => {

        setLoginState('loggingIn')

        switch (method) {
            case 'google':
                firebase.auth().signInWithPopup(providers.googleProvider)
                break
            case 'microsoft':
                firebase.auth().signInWithPopup(providers.microsoftProvider)
                break
            case 'facebook':
                firebase.auth().signInWithPopup(providers.facebookProvider)
                break
            default:
                break
        }
    }

    const onSignOut = (event) => {
        event.stopPropagation()
        setCurrentView('home')
        setLoginState('loggedOut')
        signOut()
    }

    const onSelectCourse = (course) => {
        setSelectedCourse(course)
        setCurrentView('course')
    }

    const onCreateCourse = (course) => {
        const answer = prompt('Enter a course title', 'My magnificent course')

        if (answer && answer !== '') {
            const newCourse = new Course()
            newCourse.uuid = uuidv4()
            newCourse.title = answer
            newCourse.owner = cocosUser.id
            newCourse.date_created = moment().format("YYYY-MM-DD HH:mm:ss")
            newCourse.date_modified = moment().format("YYYY-MM-DD HH:mm:ss")
            newCourse.last_modified_by = cocosUser.id
            courseService.createCourse(newCourse).then(res => {
                //courses.ownedCourses = _.orderBy([...courses.ownedCourses, res], 'title')
                //setSelectedCourse(res)
                setCourses({ownedCourses: _.orderBy([...courses.ownedCourses, res], 'title'), sharedCourses: [...courses.sharedCourses]})
                setCurrentView('courses')
            })
        }
    }

    const updateCourse = (course) => {
        course.last_modified_by = cocosUser.id
        course.date_modified = moment().format("YYYY-MM-DD HH:mm:ss")
        courseService.updateCourse(course).then(() => setSelectedCourse({...course}))
    }

    const deleteCourse = (course) => {
        const answer = window.confirm("Are you absolutely sure you want to delete this course and ALL of it's content? There's no way back!")

        if (answer) courseService.deleteCourse(course).then(res => {
            console.log('COURSE DELETED!')
            setCourses({...courses, ownedCourses: courses.ownedCourses.filter(c => c.id !== course.id)})
            setSelectedCourse(null)
            setCurrentView('courses')
        })
    }

    const toggleComponentIdentifier = () => {
        setComponentIdentifierActive(!componentIdentifierActive)
        localStorage.setItem('COCOS_COMPONENT_IDENTIFIER_ACTIVE', componentIdentifierActive ? 'false' : 'true')
    }

    if (!privilegeManager) return null

    return (
        <ServiceContext.Provider value={{courseService, privilegeManager, componentIdentifierActive, COCOS_EDITOR_TREFWOORDEN_CONSUMER_KEY}}>
            <div className="App">
                {/*<NavLink to='/'>*/}
                <CocosHeader onHeaderLogoClick={() => setCurrentView('home')} navLink={<NavLink to='/'/>}>

                    <NavLink to='/'>
                        <img height='30' onClick={() => setCurrentView('home')}
                             src={ApplicationPath.assetsFolder + 'logo/logo-cocos-inv.png'} alt='cocos logo'/>
                    </NavLink>

                    {context === CONTEXT_BACKOFFICE && <Header color='red' style={{marginLeft: '20px'}} inverted>Backoffice</Header>}

                    <div style={{flexGrow: 1}}></div>

                    <div style={{marginRight: '20px', color: '#666'}}>Version {version}</div>

                    {user &&
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {user.photoURL && user.photoURL !== '' &&
                        <img height='40px' src={user.photoURL} style={{marginRight: '20px'}} alt='User avatar'/>}


                        <Dropdown text={`${user.displayName} (${user.email})`} pointing className='link item'>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={onSignOut} content='Sign out'/>

                                {privilegeManager.isSuperAdmin() && <Fragment>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item onClick={toggleComponentIdentifier} icon={componentIdentifierActive && 'check'} content='Toggle component identifier'/>
                                    {context === CONTEXT_PUBLIC && <Dropdown.Item
                                        onClick={() => setContext(CONTEXT_BACKOFFICE)}
                                        content='Switch to backoffice'/>}
                                    {context === CONTEXT_BACKOFFICE && <Dropdown.Item
                                        onClick={() => setContext(CONTEXT_PUBLIC)}
                                        content='Exit backoffice'/>}
                                </Fragment>

                                }
                            </Dropdown.Menu>
                        </Dropdown>


                    </div>
                    }

                    <div>

                    </div>
                </CocosHeader>
                {/* </NavLink>*/}

                {context === CONTEXT_PUBLIC && <Fragment>
                    {currentView === 'home' && <Fragment>
                        <Homepage loginState={loginState}
                                  onLoginClick={onLoginClick}
                                  onGoToCourses={() => setCurrentView('courses')}/>
                        <CocosFooter/>

                    </Fragment>}

                    {currentView === 'courses' &&
                    <Route path='/courses'>
                        <CourseList courses={courses}
                                    onSelectCourse={onSelectCourse}
                                    onCreateCourse={onCreateCourse}/>

                    </Route>
                    }

                    {(currentView === 'course' && selectedCourse) &&
                    <Route path={`/course/${selectedCourse.uuid}`}>
                        <CourseEditor courseService={courseService}
                                      commentService={commentService}
                                      course={selectedCourse}
                                      cocosUser={cocosUser}
                                      onBackToOverviewButtonClick={() => setCurrentView('courses')}
                                      updateCourse={updateCourse}
                                      deleteCourse={deleteCourse}/>
                    </Route>}

                </Fragment>}

                {context === CONTEXT_BACKOFFICE && <Backoffice/>}
            </div>
        </ServiceContext.Provider>
    );
}

export default withFirebaseAuth({providers, firebaseAppAuth})(App);

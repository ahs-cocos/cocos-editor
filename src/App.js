import React, {useState, useEffect} from 'react';
import {Route, Switch, Link, withRouter, NavLink} from 'react-router-dom'

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from './firebaseConfig';

import {CourseService, CocosHeader, CocosUser, UserService, Course, ApplicationPath} from 'cocos-lib'
import './App.css'
import Homepage from "./pages/Homepage";
import {Dropdown} from "semantic-ui-react";
import CourseList from "./pages/CourseList";
import CourseEditor from "./pages/CourseEditor";
import moment from "moment";
import _ from 'lodash'
import uuidv4 from 'uuid/v4'

const version = require('./version')

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAppAuth = firebaseApp.auth()
const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider(),
    microsoftProvider: new firebase.auth.OAuthProvider('microsoft.com')
}

function App({user, signOut, signInWithGoogle, signInWithFacebook}) {

    //const [contentBlock, setContentBlock] = useState()
    //const [contentBlockData, setContentBlockData] = useState()
    const [courseService] = useState(new CourseService())
    const [userService] = useState(new UserService())
    const [currentView, setCurrentView] = useState('home')
    const [cocosUser, setCocosUser] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courses, setCourses] = useState()

    useEffect(() => {
        if (!cocosUser) return
        courseService.getCourses(cocosUser).then(res => {
            setCourses(res)
        })
    }, [cocosUser, courseService])

    useEffect(() => {
        if (!user) return

        console.log('FIREBASE USER', user)
        const provider = user.providerData[0]
        const cocosUser = new CocosUser()
        cocosUser.authSource = provider.providerId
        cocosUser.email = user.email
        cocosUser.displayName = user.displayName
        cocosUser.photoURL = user.photoURL ? user.photoURL : ''

        userService.getUser(cocosUser).then(res => {
            console.log('CU CREATED', res)
            if (!res) throw new Error("No Cocos User! This shouldn't happen")
            setCocosUser(res)
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

        switch (method) {
            case 'google':
                signInWithGoogle()
                break
            case 'microsoft':
                firebase.auth().signInWithRedirect(providers.microsoftProvider)
                break
            case 'facebook':
                signInWithFacebook()
                break
            default:
                break
        }
    }

    const onSignOut = (event) => {
        event.stopPropagation()
        setCurrentView('home')
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

    return (
        <div className="App">
            {/*<NavLink to='/'>*/}
                <CocosHeader onHeaderLogoClick={() => setCurrentView('home')} navLink={<NavLink to='/'/>}>

                    <NavLink to='/'>
                        <img height='30' onClick={() => setCurrentView('home')}
                            src={ApplicationPath.assetsFolder + 'logo/logo-cocos-inv.png'} alt='cocos logo'/>
                    </NavLink>

                    <div style={{flexGrow: 1}}></div>

                    <div style={{marginRight: '20px', color: '#666'}}>Version {version}</div>

                    {user &&
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img height='40px' src={user.photoURL} style={{marginRight: '20px'}} alt='User avatar'/>
                        {/*<div>{user.displayName} - <Button size='mini' onClick={signOut}>Logout</Button></div>*/}

                        <Dropdown text={`${user.displayName} (${user.email})`} pointing className='link item'>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={onSignOut}>Sign out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>


                    </div>
                    }
                    <div>

                    </div>
                </CocosHeader>
           {/* </NavLink>*/}

            {currentView === 'home' && <Homepage user={user}
                                                 onLoginClick={onLoginClick}
                                                 onGoToCourses={() => setCurrentView('courses')}/>}

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
                              course={selectedCourse}
                              cocosUser={cocosUser}
                              onBackToOverviewButtonClick={() => setCurrentView('courses')}
                              updateCourse={updateCourse}
                              deleteCourse={deleteCourse}/>
            </Route>}

        </div>
    );
}

export default withFirebaseAuth({providers, firebaseAppAuth})(App);

import React, {useState, useEffect} from 'react';

import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from './firebaseConfig';

import {CourseService, CocosHeader, CocosUser, UserService} from 'cocos-lib'
import './App.css'
import Homepage from "./pages/Homepage";
import {Dropdown} from "semantic-ui-react";
import CourseList from "./pages/CourseList";
import CourseEditor from "./pages/CourseEditor";

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


    useEffect(() => {
        if (!user) return

        const provider = user.providerData[0]
        const cocosUser = new CocosUser()
        cocosUser.authSource = provider.providerId
        cocosUser.email = user.email
        cocosUser.displayName = user.displayName

        userService.getUser(cocosUser).then(res => {
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


    /*const onRTContentChange = (data) => {
        console.log('CHANGE', data, contentBlock)
    }*/

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

    const onSignOut = () => {
        setCurrentView('home')
        signOut()
    }

    const onSelectCourse = (course) => {
        console.log('SELECT COURSE', course)
        setSelectedCourse(course)
        setCurrentView('course')
    }

    const onCreateCourse = (course) => {
        console.log('CREATE COURSE', course)
    }

    const updateCourse = (course) => {
        courseService.updateCourse(course).then(setSelectedCourse({...course}))
    }

    //if (!courseOutline || !contentBlock || !contentBlockData) return null

    return (
        <div className="App">
            <CocosHeader onHeaderLogoClick={() => setCurrentView('home')}>

                <div style={{flexGrow: 1}}></div>

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

            {/*<RTEditor onChange={onRTContentChange} data={contentBlockData}/>*/}


            {currentView === 'home' && <Homepage user={user}
                                                 onLoginClick={onLoginClick}
                                                 onGoToCourses={() => setCurrentView('courses')}/>}

            {currentView === 'courses' && <CourseList courseService={courseService}
                                                      cocosUser={cocosUser}
                                                      onSelectCourse={onSelectCourse}
                                                      onCreateCourse={onCreateCourse}/>}

            {(currentView === 'course' && selectedCourse) && <CourseEditor course={selectedCourse}
                                                                           cocosUser={cocosUser}
                                                                           onBackToOverviewButtonClick={() => setCurrentView('courses')}
                                                                           updateCourse={updateCourse}/>}
        </div>
    );
}

export default withFirebaseAuth({providers, firebaseAppAuth})(App);

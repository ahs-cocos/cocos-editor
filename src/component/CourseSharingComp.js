import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import uuidv1 from 'uuid/v1'

import {Button, Divider} from "semantic-ui-react";
import {CourseSharing, SharingStatus, SharingRoles} from "cocos-lib";
import SharingRenderer from "./SharingRenderer";
import * as EmailValidator from 'email-validator';

//import { Email, Item, Span, A, renderEmail, Box, Image } from 'react-html-email'
//const Parser = require('html-react-parser')

/*const css = `
@media only screen and (max-device-width: 480px) {
  font-size: 20px !important;
}`.trim()*/

/*const emailHTML = renderEmail(
    <Email title="Test Email" headCSS={css}>
        <Item>
            <Span fontSize={15}>Dany Dhondt (archemedia@gmail.com) wants to share a course with you.</Span>
        </Item>
        <Item>
            <Box cellSpacing={20} width="100%" style={{ borderTop: '3px solid black' }}>
                <Item>
                    <Span color="blue" lineHeight={20}><A href={ApplicationPath.editorRoot + '?sharingId=' + 'qsmlfkqsflkq'}>My first course</A></Span>
                    <Image data-mc-bar="bar" data-mc-baz="baz" alt="react" src={ApplicationPath.assetsFolder + 'logo/logo-cocos-color.png'} width={100} height={100} />

                </Item>
            </Box>
        </Item>
    </Email>
)*/


const CourseSharingComp = ({course, cocosUser, updateCourse, courseService}) => {

    const [courseSharing, setCourseSharing] = useState(null)

    useEffect(() => {
        courseService.getCourseSharing(course).then(res => {
            console.log('SHARING', res)
            setCourseSharing(res)
        })
    }, [course, courseService])

    
    const addSharing = () => {
        const sharing = new CourseSharing()
        sharing.course = course.id
        sharing.status = SharingStatus.NEW
        sharing.uuid = uuidv1()
        sharing.sharer = ''
        sharing.roles = [SharingRoles.REVIEWER].join(',')

        courseService.createSharing(sharing).then(res => {
            setCourseSharing([...courseSharing, res])
        })
    }

    const checkEmailValid = (sharer, sharing) => {
        console.log('CHECK', sharer, sharing)
        let valid = EmailValidator.validate(sharer), message = ''
        if (sharer === cocosUser.email){
            valid = false
            message = "You can't share this course with yourself!"
        }
        if (courseSharing.reduce((acc, share) => {
            if (share.sharer === sharer) return false
            return acc
        }, true) === false && sharer !== ''){
            valid = false
            message = "Alreadey shared!"
        }
        if (valid) sharing.sharer = sharer

        return {valid, message}
    }

    const onRemoveSharing = (sharing) => {

        const answer = window.confirm('Are you sure you want to stop sharing?')

        if (!answer) return

        courseService.deleteSharing(sharing).then(res => {
            setCourseSharing(courseSharing.filter(sh => sh.id !== sharing.id))
        })
    }

    const onUpdateSharing = (mode, sharing) => {
        switch (mode){
            case 'invite':
                sharing.status = SharingStatus.SHARED //.PENDING
                courseService.updateSharing(sharing).then(res => {
                    setCourseSharing([...courseSharing])
                })
                break
            default: break
        }
    }

    if (!courseSharing) return null
    
    return (

        <Fragment>

            {/*<div className='subheader'>Course sharing</div>*/}
            <div style={{marginTop: '30px'}}>
                <p>You can share courses with others who can manage, co-create or comment on your course</p>

                {courseSharing.length === 0 &&
                <div>
                    <p>You didn't share your course with anyone.</p>
                </div>
                }

                {courseSharing.map((sharing, index) => {
                    return <SharingRenderer key={index}
                                            course={course}
                                            sharing={sharing}
                                            onRemoveSharing={onRemoveSharing}
                                            onUpdateSharing={onUpdateSharing}
                                            emailValidationFunction={checkEmailValid}/>
                })

                }
                
                <Divider/>

                <Button color='green' onClick={addSharing}>Add sharing</Button>

                {/*<div>{Parser(emailHTML)}</div>*/}
            </div>

        </Fragment>
    )
}

export default CourseSharingComp

CourseSharingComp.propTypes = {
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    updateCourse: PropTypes.func
}

CourseSharingComp.defaultProps = {}
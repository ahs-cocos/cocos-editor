import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import uuidv1 from 'uuid/v1'

import {Form, Button, Header, Divider} from "semantic-ui-react";
import CourseInfo from "./CourseInfo";
import {MultiSelect} from "cocos-lib";
import SharingRenderer from "./SharingRenderer";


const CourseSharing = ({course, cocosUser, updateCourse, courseService}) => {

    const [courseSharing, setCourseSharing] = useState(null)

    useEffect(() => {
        courseService.getCourseSharing(course).then(res => {
            console.log('SHARING', res)
            setCourseSharing(res)
        })
    }, [])

    console.log('UUID', uuidv1().length)
    
    const addSharing = () => {
        console.log('ADD SDH')
    }
    
    if (!courseSharing) return null
    
    return (

        <Fragment>

            <div className='subheader'>Course sharing</div>
            <Form style={{marginTop: '30px'}}>
                <p>You can share courses with others who can manage, co-create or comment on your course</p>

                {courseSharing.length === 0 &&
                <div>
                    <p>You didn't share your course with anyone.</p>
                </div>
                }

                {courseSharing.map((sharing, index) => {
                    return <SharingRenderer key={index} course={course} sharing={sharing}/>
                })

                }
                
                <Divider/>

                <Button color='teal' onClick={addSharing}>Add sharing</Button>
            </Form>

        </Fragment>
    )
}

export default CourseSharing

CourseSharing.propTypes = {
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    updateCourse: PropTypes.func
}

CourseSharing.defaultProps = {}
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Header, List, Button} from "semantic-ui-react";
import CourseRenderer from "../component/CourseRenderer";

const CourseOverview = ({courseService, cocosUser, onSelectCourse, onCreateCourse}) => {

    const [courses, setCourses] = useState()

    useEffect(() => {
        if (!cocosUser) return
        courseService.getCourses(cocosUser).then(res => {
            setCourses(res)
        })
    }, [cocosUser, courseService])

    if (!courses) return null

    console.log('COURSES', courses)
    return (
        <div className='flex-container'>
            <div style={{marginTop: '30px'}} className='content-container'>

                <Button style={{alignSelf: 'flex-end'}} icon='plus' color='teal' onClick={onCreateCourse}>Create new course</Button>

                <Header as='h2'>My own courses</Header>
                <List divided relaxed>
                    {courses.ownedCourses.map((course, index) => {
                        return (
                            <CourseRenderer key={index} course={course} onSelect={onSelectCourse}/>
                        )
                    })}
                </List>
                <Header as='h2'>Shared with me</Header>
                <List divided relaxed>
                    {courses.sharedCourses.map((course, index) => {
                        return (
                            <CourseRenderer key={index} course={course} onSelect={onSelectCourse}/>
                        )
                    })}
                </List>
            </div>
        </div>
    )
}

export default  CourseOverview

CourseOverview.propTypes = {
    courseService: PropTypes.object,
    cocosUser: PropTypes.object,
    onSelectCourse: PropTypes.func,
    onCreateCourse: PropTypes.func
}

CourseOverview.defaultProps = {

}
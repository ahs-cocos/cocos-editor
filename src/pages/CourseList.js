import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {List, Button, Icon, Divider} from "semantic-ui-react";
import CourseRenderer from "../component/CourseRenderer";

const CourseList = ({courses, onSelectCourse, onCreateCourse}) => {


    if (!courses) return null

    return (
        <div className='flex-container'>
            <div style={{marginTop: '30px'}} className='content-container'>

                <div style={{alignSelf: 'flex-end'}}><Button color='teal' onClick={onCreateCourse}><Icon name='plus'/>Create new course</Button></div>

                <Divider/>
                <div className='subheader'>Courses owned by me</div>

                {courses.ownedCourses.length === 0 &&
                <div>
                    <p>You don't have any courses yet. Start by <a className='link' href='# ' onClick={onCreateCourse}>creating one</a></p>
                </div>}

                <List divided relaxed>
                    {courses.ownedCourses.map((course, index) => {
                        return (
                            <NavLink to={`course/${course.uuid}`}>
                                <CourseRenderer key={index} course={course} onSelect={onSelectCourse}/>
                            </NavLink>
                        )
                    })}
                </List>
                {/* <Header as='h2'>Shared with me</Header>*/}
                <div className='subheader'>Courses shared with me</div>


                {courses.sharedCourses.length === 0 &&
                <div>
                    <p>You don't have shared courses at this moment.</p>
                </div>}

                <List divided relaxed>
                    {courses.sharedCourses.map((course, index) => {
                        return (
                            <NavLink to={`course/${course.uuid}`}>
                                <CourseRenderer key={index} course={course} onSelect={onSelectCourse}/>
                            </NavLink>
                        )
                    })}
                </List>
            </div>
        </div>
    )
}

export default CourseList

CourseList.propTypes = {
    courses: PropTypes.object.isRequired,
    onSelectCourse: PropTypes.func,
    onCreateCourse: PropTypes.func
}

CourseList.defaultProps = {}
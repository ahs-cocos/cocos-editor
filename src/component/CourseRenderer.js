import React from 'react'
import PropTypes from 'prop-types'
import {Header, Segment, Divider} from "semantic-ui-react";
import CourseInfo from "./CourseInfo";

const CourseRenderer = ({course, onSelect}) => {

    return (
        <Segment style={{cursor: 'pointer'}} onClick={() => onSelect(course)}>
            <Header as='h3' color='blue'>{course.title}</Header>
            <CourseInfo course={course}/>
            <div className='course-info'>Unique course id: {course.uuid}</div>
            <Divider/>
            <p>{course.description}</p>
        </Segment>
    )
}

export default  CourseRenderer

CourseRenderer.propTypes = {
    course: PropTypes.object.isRequired,
    onSelect: PropTypes.func
}

CourseRenderer.defaultProps = {

}
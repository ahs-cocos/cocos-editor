import React, {useState, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import ServiceContext from "../../../context/ServiceContext";
import CourseList from "./CourseList";
import CourseDetail from "./CourseDetail";

const BoCourseView = (props) => {

    const [courses, setCourses] = useState()
    const serviceContext = useContext(ServiceContext)

    useEffect(() => {
        console.log('SC', serviceContext)
        serviceContext.courseService.getAllCourses().then(courses => {
            console.log('COURSES', courses)
        })
    }, [])

    return (
        <div style={{display: 'flex'}}>
            <CourseList/>
            <CourseDetail/>
        </div>
    )
}

export default  BoCourseView

BoCourseView.propTypes = {

}

BoCourseView.defaultProps = {

}

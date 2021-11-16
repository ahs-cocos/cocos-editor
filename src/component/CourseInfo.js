import React from 'react'
import PropTypes from 'prop-types'
import moment from "moment";
import {ComponentIdentifier} from "./ComponentIdentifier";

const CourseInfo = ({course}) => {

    return (
        <div className='course-info'>
            <ComponentIdentifier displayName='CourseInfo'/>

            {`Created on ${moment(course.date_created).format('MMM DD YYYY')} by ${course.ownerDisplayName} | Last modified on ${moment(course.date_modified).format('MMM DD YYYY')} at ${moment(course.date_modified).format('HH:mm')} by ${course.lastModifiedByDisplayName}`}
        </div>
    )
}

export default CourseInfo

CourseInfo.propTypes = {
    course: PropTypes.object.isRequired
}

CourseInfo.defaultProps = {}

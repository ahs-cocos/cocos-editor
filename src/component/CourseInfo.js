import React, {useState} from 'react'
import PropTypes from 'prop-types'
import moment from "moment";

const CourseInfo = ({course}) => {

    return (
        <div className='course-info'>
            {`Created on ${moment(course.date_created).format('DD-MM-YYYY')} by ${course.ownerDisplayName} | Last modified on ${moment(course.date_modified).format('DD-MM-YYYY')} by ${course.lastModifiedByDisplayName}`}
        </div>
    )
}

export default CourseInfo

CourseInfo.propTypes = {
    course: PropTypes.object.isRequired
}

CourseInfo.defaultProps = {}
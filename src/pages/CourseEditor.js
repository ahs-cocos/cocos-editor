import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Header} from "semantic-ui-react";
import EditorOutlinePane from "../component/EditorOutlinePane";
import CourseOverview from "../component/CourseOverview";

const CourseEditor = ({course, cocosUser, onBackToOverviewButtonClick, updateCourse}) => {

    const [currentView, setCurrentView] = useState('overview')

    return (
        <div className='flex-container'>

            <EditorOutlinePane course={course} cocosUser={cocosUser}
                               onBackToOverviewButtonClick={onBackToOverviewButtonClick}
                               onEditOverviewClick={() => setCurrentView('overview')}/>

            <div className='editor-center-column'>
                {currentView === 'overview' &&
                <CourseOverview course={course} cocosUser={cocosUser} updateCourse={updateCourse}/>
                }
            </div>

            <div className='editor-right-column'>Right</div>
        </div>
    )
}

export default CourseEditor

CourseEditor.propTypes = {
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    onBackToOverviewButtonClick: PropTypes.func,
    updateCourse: PropTypes.func
}

CourseEditor.defaultProps = {}
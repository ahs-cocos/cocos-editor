import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Header, Divider} from "semantic-ui-react";
import {CourseOutline} from 'cocos-lib'

const EditorOutlinePane = ({
                               course,
                               updateCourse,
                               onNodeSelect,
                               publicationClassFunction,
                               editable
                           }) => {

    const [courseOutline, setCourseOutline] = useState()

    useEffect(() => {

        const treeData = [
            {id: 2, title: 'My first chapter'}
        ]

        if (!course.outline) course.outline = treeData
        setCourseOutline(course.outline)
    }, [course.outline])

    const deleteCheckFunction = (node) => {
        //prohibit delete if node has content attached to it
        return true
    }

    const onTreeUpdate = (treeData) => {
        course.outline = treeData
        updateCourse(course)
    }

    if (!courseOutline) return null

    return (
        <div className='editor-left-column'>

            {/*<div className='subheader'>Course outline</div>*/}
            <Header>Course outline</Header>

            <Divider style={{marginTop: 0}}/>
            
            <CourseOutline courseOutline={courseOutline}
                           editable={editable}
                           onTreeUpdate={onTreeUpdate}
                           onNodeSelect={onNodeSelect}
                           publicationClassFunction={publicationClassFunction}
                           deleteCheckFunction={deleteCheckFunction}/>
        </div>
    )
}

export default EditorOutlinePane

EditorOutlinePane.propTypes = {
    course: PropTypes.object.isRequired,
    updateCourse: PropTypes.func,
    onNodeSelect: PropTypes.func,
    publicationClassFunction: PropTypes.func,
    editable: PropTypes.bool
}

EditorOutlinePane.defaultProps = {
    editable: true
}
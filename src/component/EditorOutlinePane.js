import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Header, Icon, Divider, Button} from "semantic-ui-react";
import {CourseOutline} from 'cocos-lib'

const EditorOutlinePane = ({course, cocosUser, onBackToOverviewButtonClick, onEditOverviewClick}) => {

    const [courseOutline, setCourseOutline] = useState()

    useEffect(() => {
        /*console.log('OUTLINE', course)
        const outline = JSON.parse(course.outline)
        console.log('OUTLINE', outline)*/
        const treeData = [
            {id: 2, title: 'My first chapter'}
        ]

        setCourseOutline(treeData)
    }, [])

    const deleteCheckFunction = (node) => {
        //prohibit delete if node has content attached to it
        return true
    }

    const onTreeUpdate = (treeData) => {
        const jsonTreeData = JSON.stringify(treeData)
        console.log('UPDATING', jsonTreeData)
    }

    if (!courseOutline) return null

    console.log('OWNER', course, cocosUser)
    return (
        <div className='editor-left-column'>
            <div style={{padding: '15px', width: '100%'}}>
                <Button onClick={onBackToOverviewButtonClick}><Icon name='arrow left'/>Back to courses</Button>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '20px'}}>
                    <Header style={{margin: 0, flexGrow: 1, cursor: 'pointer'}}
                            as='h2' color='blue' onClick={onEditOverviewClick}>{course.title}</Header>
                    {/*<div><Button circular style={{alignSelf: 'flex-end'}} icon='pencil' onClick={onEditOverviewClick}/></div>*/}
                </div>
            </div>
            <Divider/>
            <CourseOutline courseOutline={courseOutline}
                           editable={course.owner === cocosUser.id}
                           onTreeUpdate={onTreeUpdate}
                           deleteCheckFunction={deleteCheckFunction}/>
        </div>
    )
}

export default  EditorOutlinePane

EditorOutlinePane.propTypes = {
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    onBackToOverviewButtonClick: PropTypes.func,
    onEditOverviewClick: PropTypes.func
}

EditorOutlinePane.defaultProps = {

}
import React, {useState, useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import {NavLink} from "react-router-dom";
import {Button, Divider, Header, Icon, Menu} from "semantic-ui-react";

import EditorOutlinePane from "../component/EditorOutlinePane";
import CourseOverview from "../component/CourseOverview";
import OutlineItemDetail from "../component/OutlineItemDetail";
import CourseSharingComp from "../component/CourseSharingComp";
import PublicationComp from "../component/PublicationComp";
import {CommentComp, CommentContext} from "cocos-lib";

const CourseEditor = ({course, cocosUser, onBackToOverviewButtonClick, updateCourse, courseService, deleteCourse, commentService}) => {

    const [currentView, setCurrentView] = useState('overview')
    const [selectedNode, setSelectedNode] = useState()
    const [selectedPublication, setSelectedPublication] = useState()
    const [publicationIds, setPublicationIds] = useState([])
    const [comments, setComments] = useState()

    useEffect(() => {
        commentService.getComments(course).then(res => {
            setComments(res)
        })
    }, [course, commentService])

    const onNodeSelect = (node) => {
        if (!node) {
            setSelectedNode(null)
            setCurrentView('overview')
            return
        }

        if (selectedPublication) {
            console.log('TOGGLING', node)
            let newIds
            if (publicationIds.indexOf(node.id) > -1) {
                newIds = publicationIds.filter(id => id !== node.id)
            } else {
                newIds = [...publicationIds, node.id]
            }

            setPublicationIds(newIds)
            selectedPublication.outline_ids = newIds.join(',')
            //immediate save --silent
            courseService.updatePublication(selectedPublication)
        } else {
            setCurrentView('outlineDetail')
            if (node) setSelectedNode(node)
        }

    }

    const onSelectPublication = (publication) => {
        setSelectedPublication(publication)
        setPublicationIds(publication ? publication.outline_ids.split(',').map(id => parseInt(id)) : [])
    }

    const publicationClassFunction = (rowInfo) => {

        if (!selectedPublication || currentView !== 'publication') {
            setSelectedPublication(null)
            rowInfo.node.classes = ''
            return
        }

        rowInfo.node.classes = publicationIds.indexOf(rowInfo.node.id) > -1 ? 'published' : ''
    }

    const onSettingsButtonClick = (event, {active}) => {
        active ? onNodeSelect() : setCurrentView('overview')
    }

    const createComment = (comment) => {
        commentService.createComment(comment).then(res => {
            console.log('COMMENT', res)
            setComments([...comments, res])
        })
    }

    const deleteComment = (comment) => {

        const answer = window.confirm('Are you sure you want to delete this comment?')

        if (answer) {
            commentService.deleteComment(comment).then(res => {
                setComments(comments.filter(c => c.id !== comment.id))
            })
        }
    }

    return (
        <Fragment>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#bbbbbb', paddingRight: '50px'}}>
                <NavLink to='/courses'><Button size='mini' onClick={onBackToOverviewButtonClick}><Icon name='arrow left'/>Back to courses</Button></NavLink>
                <Header as='h2' style={{margin: 0, color: '#333333'}}>{course.title}</Header>
                <Button size='mini' floated='right'
                        color={currentView !== 'outlineDetail' ? 'teal' : 'grey'} onClick={onSettingsButtonClick}>Course settings</Button>
            </div>

            <div className='flex-container'>

                <EditorOutlinePane course={course}
                                   editable={(course.owner === cocosUser.id) && !selectedPublication}
                                   updateCourse={updateCourse}
                                   onNodeSelect={onNodeSelect}
                                   publicationClassFunction={publicationClassFunction}/>

                <div className='editor-center-column'>

                    {currentView !== 'outlineDetail' &&
                    <Menu pointing secondary>
                        <Menu.Item
                            name='overview'
                            active={currentView === 'overview'}
                            onClick={() => setCurrentView('overview')}
                        />
                        <Menu.Item
                            name='cover'
                            active={currentView === 'cover'}
                            onClick={() => setCurrentView('cover')}
                        />
                        <Menu.Item
                            name='sharing'
                            active={currentView === 'sharing'}
                            onClick={() => setCurrentView('sharing')}
                        />
                        <Menu.Item
                            name='publication'
                            active={currentView === 'publication'}
                            onClick={() => setCurrentView('publication')}
                        />
                    </Menu>}


                    {currentView === 'overview' &&
                    <CourseOverview course={course} cocosUser={cocosUser} updateCourse={updateCourse} deleteCourse={deleteCourse}/>
                    }

                    {currentView === 'cover' &&
                    <div>Coming soon</div>
                    }

                    {currentView === 'sharing' &&
                    <CourseSharingComp course={course} cocosUser={cocosUser} updateCourse={updateCourse} courseService={courseService}/>
                    }

                    {currentView === 'publication' &&
                    <PublicationComp course={course} cocosUser={cocosUser}
                                     updateCourse={updateCourse}
                                     onSelectPublication={onSelectPublication}
                                     courseService={courseService}/>
                    }

                    {(currentView === 'outlineDetail' && !selectedNode) &&
                    <div className='center-on-page'>
                        <p>Select an outline item on the left to start editing</p>
                    </div>
                    }

                    {(currentView === 'outlineDetail' && selectedNode) &&
                    <OutlineItemDetail courseService={courseService}
                                       course={course}
                                       updateCourse={updateCourse}
                                       cocosUser={cocosUser}
                                       node={selectedNode}/>
                    }
                </div>

                <div className='editor-right-column'>
                    <Header>Comments</Header>
                    <Divider style={{marginTop: 0}}/>
                    <CommentComp comments={comments}
                                 outline={selectedNode}
                                 course={course}
                                 context={CommentContext.EDITOR}
                                 commentService={commentService}
                                 cocosUser={cocosUser}
                                 createComment={createComment}
                                 deleteComment={deleteComment}/>
                </div>
            </div>
        </Fragment>
    )
}

export default CourseEditor

CourseEditor.propTypes = {
    courseService: PropTypes.object.isRequired,
    commentService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    onBackToOverviewButtonClick: PropTypes.func,
    updateCourse: PropTypes.func,
    deleteCourse: PropTypes.func,
}

CourseEditor.defaultProps = {}
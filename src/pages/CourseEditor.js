import React, {useState, Fragment} from 'react'
import PropTypes from 'prop-types'
import {NavLink} from "react-router-dom";
import {Button, Divider, Header, Icon, Menu} from "semantic-ui-react";
import EditorOutlinePane from "../component/EditorOutlinePane";
import CourseOverview from "../component/CourseOverview";
import OutlineItemDetail from "../component/OutlineItemDetail";
import CourseSharingComp from "../component/CourseSharingComp";
import PublicationComp from "../component/PublicationComp";

const CourseEditor = ({course, cocosUser, onBackToOverviewButtonClick, updateCourse, courseService, deleteCourse}) => {

    const [currentView, setCurrentView] = useState('overview')
    const [selectedNode, setSelectedNode] = useState()
    const [selectedPublication, setSelectedPublication] = useState()
    const [publicationIds, setPublicationIds] = useState([])

    const onNodeSelect = (node) => {
        if (!node) {
            setSelectedNode(null)
            setCurrentView('overview')
            return
        }

        if (selectedPublication){
            console.log('TOGGLING', node)
            let newIds
            if (publicationIds.indexOf(node.id) > -1){
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

        if (!selectedPublication || currentView !== 'publication'){
            setSelectedPublication(null)
            rowInfo.node.classes = ''
            return
        }

        rowInfo.node.classes = publicationIds.indexOf(rowInfo.node.id) > -1 ? 'published' : ''
    }

    const onSettingsButtonClick = (event, {active}) => {
        active ? onNodeSelect() : setCurrentView('overview')
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
                    <Header>Annotations</Header>

                    <Divider style={{marginTop: 0}}/>
                </div>
            </div>
        </Fragment>
    )
}

export default CourseEditor

CourseEditor.propTypes = {
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    onBackToOverviewButtonClick: PropTypes.func,
    updateCourse: PropTypes.func,
    deleteCourse: PropTypes.func,
}

CourseEditor.defaultProps = {}
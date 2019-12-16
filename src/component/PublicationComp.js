import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {Button, Divider} from "semantic-ui-react";
import {CoursePublishing, PublishingType} from "cocos-lib";
import PublishingRenderer from "./PublishingRenderer";

const CoursePublishingComp = ({course, cocosUser, courseService}) => {

    const [coursePublishing, setCoursePublishing] = useState(null)

    useEffect(() => {
        console.log('P', courseService, course)
        courseService.getCoursePublishing(course).then(res => {
            console.log('PUBLISHING', res)
            setCoursePublishing(res)
        })
    }, [course, courseService])


    const addPublishing = () => {
        const publication = new CoursePublishing()
        publication.course = course.id
        publication.type = PublishingType.HTML

        courseService.createPublishing(publication).then(res => {
            setCoursePublishing([...coursePublishing, res])
        })
    }

    const onRemovePublishing = (publication) => {

        const answer = window.confirm('Are you sure you want to remove this publication?')

        if (!answer) return

        courseService.deletePublishing(publication).then(res => {
            setCoursePublishing(coursePublishing.filter(p => p.id !== publication.id))
        })
    }

    const onUpdatePublishing = (publication) => {
        courseService.updatePublishing(publication).then(res => {
            setCoursePublishing([...coursePublishing])
        })
    }

    if (!coursePublishing) return null

    return (

        <Fragment>

            <div className='subheader'>Course Publishing</div>
            <div style={{marginTop: '30px'}}>
                <p>Course publishing lets you select one or more course outline items and export the content to mulitple output formats. It will create one or more files (publications) which can subsquently consumed by multiple implementations of our CoCos Viewer.</p>

                {coursePublishing.length === 0 &&
                <div>
                    <p>You don't have any publications yet.</p>
                </div>
                }

                {coursePublishing.map((publication, index) => {
                    return <PublishingRenderer key={index}
                                               course={course}
                                               publication={publication}
                                               onRemovePublishing={onRemovePublishing}
                                               onUpdatePublishing={onUpdatePublishing}/>
                })

                }

                <Divider/>

                <Button color='teal' onClick={addPublishing}>Add publication</Button>

            </div>

        </Fragment>
    )
}

export default CoursePublishingComp

CoursePublishingComp.propTypes = {
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    updateCourse: PropTypes.func
}

CoursePublishingComp.defaultProps = {}
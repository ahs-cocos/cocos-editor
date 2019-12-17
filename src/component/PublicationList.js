import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import PublicationRenderer from "./PublicationRenderer";
import {Button, Divider} from "semantic-ui-react";
import {Publication, PublicationStatus, CourseUtil} from "cocos-lib";

const PublicationList = ({course, cocosUser, courseService, onEditPublication}) => {

    const [publications, setPublications] = useState(null)

    useEffect(() => {
        console.log('P', courseService, course)
        courseService.getPublications(course).then(res => {
            console.log('PUBLISHING', res)
            setPublications(res)
        })
    }, [course, courseService])


    const addPublication = () => {
        const ids = CourseUtil.getFlatCourseOutline(course)
        const publication = new Publication()
        publication.course = course.id
        publication.status = PublicationStatus.NEW
        //by default, all outline items should be enabled
        publication.outline_ids = ids.join(',')

        courseService.createPublication(publication).then(res => {
            setPublications([...publications, res])
        })
    }

    const onRemovePublication = (publication) => {

        const answer = window.confirm('Are you sure you want to remove this publication?')

        if (!answer) return

        courseService.deletePublication(publication).then(res => {
            setPublications(publications.filter(p => p.id !== publication.id))
        })
    }

    const onUpdatePublication = (publication) => {
        courseService.updatePublication(publication).then(res => {
            setPublications([...publications])
        })
    }

    if (!publications) return null

    return (
        <div>
            {/*<div className='subheader'>Course Publications</div>*/}
            <div style={{marginTop: '30px'}}>
                <p>Publications lets you select one or more course outline items and export the content to mulitple output formats. It will create one or more files (publications) which can
                    subsquently consumed by multiple implementations of our CoCos Viewer.</p>

                {publications.length === 0 &&
                <div>
                    <p>You don't have any publications yet.</p>
                </div>
                }

                {publications.map((publication, index) => {
                    return <PublicationRenderer key={index}
                                                course={course}
                                                publication={publication}
                                                onRemovePublication={onRemovePublication}
                                                onUpdatePublication={onUpdatePublication}
                                                onEditPublication={() => onEditPublication(publication)}/>
                })

                }

                <Divider/>

                <Button color='green' onClick={addPublication}>Add publication</Button>

            </div>
        </div>
    )
}

export default PublicationList

PublicationList.propTypes = {
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    onEditPublication: PropTypes.func
}

PublicationList.defaultProps = {}
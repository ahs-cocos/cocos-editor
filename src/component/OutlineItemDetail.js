import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button} from "semantic-ui-react";
import ContentBlockComp from "./ContentBlockComp";
import {ContentBlock} from 'cocos-lib'
import moment from "moment";
import _ from 'lodash'

const OutlineItemDetail = ({courseService, course, cocosUser, updateCourse, node}) => {

    const [contentBlocks, setContentBlocks] = useState()
    const [selectedContentBlock, setSelectedContentBlock] = useState()

    useEffect(() => {
        courseService.getContentBlocks(course, node.id).then(res => {
            setContentBlocks(_.orderBy(res, 'sort'))
        })
    }, [course, node, courseService])

    const onContentBlockMenuClick = (role, contentBlock) => {

        console.clear()
        if (!contentBlocks) return


        if (selectedContentBlock) selectedContentBlock.animate = false

        const cbIndex = contentBlocks.indexOf(contentBlock)
        console.log('CLICK', role, contentBlock, cbIndex)

        let previousBlock, nextBlock, newSort, newContentBlock = new ContentBlock()

        if (cbIndex > 0) {
            previousBlock = contentBlocks[cbIndex - 1]
        }
        if (cbIndex < contentBlocks.length - 1) {
            nextBlock = contentBlocks[cbIndex + 1]
        }

        newContentBlock.created_by = cocosUser.id
        newContentBlock.modified_by = cocosUser.id
        newContentBlock.date_created = moment().format("YYYY-MM-DD HH:mm:ss")
        newContentBlock.date_modified = moment().format("YYYY-MM-DD HH:mm:ss")
        newContentBlock.outline = node.id
        newContentBlock.course = course.id
        newContentBlock.animate = true

        switch (role) {
            case 'insertAbove':
                if (previousBlock) {
                    newSort = contentBlock.sort - (contentBlock.sort - previousBlock.sort) / 2
                } else {
                    newSort = contentBlock.sort / 2
                }
                newContentBlock.sort = newSort

                courseService.createContentBlock(newContentBlock).then(res => {
                    setSelectedContentBlock(res)
                    setContentBlocks(_.orderBy(contentBlocks.map(cb => {return {...cb}}), res, 'sort'))
                })
                break
            case 'insertBelow':
                if (nextBlock) {
                    newSort = contentBlock.sort + (nextBlock.sort - contentBlock.sort) / 2
                } else {
                    newSort = contentBlock.sort + 1000
                }
                newContentBlock.sort = newSort

                courseService.createContentBlock(newContentBlock).then(res => {
                    setSelectedContentBlock(res)
                    setContentBlocks(_.orderBy(contentBlocks.map(cb => {return {...cb}}), res, 'sort'))
                })
                break
            case 'moveUp':
                if (!previousBlock) return;
                courseService.swapContentBlockSorts(contentBlock, previousBlock).then(res => {
                    setContentBlocks(_.orderBy(contentBlocks.map(cb => {return {...cb}}), 'sort'))
                })
                break
            case 'moveDown':
                if (!nextBlock) return;
                courseService.swapContentBlockSorts(contentBlock, nextBlock).then(res => {
                    setContentBlocks(_.orderBy(contentBlocks.map(cb => {return {...cb}}), 'sort'))
                })
                break
            case 'delete':
                const answer = window.confirm("Are you sure you want to delete this content block? This is irreversible. All content within this block will be deleted")

                if (answer){

                    courseService.deleteContentBlock(contentBlock).then(res => {
                        console.log('DELETED')
                        setContentBlocks([...contentBlocks.filter(cb => cb.id !== contentBlock.id)].map(cb => {return {...cb}}))
                    })
                }
                break
            default:
                break
        }

        updateCourse(course)
    }

    const onContentBlockTypeChange = (contentBlock, type) => {

        contentBlock.type = type
        courseService.updateContentBlock(contentBlock)
        updateCourse(course)
        setContentBlocks(_.orderBy(contentBlocks.map(cb => {return {...cb}}), 'sort'))
    }

    const createContentBlock = () => {

        const newContentBlock = new ContentBlock()
        newContentBlock.created_by = cocosUser.id
        newContentBlock.modified_by = cocosUser.id
        newContentBlock.date_created = moment().format("YYYY-MM-DD HH:mm:ss")
        newContentBlock.date_modified = moment().format("YYYY-MM-DD HH:mm:ss")
        newContentBlock.outline = node.id
        newContentBlock.course = course.id

        courseService.createContentBlock(newContentBlock).then(res => {
            res.animate = true
            setContentBlocks(_.orderBy([...contentBlocks, res], 'sort'))
        })
        updateCourse(course)
    }

    if (!contentBlocks) return null

    return (
        <div style={{height: '100%'}}>

            {contentBlocks.map((contentBlock, index) => {
                const isFirst = index === 0
                const isLast = index === contentBlocks.length - 1
                return (<ContentBlockComp key={index} animate={contentBlock.animate}
                                          courseService={courseService}
                                          course={course} updateCourse={updateCourse}
                                          contentBlock={contentBlock}
                                          onContentBlockMenuClick={onContentBlockMenuClick}
                                          onContentBlockTypeChange={onContentBlockTypeChange}
                                          isFirst={isFirst} isLast={isLast}/>)
            })}

            {contentBlocks.length === 0 &&
            <div className='center-on-page'>
                <p>No content block yet</p>
                <p>You may leave this outline item empty<br/>if you want to use it just as a title</p>
                <Button onClick={createContentBlock} color='green'>Create content block</Button>
            </div>
            }
        </div>
    )
}

export default OutlineItemDetail

OutlineItemDetail.propTypes = {
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    updateCourse: PropTypes.func,
    node: PropTypes.object
}

OutlineItemDetail.defaultProps = {}
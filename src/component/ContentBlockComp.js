import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {Header, Segment, Divider, Button, Icon} from "semantic-ui-react";
import ContentBlockMenu from "./ContentBlockMenu";
import ContentBlockMenuItem from "./ContentBlockMenuItem";
import {ContentBlockType} from "cocos-lib";
import RTEditor from './RTEditor'

const ContentBlockComp = ({contentBlock, courseService, onContentBlockMenuClick, onContentBlockTypeChange, isFirst, isLast, animate}) => {

    const [contentBlockData, setContentBlockData] = useState("<p>Start making your course!</p>")
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [isDirty, setIsDirty] = useState(false)
    const [modifiedData, setModifiedData] = useState()

    const feedbackRef = useRef()

    useEffect(() => {
        courseService.getContentBlockData(contentBlock).then(res => {
            console.log('SETTING DATA', res, contentBlock.id)
            setContentBlockData(res)
            setIsDirty(false)
        })
    }, [contentBlock, courseService])


    const onRTContentChange = (data) => {
        setIsDirty(true)
        setModifiedData(data)
    }

    const onSaveButtonClick = () => {
        console.log('SAVING', modifiedData)
        setIsDirty(false)
        courseService.saveContentBlockData(contentBlock, modifiedData).then(res =>{
            setIsDirty(false)
            setFeedbackMessage('Saved')
            setTimeout(() => feedbackRef.current && feedbackRef.current.classList.add("hidden"), 300)
        })
    }

    const onRTContentAutoSave = (data) => {
        return
        console.log('SAVING', data, feedbackRef)
        if (feedbackRef.current){
            feedbackRef.current.classList.remove("hidden");
            feedbackRef.current.classList.add("visible");
            setFeedbackMessage('Saving...')
        }
        courseService.saveContentBlockData(contentBlock, data).then(res =>{
            setFeedbackMessage('Saved')
            setTimeout(() => feedbackRef.current && feedbackRef.current.classList.add("hidden"), 300)
        })
    }

    return (
        <div className={animate ? 'content-block' : ''}>

            <ContentBlockMenu>
                <ContentBlockMenuItem type='string' name='Insert new content block above' role='insertAbove'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
                <ContentBlockMenuItem enabled={!isFirst} name='arrow up' tooltip='Move content block up' role='moveUp'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
                <ContentBlockMenuItem enabled={!isLast} name='arrow down' tooltip='Move content block down' role='moveDown'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
                <ContentBlockMenuItem name='trash alternate outline' role='delete'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
            </ContentBlockMenu>

            <Segment attached style={{padding: 0}}>

                {contentBlock.type &&
                <div>

                    {contentBlock.type === ContentBlockType.RICH_TEXT &&
                    <div>
                        <p>id {contentBlock.id}</p>
                        <p>outline {contentBlock.outline}</p>
                        <RTEditor onChange={onRTContentChange} data={contentBlockData} onAutoSave={onRTContentAutoSave}/>
                    </div>}
                </div>
                }

                {!contentBlock.type &&
                <div style={{padding: '20px'}}>
                    <Header>Please choose a content block type</Header>
                    <Segment>
                        <p>Rich Text allows you to add styled text and images. Use this type to add non-interactive content.</p>
                        <Button color='green' size='mini'
                                onClick={() => onContentBlockTypeChange(contentBlock, ContentBlockType.RICH_TEXT)}>Create Rich Text content</Button>
                    </Segment>
                    <Segment>
                        <p>H5P allows you to create all sorts of questions.</p>
                        <Button color='green' size='mini'
                                onClick={() => onContentBlockTypeChange(contentBlock, ContentBlockType.H5P)}>Create H5P content</Button>
                    </Segment>
                </div>
                }
            </Segment>

            <ContentBlockMenu>
                <ContentBlockMenuItem type='string' name='Insert new content block below' role='insertBelow'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
                {isDirty && <ContentBlockMenuItem enabled={isDirty} color='green' name='save' role='save'
                                      onClick={onSaveButtonClick}/>}
                <div className='visible' ref={feedbackRef} style={{paddingLeft: '10px', color: '#666666'}}>{feedbackMessage}</div>
            </ContentBlockMenu>

            <Divider/>
        </div>
    )
}

export default ContentBlockComp

ContentBlockComp.propTypes = {
    courseService: PropTypes.object.isRequired,
    contentBlock: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    updateCourse: PropTypes.func,
    onContentBlockMenuClick: PropTypes.func,
    onContentBlockTypeChange: PropTypes.func,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    animate: PropTypes.bool
}

ContentBlockComp.defaultProps = {
    isFirst: false,
    isLast: false,
    animate: false
}
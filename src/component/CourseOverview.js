import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {NavLink} from "react-router-dom";
import {Form, Button, Icon, Divider, Segment, Label} from "semantic-ui-react";
import {MultiSelect} from "cocos-lib";

const {CopyToClipboard} = require('react-copy-to-clipboard')

const CourseOverview = ({course, cocosUser, updateCourse, deleteCourse}) => {

    const [courseTags, setCourseTags] = useState(course.tags)
    const [courseTitle, setCourseTitle] = useState(course.title)
    const [courseDescription, setCourseDescription] = useState(course.description)
    const [isDirty, setIsDirty] = useState(false)
    const [uuidCopied, setUuidCopied] = useState(false)

    useEffect(() => {
        setCourseTags(course.tags || '')
    }, [course])

    const onChange = (event, {name, value}) => {
        switch (name) {
            case 'title':
                setCourseTitle(value)
                break
            case 'description':
                setCourseDescription(value)
                break
            default:
                break
        }
        setIsDirty(true)
    }

    const onChangeTags = (value) => {
        setCourseTags(value)
        setIsDirty(true)
    }

    const update = () => {
        course.title = courseTitle
        course.description = courseDescription
        course.tags = courseTags
        updateCourse(course)
        setIsDirty(false)
    }

    return (

        <Fragment>


           {/* <div className='subheader'>Course overview</div>*/}
            <Form>



                <Form.TextArea style={{fontSize: '1.4em', fontWeight: 'bold'}}
                               label='Course title'
                               value={courseTitle}
                               name='title'
                               onChange={onChange}
                               placeholder='Enter course title'/>

                <Form.TextArea style={{height: '200px'}}
                               label='Course description'
                               value={courseDescription}
                               name='description'
                               onChange={onChange}
                               placeholder='Enter course description'/>

                <Form.Field>
                    <label>Tags</label>
                    <MultiSelect delimiterSeparatedDataString={courseTags} onChange={onChangeTags}/>
                </Form.Field>

                <Form.Field>
                    <label>Course unique id</label>
                    <Segment>
                        <Label>{course.uuid}
                            <CopyToClipboard text={course.uuid}
                                             onCopy={() => setUuidCopied(true)}>
                                <Button circular style={{width: '24px', height: '24px', padding: 0, marginLeft: '20px'}}
                                        color={uuidCopied ? 'green' : 'grey'} icon={uuidCopied ? 'check' : 'clipboard'}/>

                            </CopyToClipboard>
                        </Label>

                    </Segment>
                </Form.Field>


                {isDirty && <div><Divider/><Button type='submit' color='teal' onClick={update}>Update</Button></div>}
            </Form>


            <Divider/>

            {course.owner === cocosUser.id &&
            <Fragment>
                <div className='subheader'>Danger zone</div>
                <p><Icon name='warning'/>Warning: deleting a course is irreversible. You'll get a second warnning.</p>
                <NavLink to='/courses'><Button color='red' onClick={() => deleteCourse(course)}>Delete course</Button></NavLink>
            </Fragment>
            }
        </Fragment>
    )
}

export default CourseOverview

CourseOverview.propTypes = {
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    updateCourse: PropTypes.func,
    deleteCourse: PropTypes.func,
}

CourseOverview.defaultProps = {}
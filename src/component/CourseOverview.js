import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Form, Button, Icon, Divider} from "semantic-ui-react";
import {MultiSelect} from "cocos-lib";

const CourseOverview = ({course, cocosUser, updateCourse, deleteCourse}) => {

    const [courseTags, setCourseTags] = useState(course.tags)
    const [courseTitle, setCourseTitle] = useState(course.title)
    const [courseDescription, setCourseDescription] = useState(course.description)
    const [isDirty, setIsDirty] = useState(false)

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

                {isDirty && <div><Divider/><Button type='submit' color='teal' onClick={update}>Update</Button></div>}
            </Form>


            <Divider/>

            {course.owner === cocosUser.id &&
            <Fragment>
                <div className='subheader'>Danger zone</div>
                <p><Icon name='warning'/>Warning: deleting a course is irreversible. You'll get a second warnning.</p>
                <Button color='red' onClick={() => deleteCourse(course)}>Delete course</Button>
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
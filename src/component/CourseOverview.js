import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Form, Button, Select} from "semantic-ui-react";
import CourseInfo from "./CourseInfo";
import {MultiSelect} from "cocos-lib";

const CourseOverview = ({course, cocosUser, updateCourse}) => {

    const [courseTags, setCourseTags] = useState(course.tags)
    const [courseTitle, setCourseTitle] = useState(course.title)
    const [courseDescription, setCourseDescription] = useState(course.description)
    const [isDirty, setIsDirty] = useState(false)

    useEffect(() => {
        setCourseTags(course.tags || '')
    }, [course])

    const onChange = (event, {name, value}) => {
        switch(name){
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

        <Form>

            <Form.TextArea style={{fontSize: '1.8em', fontWeight: 'bold'}}
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

            {isDirty && <Button type='submit' color='teal' onClick={update}>Update</Button>}
        </Form>
    )
}

export default  CourseOverview

CourseOverview.propTypes = {
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    updateCourse: PropTypes.func
}

CourseOverview.defaultProps = {

}
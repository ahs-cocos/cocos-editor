import React, {Fragment, useState, useEffect} from 'react'
import PropTypes from 'prop-types'

import {Button, Divider} from "semantic-ui-react";
import {Publication, PublicationType, PublicationStatus} from "cocos-lib";
import PublicationRenderer from "./PublicationRenderer";
import PublicationList from "./PublicationList";
import PublicationDetail from "./PublicationDetail";

const PublicationComp = ({course, cocosUser, courseService, onSelectPublication}) => {

    const [view, setView] = useState('list')
    const [selectedPublication, setSelectedPublication] = useState()


    const onEditPublication = (publication) => {
        setView('detail')
        setSelectedPublication(publication)
        onSelectPublication && onSelectPublication(publication)
    }

    const onEditEnd = () => {
        courseService.updatePublication(selectedPublication).then(res => {
            setSelectedPublication(null)
            onSelectPublication && onSelectPublication(null)
            setView('list')
        })
    }

    return (

        <Fragment>

            {view === 'list' && <PublicationList courseService={courseService} course={course} onEditPublication={onEditPublication}/>}

            {view === 'detail' && selectedPublication &&
            <PublicationDetail courseService={courseService} course={course} cocosUser={cocosUser} publication={selectedPublication} onEditEnd={onEditEnd}/>
            }
        </Fragment>
    )
}

export default PublicationComp

PublicationComp.propTypes = {
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    updateCourse: PropTypes.func,
    onSelectPublication: PropTypes.func,
}

PublicationComp.defaultProps = {}
import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'

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

    /*const onEditEnd = () => {
        courseService.updatePublication(selectedPublication).then(res => {
            setSelectedPublication(null)
            onSelectPublication && onSelectPublication(null)
            setView('list')
        })
    }*/

    return (

        <Fragment>

            {view === 'list' && <PublicationList courseService={courseService} course={course} onEditPublication={onEditPublication}/>}

            {view === 'detail' && selectedPublication &&
            <PublicationDetail courseService={courseService} course={course} cocosUser={cocosUser} publication={selectedPublication}/>
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
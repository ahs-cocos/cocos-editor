import React, {useState, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Segment, Header} from "semantic-ui-react";
import moment from "moment";

const VersionRenderer = ({version, deleteable, onDelete}) => {

    const previewPublication = () => {

    }

    return (
        <Segment>
            <Header as='h3'>Version {version.version} - Published on {moment(version.date).format('MMM DD YYYY')} by {version.published_by}</Header>
            <p>Unique id: {version.uuid}</p>
            <div>
                <a className='link' onClick={previewPublication}>Preview this version</a>

                {deleteable && <Fragment>
                    &nbsp;| <a className='link-delete' onClick={() => onDelete(version)}>Delete this version</a>
                </Fragment>}
            </div>

        </Segment>
    )
}

export default  VersionRenderer

VersionRenderer.propTypes = {
    version: PropTypes.object.isRequired,
    deleteable: PropTypes.bool,
    onDelete: PropTypes.func
}

VersionRenderer.defaultProps = {
    deleteable: false
}
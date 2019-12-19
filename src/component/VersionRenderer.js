import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import {Segment, Header, Modal, Button, Icon} from "semantic-ui-react";
import moment from "moment";
import {ApplicationPath} from "cocos-lib";

const Parser = require('html-react-parser')

const VersionRenderer = ({version, deleteable, onDelete, courseService}) => {

    const [modalOpen, setModalOpen] = useState(false)
    const [previewData, setPreviewData] = useState('<p>No preview data</p>')

    const previewPublication = () => {
//test only


            window.open(`${ApplicationPath.serverRoot}/viewer/previewVersion.php?uuid=${version.uuid}`,'_blank');

       /* courseService.getPreviewData(version).then(res => {
            console.log('PUBLISH RES', res)
            setPreviewData(res)
            setModalOpen(true)
        })*/

    }

    return (
        <Fragment>
            <Segment>
                <Header as='h3'>Version {version.version} - Published on {moment(version.date).format('MMM DD YYYY')} by {version.published_by}</Header>
                <p>Unique id: {version.uuid}</p>
                <div>
                    <a className='link' href='# ' onClick={previewPublication}>Preview this version</a>

                    {deleteable && <Fragment>
                        &nbsp;| <a className='link-delete' href='# ' onClick={() => onDelete(version)}>Delete this version</a>
                    </Fragment>}
                </div>

            </Segment>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                basic
                dimmer='inverted'
                size='small'
                centered={false}
            >
                <Header icon='browser' content='Version preview'/>
                <Modal.Content>
                    {Parser(previewData)}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => setModalOpen(false)}>
                        <Icon name='checkmark'/> Close
                    </Button>
                </Modal.Actions>
            </Modal>

        </Fragment>
    )
}

export default VersionRenderer

VersionRenderer.propTypes = {
    courseService: PropTypes.object.isRequired,
    version: PropTypes.object.isRequired,
    deleteable: PropTypes.bool,
    onDelete: PropTypes.func
}

VersionRenderer.defaultProps = {
    deleteable: false
}
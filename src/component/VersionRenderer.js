import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import {Segment, Header, Modal, Button, Icon, Label} from "semantic-ui-react";
import moment from "moment";
import {ApplicationPath} from "cocos-lib";
import {ComponentIdentifier} from "./ComponentIdentifier";

const Parser = require('html-react-parser')
const {CopyToClipboard} = require('react-copy-to-clipboard')

const VersionRenderer = ({version, deleteable, onDelete, courseService}) => {

    const [modalOpen, setModalOpen] = useState(false)
    const [previewData] = useState('<p>No preview data</p>')
    const [uuidCopied, setUuidCopied] = useState(false)


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
            <ComponentIdentifier displayName='VersionRenderer'/>

            <Segment>
                <Header as='h3'>Version {version.version} - Published on {moment(version.date).format('MMM DD YYYY')} by {version.published_by}</Header>
                <div><span style={{marginRight: '10px'}}>Unique id:</span>
                    <Label>{version.uuid}
                        <CopyToClipboard text={version.uuid}
                                         onCopy={() => setUuidCopied(true)}>
                            <Button circular style={{width: '24px', height: '24px', padding: 0, marginLeft: '20px'}}
                                    color={uuidCopied ? 'green' : 'grey'} icon={uuidCopied ? 'check' : 'clipboard'}/>

                        </CopyToClipboard>
                </Label>

                </div>

                <div style={{marginTop: '10px'}}>
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

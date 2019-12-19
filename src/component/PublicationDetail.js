import React, {useState, useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Button, Divider, Label} from "semantic-ui-react";
import VersionRenderer from "./VersionRenderer";
import uuidv4 from 'uuid/v4'
import {PublicationVersion, PublicationStatus} from "cocos-lib";
import moment from "moment";
import _ from 'lodash'

const PublicationDetail = ({publication, courseService, course, onEditEnd, cocosUser}) => {

    const [latestVersion, setLatestVersion] = useState()
    const [previousVersions, setPreviousVersions] = useState([])
    const [previousVersionsVisible, setPreviousVersionsVisible] = useState(false)

    const [versions, setVersions] = useState([])

    useEffect(() => {
        if (!versions || versions.length === 0) {
            courseService.getPublicationVersions(publication).then(res => {
                createVersionLists(res)
            })
        }
    }, [courseService, publication, versions])

    const createVersionLists = (baseVersions) => {

        console.log('BV', baseVersions)
        const allVersions = _.orderBy(baseVersions, ['version'], ['desc'])

        const lVersionId = allVersions.reduce((acc, version) => {
            if (version.version > acc) return version
            return acc
        }, 0)

        if (allVersions.length === 0) return
        const lVersion = allVersions.reduce((acc, version) => {
            if (version.version === lVersionId) return version
            return acc
        })
        const pVersions = allVersions.filter(version => version !== lVersion)

        setVersions(allVersions)
        setLatestVersion(lVersion)
        setPreviousVersions(pVersions)
    }

    const publish = () => {
        const answer = window.confirm('Did you check that you have selected the correct outline items?')

        if (answer) {

            const version = new PublicationVersion()
            version.uuid = uuidv4()
            version.date = moment().format('YYYY-MM-DD HH:mm:ss')
            version.publication = publication.id
            version.version = versions.reduce((acc, version) => {
                if (version.version > acc) return version.version
                return acc
            }, 0) + 1
            version.published_by = cocosUser.displayName

            courseService.createPublicationVersion(version).then(res => {
                publication.latest_version = 'Version ' + res.version + ' - ' + moment(res.data).format('MMM DD YYYY')
                publication.status = PublicationStatus.PUBLISHED
                courseService.updatePublication(publication) //silent

                createVersionLists([...versions, res])
            })
        }
    }

    const deleteVersion = (version) => {
        const answer = window.confirm('Are you sure you want to delete this version? All content will be lost and anyone who is using this version will no longer be able to see it! Please reconsider if necessary.')

        if (answer){
            courseService.deletePublicationVersion(version).then(res => {
                const allVersions = versions.filter(v => v.id !== version.id)
                createVersionLists(allVersions)
            })
        }
    }

    const outlineItems = publication.outline_ids.split(',').filter(id => !isNaN(id))

    return (
        <div>
            <div className='subheader'>{publication.title}</div>

            <p>Publication of your course involves two steps:</p>
            <p><strong>Step one:</strong></p>
            <Label style={{marginBottom: '10px'}}>Select/Deselect the outline items (on the left) you want to add to your publication</Label>
            <p><strong>Step two:</strong></p>
            <Label style={{marginBottom: '10px'}}>Click the 'Publish new version' button</Label>

            <p>When the publication is ready, a 'version' of your course is created automatically. Each version will have a unique id which you'll need to configure each implementation of the CoCos
                viewer.</p>
            <p>Once the publication version is generated, you can't modify it anymore, but don't worry, you can make as many versions as you like.</p>
            <p>You can delete a publication version. Be aware thought that any implementation of this version of your course will no longer work so thread carefully.</p>
            <p>Tip: don't publish a version if your course isn't in a usable state yet.</p>


            <Divider/>

            <div style={{marginBottom: '10px'}}>
                {(!versions || versions.length === 0) &&
                <p>There are no version yet.</p>
                }

                {versions &&
                <Fragment>


                    {latestVersion && <Fragment><p>Latest Version</p><VersionRenderer version={latestVersion} courseService={courseService}/></Fragment>}

                    {previousVersions && previousVersions.length > 0 && !previousVersionsVisible &&
                    <a className='link' href='# ' onClick={() => setPreviousVersionsVisible(true)}>Show {previousVersions.length} previous versions</a>
                    }

                    {previousVersions && previousVersions.length > 0 && previousVersionsVisible &&
                    <Fragment>
                        <p>Previous versions</p>
                        {previousVersions.map((version, index) => {
                            return <VersionRenderer key={index} version={version} deleteable onDelete={deleteVersion} courseService={courseService}/>
                        })}
                    </Fragment>
                    }

                    {previousVersions && previousVersions.length > 0 && previousVersionsVisible &&
                    <a className='link' href='# ' onClick={() => setPreviousVersionsVisible(false)}>Hide previous versions</a>
                    }

                </Fragment>}
            </div>

            <Button color='green' disabled={outlineItems.length === 0} onClick={publish}>Publish new version</Button>

            <Divider/>

            {/*<Button color='green' onClick={onEditEnd}>Save and exit</Button>*/}
        </div>
    )
}

export default PublicationDetail

PublicationDetail.propTypes = {
    publication: PropTypes.object.isRequired,
    courseService: PropTypes.object.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    onEditEnd: PropTypes.func
}

PublicationDetail.defaultProps = {}
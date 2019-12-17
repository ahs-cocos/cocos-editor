import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Segment, Form, Button, Input, Label, Divider} from "semantic-ui-react";
import {PublicationStatus, PublicationType} from "cocos-lib";

const PublicationRenderer = ({publication, onRemovePublication, onUpdatePublication, onEditPublication}) => {

    const [title, setTitle] = useState(publication.title)
    const [publicationType, setPublicationType] = useState(publication.type)
    const [statusColor, setStatusColor] = useState('grey')
    const [isDirty, setIsDirty] = useState(false)


    useEffect(() => {
        let color
        switch(publication.status){
            case PublicationStatus.CREATED:
                color = 'red'
                break
            case PublicationStatus.PUBLISHED:
                color = 'green'
                break
            default:
                color = 'grey'
                break
        }
        setStatusColor(color)
    }, [publication.status])

    const onChange = (event, {name, value}) => {
        setIsDirty(true)
        if (name === 'title') setTitle(value)
        if (name === 'type') setPublicationType(value)
    }

    const updatePublication = () => {
        publication.title = title
        publication.type = publicationType
        if (publication.status === PublicationStatus.NEW) publication.status = PublicationStatus.CREATED
        onUpdatePublication(publication)
        setIsDirty(false)
    }

    return (
        <Segment color={statusColor}>
            <div className='course-info' style={{marginBottom: '10px'}}>Publication status: {publication.status}</div>
            <Form>
                <Form.Field>
                    <label>Publication Title</label>
                    {publication.status === PublicationStatus.NEW &&
                    <p>Enter a descriptive title for your publication. The course title will always be shown, so you don't have to repeat that.</p>
                    }

                    <div style={{display: 'flex'}}>
                        <Input fluid focus placeholder='Publication title...' name='title' onChange={onChange} value={title}/>

                    </div>
                </Form.Field>

                {publication.status !== PublicationStatus.NEW && publication.type === '' &&
                <Form.Group inline>
                    <label>Please choose a publication type</label>
                    {PublicationType.TYPES.map((type, index) => {
                        return <Form.Radio key={index}
                                           label={type.toUpperCase()}
                                           value={type}
                                           name='type'
                                           checked={type === publicationType}
                                           onChange={onChange}
                        />
                    })}
                </Form.Group>
                }
                {publication.status !== PublicationStatus.NEW && publication.type !== '' &&
                <Form.Field inline>
                    <label>Publication type:</label>
                    <Label>{publicationType.toUpperCase()}</Label>
                </Form.Field>
                }

                {publication.latest_version &&
                <Form.Field>
                    <label>Latest version</label>
                    <p>{publication.latest_version}</p>
                </Form.Field>
                }

                {isDirty &&
                <Button color='green' size='mini'
                        disabled={title === ''}
                        onClick={updatePublication}>Update</Button>
                }

            </Form>
            <Divider/>

           {/* {publication.status === PublicationStatus.NEW &&
            <Button color='blue' size='mini'
                    disabled={title === ''}
                    onClick={() => onRemovePublication(publication)}>Cancel</Button>
            }*/}

            {publication.status !== PublicationStatus.NEW && publication.type !== '' &&
            <a className='link' href='# ' onClick={() => onEditPublication(publication)}>Publication details</a>
            }


        </Segment>
    )
}

export default PublicationRenderer

PublicationRenderer.propTypes = {
    course: PropTypes.object.isRequired,
    publication: PropTypes.object.isRequired,
    emailValidationFunction: PropTypes.func,
    onRemovePublication: PropTypes.func,
    onUpdatePublication: PropTypes.func,
    onEditPublication: PropTypes.func,
}

PublicationRenderer.defaultProps = {}
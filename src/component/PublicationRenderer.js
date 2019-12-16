import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Segment, Form, Button, Input, Message, Divider} from "semantic-ui-react";
import {PublishingStatus} from "cocos-lib";

const PublishingRenderer = ({sharing, emailValidationFunction, onRemovePublishing, onUpdatePublishing}) => {

    const [sharer, setSharer] = useState(sharing.sharer)
    const [emailValid, setEmailValid] = useState(false)
    const [warning, setWarning] = useState('')
    const [statusColor, setStatusColor] = useState('grey')

    useEffect(() => {
        console.log('CHECKING', sharer)
        const validobject = emailValidationFunction(sharer, sharing)
        setWarning(validobject.message)
        setEmailValid(validobject.valid)
    }, [sharer, emailValidationFunction, sharing])

    useEffect(() => {
        let color
        switch(sharing.status){
            case PublishingStatus.PENDING:
                color = 'red'
                break
            case PublishingStatus.SHARED:
                color = 'green'
                break
            default:
                color = 'grey'
                break
        }
        setStatusColor(color)
    }, [sharing.status])

    const onChange = (event, {name, value}) => {
        if (name === 'sharer') setSharer(value)
    }

    return (
        <Segment color={statusColor}>
            <div className='course-info' style={{marginBottom: '10px'}}>Publishing status: {sharing.status} | Role: {sharing.roles}</div>
            <Form warning>
                {sharing.status === PublishingStatus.NEW &&
                <Form.Field>
                    <label>Enter a valid email address of the person you want to share your course with</label>
                    <div style={{display: 'flex'}}>
                        <Input fluid focus placeholder='Email address...' name='sharer' onChange={onChange}/>
                        <Button name='invite' color='teal' disabled={!emailValid} onClick={() => onUpdatePublishing('invite', sharing)}>Invite</Button>
                    </div>
                    {warning !== '' &&
                    <Message warning header='Email address not accepted' content={warning}/>
                    }
                </Form.Field>
                }

                {sharing.status === PublishingStatus.PENDING &&
                <div>
                    <p>Waiting on confirmation from <strong>{sharing.sharer}</strong></p>
                </div>
                }

                {sharing.status === PublishingStatus.SHARED &&
                <div>
                    <p>Your course is shared with <strong>{sharing.sharer}</strong></p>
                </div>
                }
            </Form>
            <Divider/>

            {sharing.status === PublishingStatus.NEW && <Button color='blue' size='mini' onClick={() => onRemovePublishing(sharing)}>Cancel</Button>}
            {sharing.status !== PublishingStatus.NEW && <Button color='red' size='mini' onClick={() => onRemovePublishing(sharing)}>Stop sharing</Button>}
        </Segment>
    )
}

export default PublishingRenderer

PublishingRenderer.propTypes = {
    course: PropTypes.object.isRequired,
    sharing: PropTypes.object.isRequired,
    emailValidationFunction: PropTypes.func,
    onRemovePublishing: PropTypes.func,
    onUpdatePublishing: PropTypes.func,
}

PublishingRenderer.defaultProps = {}
import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Segment, Form, Button, Input, Message, Divider} from "semantic-ui-react";
import {SharingStatus} from "cocos-lib";

const SharingRenderer = ({sharing, emailValidationFunction, onRemoveSharing, onUpdateSharing}) => {

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
            case SharingStatus.PENDING:
                color = 'red'
                break
            case SharingStatus.SHARED:
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
            <div className='course-info' style={{marginBottom: '10px'}}>Sharing status: {sharing.status} | Role: {sharing.roles}</div>
            <Form warning>
                {sharing.status === SharingStatus.NEW &&
                <Form.Field>
                    <label>Enter a valid email address of the person you want to share your course with</label>
                    <div style={{display: 'flex'}}>
                        <Input fluid focus placeholder='Email address...' name='sharer' onChange={onChange}/>
                        <Button name='invite' color='teal' disabled={!emailValid} onClick={() => onUpdateSharing('invite', sharing)}>Invite</Button>
                    </div>
                    {warning !== '' &&
                    <Message warning header='Email address not accepted' content={warning}/>
                    }
                </Form.Field>
                }

                {sharing.status === SharingStatus.PENDING &&
                <div>
                    <p>Waiting on confirmation from <strong>{sharing.sharer}</strong></p>
                </div>
                }

                {sharing.status === SharingStatus.SHARED &&
                <div>
                    <p>Your course is shared with <strong>{sharing.sharer}</strong></p>
                </div>
                }
            </Form>
            <Divider/>

            {sharing.status === SharingStatus.NEW && <Button color='blue' size='mini' onClick={() => onRemoveSharing(sharing)}>Cancel</Button>}
            {sharing.status !== SharingStatus.NEW && <Button color='red' size='mini' onClick={() => onRemoveSharing(sharing)}>Stop sharing</Button>}
        </Segment>
    )
}

export default SharingRenderer

SharingRenderer.propTypes = {
    course: PropTypes.object.isRequired,
    sharing: PropTypes.object.isRequired,
    emailValidationFunction: PropTypes.func,
    onRemoveSharing: PropTypes.func,
    onUpdateSharing: PropTypes.func,
}

SharingRenderer.defaultProps = {}
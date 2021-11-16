import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import ServiceContext from '../context/ServiceContext'

import {Label} from "semantic-ui-react";

const ComponentIdentifier = ({displayName, info}) => {

    const serviceContext = useContext(ServiceContext)

    if (!serviceContext.privilegeManager.isSuperAdmin() || !serviceContext.componentIdentifierActive) return null

    return (
        <div style={{margin: '5px'}}>
            <Label color='pink'>
                <span>[{displayName}]</span>
                {info && <span> {info}</span>}
            </Label>
        </div>
    )
}

export  {ComponentIdentifier}

ComponentIdentifier.propTypes = {
    displayName: PropTypes.string.isRequired,
    info: PropTypes.string,
}

ComponentIdentifier.defaultProps = {

}

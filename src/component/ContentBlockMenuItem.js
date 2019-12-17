import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Popup} from "semantic-ui-react";

const ContentBlockMenuItem = ({type, name, role, tooltip, enabled, onClick, color}) => {

    return (
        <div className={enabled ? 'content-block-menu-item': 'content-block-menu-item-disabled'} onClick={() => (enabled && onClick) && onClick(role)}>

            {type === 'icon' &&
            <Popup disabled={tooltip === ''}
                   mouseEnterDelay={500} content={tooltip} trigger={<div><Icon style={{margin: 0}} color={color} name={name}/></div>} />
            }


            {type === 'string' && <div>{name}</div>}
        </div>
    )
}

export default  ContentBlockMenuItem

ContentBlockMenuItem.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
    enabled: PropTypes.bool.isRequired,
    onClick: PropTypes.func
}

ContentBlockMenuItem.defaultProps = {
    type: 'icon',
    tooltip: '',
    color: 'grey',
    enabled: true
}
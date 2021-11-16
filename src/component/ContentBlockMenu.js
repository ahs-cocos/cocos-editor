import React from 'react'
import PropTypes from 'prop-types'
import {ComponentIdentifier} from "./ComponentIdentifier";

const ContentBlockMenu = (props) => {

    return (
        <div className='content-block-menu'>
            <ComponentIdentifier displayName='ContentBlockMenu'/>

            {props.children}
        </div>
    )
}

export default  ContentBlockMenu

ContentBlockMenu.propTypes = {
    onMenuItemClick: PropTypes.bool
}

ContentBlockMenu.defaultProps = {
}

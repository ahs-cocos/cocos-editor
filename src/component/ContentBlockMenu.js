import React from 'react'
import PropTypes from 'prop-types'

const ContentBlockMenu = (props) => {

    return (
        <div className='content-block-menu'>
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
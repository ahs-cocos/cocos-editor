import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import {Menu} from "semantic-ui-react";
import {
    Link,
    useLocation
} from "react-router-dom"
import {ComponentIdentifier} from "./ComponentIdentifier";


const MENU_ITEMS = ['bo_home', 'bo_courses']

const BackofficeMenu = ({privilegeManager}) => {

    const location = useLocation()

    console.log('PM', privilegeManager)
    return (
        <Menu>
            <ComponentIdentifier displayName='BackofficeMenu'/>

            {MENU_ITEMS.map(item => {
                return  <Menu.Item key={item}
                    name={item} as={Link}
                    to={`/${item}`}
                    active={location.pathname === `/${item}`}
                />
            })}

        </Menu>
    )
}

export default  BackofficeMenu

BackofficeMenu.propTypes = {
    privilegeManager: PropTypes.object.isRequired,
}

BackofficeMenu.defaultProps = {

}

import React, {useState, useEffect, useContext, Fragment} from 'react'
import PropTypes from 'prop-types'
import BackofficeMenu from "../../component/BackofficeMenu";
import ServiceContext from "../../context/ServiceContext";
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom"
import {ComponentIdentifier} from "../../component/ComponentIdentifier";
import BoCourseView from "./course/BoCourseView";


const VIEW_HOME = '/bo_home'
const VIEW_COURSES = '/bo_courses'

const Backoffice = (props) => {

    const serviceContext = useContext(ServiceContext)

    return (
        <div style={{padding: '10px'}}>

            <ComponentIdentifier displayName='Backoffice'/>

            <BackofficeMenu privilegeManager={serviceContext.privilegeManager}/>


            <Switch>
                <Route path={VIEW_COURSES}>
                    <BoCourseView/>
                </Route>

                <Route path='/'>
                    <Redirect to={VIEW_HOME}/>
                </Route>

            </Switch>

        </div>
    )
}

export default  Backoffice

Backoffice.propTypes = {

}

Backoffice.defaultProps = {

}

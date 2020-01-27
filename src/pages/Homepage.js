import React from 'react'
import PropTypes from 'prop-types'
import {NavLink} from 'react-router-dom'
import {Image, Header, Container, Button, Divider, Icon} from "semantic-ui-react";
import {ApplicationPath} from "cocos-lib";

const Homepage = ({loginState, onLoginClick, onGoToCourses}) => {

    return (
        <div className='homepage-container'>

            <Image style={{marginTop: '30px'}} src={ApplicationPath.assetsFolder + 'logo/logo-cocos-color.png'}/>
            <Header style={{margin: '40px'}} size='huge'>Welcome to the CoCos online course editor</Header>
            <Container text>
                <p>
                    Co-creation has become a hot topic in higher education, especially because of its potential to solve a number of challenges in the current higher education setting. In a society characterised by globalisation, digitalisation, and constant change, educational institutions – higher education institutions (HEI) as well as adult education institutions – must think beyond today and provide students with the skills to shape tomorrow’s society. 21st century skills such as digital literacy, sustainability, entrepreneurship, global citizenship and research must be achieved by introducing New Generation curriculum design and – importantly – the self-directed curriculum.
                </p>
                <p>
                    These are catalysts for a more student-centered learning approach, smarter use of ICT, and tighter links between educational institutions and employers as well as social enterprises. It therefore comes as no surprise that co-creation of course content by a broad range of stakeholders has gained much attention. The main objective of the COCOS project is therefore to apply the mindset, methods and tools gleaned for open source development to the co-creation of course content.
                </p>
                <p>Login via one of the options below and start co-creating.</p>
            </Container>

            <Divider/>

            {(loginState === 'loggingIn' || loginState === 'idle') &&
            <div>Logging in...</div>
            }


            {loginState === 'loggedOut' &&
            <Container text textAlign='center' style={{margin: '30px'}}>
                <div>
                    <Button color='google plus' onClick={() => onLoginClick('google')}>
                        <Icon name='google'/> Sign in with Google
                    </Button>
                    <Button color='facebook' onClick={() => onLoginClick('facebook')}>
                        <Icon name='facebook'/> Sign in with Facebook
                    </Button>
                    <Button color='linkedin' onClick={() => onLoginClick('microsoft')}>
                        <Icon name='microsoft'/> Sign in with Microsoft
                    </Button>
                </div>
                <div style={{marginTop: '30px'}} className='course-info'>
                    By signing in, we will store your name, email address and the photo associated with your login account. We will use this to enable you to share your courses with other users of this site. By no means we will use this info for any other purpose.
                </div>
            </Container>
            }

            {loginState === 'loggedIn' &&
            <div style={{margin: '30px'}}>
                <NavLink to='/courses'>
                    <Button color='teal' onClick={onGoToCourses}>Go to your courses</Button>
                </NavLink>
            </div>}
        </div>
    )
}

export default Homepage

Homepage.propTypes = {
    loginState: PropTypes.string,
    onLoginClick: PropTypes.func,
    onGoToCourses: PropTypes.func
}

Homepage.defaultProps = {}
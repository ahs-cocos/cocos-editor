import React from 'react'
import PropTypes from 'prop-types'
import {Image, Header, Container, Button, Divider, Icon} from "semantic-ui-react";
import {ApplicationPath} from "cocos-lib";

const Homepage = ({user, onLoginClick, onGoToCourses}) => {

    return (
        <div className='homepage-container'>

            <Image style={{marginTop: '30px'}} src={ApplicationPath.assetsFolder + 'logo/logo-cocos-color.png'}/>
            <Header style={{margin: '40px'}} size='huge'>Welcome to the CoCos online course editor</Header>
            <Container text>
                <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                    ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                    magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                    ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                    quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                    arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                    Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                    dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                    Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                    viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                    Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                    ligula eget dolor. Aenean massa strong. Cum sociis natoque penatibus et
                    magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis,
                    ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa
                    quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget,
                    arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
                    Nullam dictum felis eu pede link mollis pretium. Integer tincidunt. Cras
                    dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                    Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                    Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus
                    viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.
                    Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.
                </p>
            </Container>

            <Divider/>

            {!user &&
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

            {user &&
            <div style={{margin: '30px'}}>
                <Button color='teal' onClick={onGoToCourses}>Go to your courses</Button>
            </div>}
        </div>
    )
}

export default Homepage

Homepage.propTypes = {
    onLoginClick: PropTypes.func,
    onGoToCourses: PropTypes.func,
    user: PropTypes.object
}

Homepage.defaultProps = {}
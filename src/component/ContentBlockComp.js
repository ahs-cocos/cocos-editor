import React from 'react'
import PropTypes from 'prop-types'
import {Menu, Segment} from "semantic-ui-react";
import ContentBlockMenu from "./ContentBlockMenu";
import ContentBlockMenuItem from "./ContentBlockMenuItem";

const ContentBlock = ({contentBlock, courseService, updateCourse, onContentBlockMenuClick, isFirst, isLast, animate}) => {


    return (
        <div className={animate ? 'content-block' : ''}>
            {/*<Menu attached='top'>
                <Menu.Item
                    name='section1'
                    active={activeMenuItem === 'section1'}
                    onClick={onMenuItemClick}
                >
                    Section 1
                </Menu.Item>

                <Menu.Item
                    name='section2'
                    active={activeMenuItem === 'section2'}
                    onClick={onMenuItemClick}
                >
                    Section 2
                </Menu.Item>
            </Menu>
*/}
            <ContentBlockMenu>
                <ContentBlockMenuItem type='string' name='Insert new content block above' role='insertAbove'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
                <ContentBlockMenuItem enabled={!isFirst} name='arrow up' tooltip='Move content block up' role='moveUp'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
                <ContentBlockMenuItem enabled={!isLast} name='arrow down' tooltip='Move content block down' role='moveDown'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
                <ContentBlockMenuItem name='trash alternate outline' role='delete'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
            </ContentBlockMenu>

            <Segment attached>
                There are many variations of passages of Lorem Ipsum available, but
                the majority have suffered alteration in some form, by injected
                humour, or randomised words which don't look even slightly believable.
                If you are going to use a passage of Lorem Ipsum, you need to be sure
                there isn't anything embarrassing hidden in the middle of text. All
                the Lorem Ipsum generators on the Internet tend to repeat predefined
                chunks as necessary, making this the first true generator on the
                Internet. It uses a dictionary of over 200 Latin words, combined with
                a handful of model sentence structures, to generate Lorem Ipsum which
                looks reasonable. The generated Lorem Ipsum is therefore always free
                from repetition, injected humour, or non-characteristic words etc.
            </Segment>

            <ContentBlockMenu>
                <ContentBlockMenuItem type='string' name='Insert new content block below' role='insertBelow'
                                      onClick={(role) => onContentBlockMenuClick(role, contentBlock)}/>
            </ContentBlockMenu>
        </div>
    )
}

export default ContentBlock

ContentBlock.propTypes = {
    courseService: PropTypes.object.isRequired,
    contentBlock: PropTypes.object.isRequired,
    updateCourse: PropTypes.func,
    onContentBlockMenuClick: PropTypes.func,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
    animate: PropTypes.bool
}

ContentBlock.defaultProps = {
    isFirst: false,
    isLast: false,
    animate: false
}
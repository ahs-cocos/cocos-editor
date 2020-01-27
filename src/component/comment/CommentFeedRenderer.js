import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Feed, Icon} from "semantic-ui-react";
import moment from "moment";

const CommentFeedRenderer = ({comment, cocosUser, onDeleteComment}) => {

    //const [thumbCollection, setThumbCollection] = useState([])
    const [thumbedByMe, setThumbedByMe] = useState(false)
    //const [thumbCount, setThumbCount] = useState()
    const [thumbsLabel, setThumbsLabel] = useState('')

    useEffect(() => {
        if (!comment.thumbs) comment.thumbs = ''

        const coll = comment.thumbs.split(',').filter(t => t !== '')
        const tbm = coll.indexOf(cocosUser.id) > -1
        const tc = tbm ? coll.length-1 : coll.length
        console.log('COLL', coll)
        //setThumbCollectioncoll
        setThumbedByMe(tbm)
        //setThumbCount(tc)

        let tl = 'No thumbs yet'

        if (coll.length > 0){
            tl = tc + ' users thumbed this'
            if (tbm) tl = `You and ${tc} others`
        }

        setThumbsLabel(tl)
    }, [comment, cocosUser])

    return (
        <Feed.Event>
            <Feed.Label image={comment.author_photo_url}/>
            <Feed.Content>
                <Feed.Summary>
                    <a href='# '>{comment.author_display_name}</a>
                    <Feed.Date>{moment(comment.date).format('MMM, DD YYYY HH:mm')}</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text>
                    {comment.comment}
                </Feed.Extra>
                <Feed.Meta>
                    {comment.author === cocosUser.id && <a href='# ' onClick={() => onDeleteComment(comment)}>Delete comment</a>}
                </Feed.Meta>
                <Feed.Event>
                    <Feed.Like>
                        <Icon name='thumbs up outline' color={thumbedByMe ? 'green' : 'grey'}/>{thumbsLabel}
                    </Feed.Like>
                </Feed.Event>
            </Feed.Content>
        </Feed.Event>
    )
}

export default CommentFeedRenderer

CommentFeedRenderer.propTypes = {
    comment: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    onDeleteComment: PropTypes.func
}

CommentFeedRenderer.defaultProps = {}
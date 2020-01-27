import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Feed, Form, Button} from "semantic-ui-react";
import moment from 'moment'
import {Comment, CommentContext} from 'cocos-lib'
import CommentFeedRenderer from "./CommentFeedRenderer";

const CommentComp = ({comments, course, cocosUser, outline, createComment, deleteComment}) => {

    const [filteredComments, setFilteredComments] = useState([])
    const [commentText, setCommentText] = useState('')

    useEffect(() => {
        if (!outline) return
        console.log('FILTERING')
        setFilteredComments(comments.filter(comment => {
            return comment.outline === outline.id
        }))
    }, [outline, comments])

    if (!outline) return null

    const onChange = (event, {name, value}) => {
        setCommentText(value)
    }

    const addComment = (...props) => {
        console.log('ADD COMMENT', commentText)
        const comment = new Comment()
        comment.course = course.id
        comment.outline = outline.id
        comment.author = cocosUser.id
        comment.author_display_name = cocosUser.displayName
        comment.author_photo_url = cocosUser.photoURL
        comment.date = moment().format('YYYY-MM-DD HH:mm:ss')
        comment.context = CommentContext.EDITOR
        comment.comment = commentText

        createComment(comment)

        setCommentText('')
    }

    return (
        <div>
            <Feed>
                {filteredComments.map((comment, index) => {
                    return <CommentFeedRenderer key={index} comment={comment} cocosUser={cocosUser} onDeleteComment={deleteComment}/>
                })}

            </Feed>

            <Form onSubmit={addComment}>

                <Form.TextArea name='commentText' label='Add comment' value={commentText} onChange={onChange}/>

                <Button type='submit'>Submit</Button>
            </Form>
        </div>
    )
}

export default  CommentComp

CommentComp.propTypes = {
    comments: PropTypes.array.isRequired,
    course: PropTypes.object.isRequired,
    cocosUser: PropTypes.object.isRequired,
    commentService: PropTypes.object.isRequired,
    outline: PropTypes.object,
    createComment: PropTypes.func,
    deleteComment: PropTypes.func,
}

CommentComp.defaultProps = {

}
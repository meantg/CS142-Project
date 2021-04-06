import React from 'react';
import {
    Button,
    TextField,
    Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import Comment from './comment/comment';

const axios = require('axios');

const Photo = ({ user, photo }) => {

    const [comments, setCmts] = React.useState([]);
    const [comment, setCmt] = React.useState("");
    const [curUser, setCurUser] = React.useState({});
    const _time = photo.date_time;
    const time = _time.slice(11, 16);
    const date = _time.slice(0, 10)

    React.useEffect(() => {
        setCmts(photo.comments);
        getCurUser();
    }, [])


    const getCurUser = () => {
        axios.get('http://localhost:3000/get_session').then(
            result => {
                console.log(result);
                setCurUser(result.data);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
    }

    const handleComment = (cmt) => {
        var time = Date.now();
        var body = {
            comment: cmt,
            user_id: user._id,
            date_time: time,
            file_name: photo.file_name,
            photo_id : photo._id,
        };
        axios.post('http://localhost:3000/commentsOfPhoto', body)
            .then(result => {
                console.log(result);
            })
            .catch(function (err) {
                console.log(err);
            });
        setCmt("");
        const newCmt = {
            comment: cmt,
            date_time: "Now",
            user_id: curUser._id,
            _id: photo._id
        }
        comments.push(newCmt);
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleComment(comment)
        }
    }

    return (
        <div>
            <img width={400} src={'../../../images/' + photo.file_name} />
            <p>Created: {date} at {time} </p>
            <h3>Comments : </h3>
            {
                comments !== undefined ? comments.map((cmt, index) => {
                    return (
                        <Comment cmt={cmt} key={index} />
                    )
                }) : <p>No one cmt yet !</p>
            }
            <div style={{ display: "flex" }} onKeyDown={(e) => handleEnter(e)}>
                <TextField value={comment} onChange={(cmt) => setCmt(cmt.target.value)} label="Add Comment : " variant="outlined"> </TextField>
                <Button onClick={() => handleComment(comment)}>Send</Button>
            </div>
        </div>
    )
}

export default Photo;
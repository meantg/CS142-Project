import React from 'react';
import {
    Button,
    TextField,
    Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';

const axios = require('axios');

const Comment = ({ cmt }) => {

    const [commenter, setCmtr] = React.useState();

    React.useEffect(() => {
        axios.get('http://localhost:3000/user/' + cmt.user_id)
            .then(result => {
                setCmtr(result.data)
            })
            .catch(function (err) {
                console.log(err);
            });
    }, [])


    if (commenter !== undefined) {
        const _time = cmt.date_time;
        const time = _time.slice(11,16);
        const date = _time.slice(0,10)
        return (
            <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Link to={"/users/" + cmt.user_id} style={{flex: 1, fontWeight: "bold", margin: 1, }}>{commenter.last_name}</Link>
                    <p style={{ flex: 11, margin: 1 }}> {cmt.comment}</p>
                </div>
                <p style={{ margin: 3, color: "grey" }}>{date} at {time}</p>
            </div>
        )
    }
    else {
        return null
    }
}

export default Comment;
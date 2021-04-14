import React from 'react';
import {
    Button,
    TextField,
    Typography,
    MenuItem,
    Menu
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { render } from 'react-dom';
import Comment from './comment/comment';

const axios = require('axios');

const Photo = ({ user, photo, flexDirection }) => {

    const [comments, setCmts] = React.useState([]);
    const [likes, setLikes] = React.useState(photo.likes);
    const [likeCount, setLikeCount] = React.useState(0);

    const [comment, setCmt] = React.useState("");

    const [curUser, setCurUser] = React.useState({});
    const [users, setUsers] = React.useState([]);

    const _time = photo.date_time;

    const [isLike, setLike] = React.useState(false);
    const [isFavor, setFavor] = React.useState(false);
    const [option, setOption] = React.useState(null);

    React.useEffect(() => {
        console.log(likes);
        setCmts(photo.comments);
        setLikeCount(photo.likes.length);
        checkLiked();
        getCurUser();
        getUserList();
    }, [])

    React.useEffect(() => {
        console.log("create new");
        setCmts(photo.comments);
        setLikes(photo.likes);
        setLikeCount(photo.likes.length);
        checkLiked();
    }, [photo])

    const getUserList = () => {
        axios.get('http://localhost:3000/user/list')
            .then(result => {
                setUsers(result.data)
            }).catch(err => {
                console.log(err);
            })
    }

    const checkLiked = () => {
        const user = likes.find(like => like.user_id == curUser._id)
        if (user != undefined) {
            console.log("setLike");
            setLike(!isLike);
        }
    }


    const getCurUser = () => {
        axios.get('http://localhost:3000/get_session').then(
            result => {
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
            photo_id: photo._id,
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

    const handleInputCmt = (cmt) => {
        setCmt(cmt);
    }

    const handleDeleteImg = () => {

        var body = {
            photoId: photo._id
        }
        axios.post('http://localhost:3000/photos/delete', body)
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            })
        console.log("handleDelete");
        setOption(null);
        alert("Do you want to delete photo with id: " + photo._id + "?")
        window.location.reload();
    }

    const handleEditPrivacy = () => {
        console.log("handleEditPrivacy");
        setOption(null);
    }

    const handleLike = () => {
        setLike(!isLike);
        if (!isLike) {
            setLikeCount(likeCount + 1);
        } else {
            setLikeCount(likeCount - 1);
        }

        var body = {
            photoId: photo._id,
            userId: curUser._id,
            isLike: isLike
        }
        axios.post('http://localhost:3000/photos/like', body)
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            })
    }

    const handleAddToFavor = () => {
        setFavor(!isFavor)
        var body = {
            userId: curUser._id,
            photoId: photo._id,
            isFavor: isFavor
        }
        console.log(body);
        axios.post('http://localhost:3000/photos/favor', body)
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div style={{ flexDirection: flexDirection ? flexDirection : "column", display: "flex", height: "100%" }}>
            <div style={{ width: "90%", height: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
                {user._id === curUser._id ? <div>
                    {!flexDirection ? <Button aria-controls="option-menu" aria-haspopup="true" onClick={(event) => setOption(event.currentTarget)} >Settings</Button> : null}
                    <Menu
                        id="option-menu"
                        anchorEl={option}
                        keepMounted
                        open={Boolean(option)}
                        onClose={() => setOption(null)}
                    >
                        <MenuItem onClick={() => handleEditPrivacy()}>👀 Edit privacy</MenuItem>
                        <MenuItem onClick={() => handleDeleteImg()}>❌ Delete photo</MenuItem>
                    </Menu>
                </div> : null}


                <img style={{ maxHeight: '80%', maxWidth: "100%" }} src={'../../../images/' + photo.file_name} />
                <p>Created: {_time} </p>
                {!flexDirection ? <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "flex-start", marginLeft: 25 }}>
                    <p style={{ margin: 0, fontSize: 40, cursor: "pointer", }} onClick={() => handleAddToFavor()}>{isFavor ? " 🌟" : "⭐"}</p>
                    <Button variant="contained" color={isLike ? "secondary" : "primary"} onClick={() => handleLike()}> {isLike ? " Dislike 👎" : "Like 👍"}</Button>
                    <p>{likeCount} liked this photo</p>
                </div> : null}

            </div>
            <div>
                {
                    comments !== undefined ? <div style={{ width: "80%", minWidth: 250, height: "70%", maxHeight: 450, overflowY: "scroll", marginBottom: 10, alignSelf: "center" }}>
                        {
                            comments.map((cmt, index) => {
                                return (
                                    <Comment photo={photo} curUser={curUser} cmt={cmt} key={index} />
                                )
                            })
                        }
                    </div> : <p>
                        No one cmt yet !</p>
                }
                <div onKeyDown={(e) => handleEnter(e)}>
                    <TextField style={{ width: '80%' }} value={comment} onChange={(cmt) => handleInputCmt(cmt.target.value)} label="Add Comment : " variant="outlined"> </TextField>
                    <Button onClick={() => handleComment(comment)}>Send</Button>
                </div>
            </div>
        </div>
    )
}

export default Photo;
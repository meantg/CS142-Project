import React from 'react';
import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
}
    from '@material-ui/core';
import { Link } from 'react-router-dom';
import Thumbnail from './thumbnail/thumbnail';

const axios = require('axios');

const Favorites = ({ match }) => {

    const [curUser, setCurUser] = React.useState({});
    const [favors, setFavors] = React.useState([]);

    const userId = match.params.userId;

    React.useEffect(() => {
        console.log("Favorites");
        getCurUser();
    }, [userId])


    const getCurUser = () => {
        console.log("getCurUser");
        axios.get('http://localhost:3000/get_session')
            .then(result => {
                var curUser = result.data;
                console.log(curUser);
                setCurUser(curUser);
                setFavors(curUser.favorites)
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    if (favors.length > 0) {
        return (
            <div>
                <h1>Favorites photo of {curUser.last_name}</h1>
                {favors.map((item, index) => {
                    return (
                        <Thumbnail photoId={item.photo_id} key={index}></Thumbnail>
                    )
                })}
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }

}

export default Favorites;
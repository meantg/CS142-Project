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
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import Photo from '../../userPhotos/photos/photo';

const axios = require('axios');

const Thumbnail = ({ photoId }) => {

    const [photo, setPhoto] = React.useState({})
    const [modal, setModal] = React.useState(false);

    React.useEffect(() => {
        getPhoto();
    }, [photoId])

    const getPhoto = () => {
        axios.get('http://localhost:3000/photos/' + photoId)
            .then(result => {
                console.log(result.data);
                setPhoto(result.data)
            }).catch(err => {
                console.log(err);
            })
    }

    const modalOpen = () => {
        setModal(true);
    }

    const modalClose = () => {
        setModal(false)
    }

    return (
        <div>
            <img style={{ cursor: "pointer", width: 450 }} onClick={() => modalOpen()} src={"../../../images/" + photo.file_name}></img>
            <Rodal width={600} height={450} visible={modal} onClose={() => modalClose()}>
                <img style={{ width: '100%', height: '100%', objectFit: "contain" }} src={"../../../images/" + photo.file_name}></img>
            </Rodal>
        </div>

    )
}

export default Thumbnail;
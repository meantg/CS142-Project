import React from 'react';
import {
    Button,
    TextField,
    Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const axios = require('axios');

const UploadPhoto = () => {

    const [user, setUser] = React.useState();
    const [image, setImage] = React.useState();
    const [base64Img, setB64Img] = React.useState();
    const [filename, setFileName] = React.useState();
    const [previewImg, setPreviewImg] = React.useState();

    React.useEffect(() => {
        axios.get('http://localhost:3000/get_session')
            .then(result => {
                console.log(result);
                setUser(result.data)
            })
            .catch(function (err) {
                console.log(err);
            });
    }, [])

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleUpload = (e) => {

        e.preventDefault();
        console.log(user);
        toBase64(image)
            .then(data => {
                const body = {
                    file: data,
                    filename: filename,
                    userId: user._id
                }
                const headers = {
                    "Content-Type": "application/json"
                }
                axios.post("/photos/new", body, headers)
                    .then(res => {
                        console.log(res);
                        alert("Photo successfully uploaded !");
                        window.location.replace("/photo-share.html#/photos/" + user._id);
                    }).catch(err => console.log(err))
            })
    }

    const handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setImage(file);
            setPreviewImg(reader.result);
            setFileName(file.name)
        }

        reader.readAsDataURL(file);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            { image ? <img width={500} height={370} src={previewImg} alt="fileUpload" /> :
                <div style={{ width: 500, height: 370, borderWidth: 3, borderStyle: "dotted", borderRadius: 25, justifyContent: "center", alignItems: "center", borderColor: "grey" }}>
                </div>}
            <input style={{ marginTop: '5%', marginBottom: '5%' }} name="myFile" type="file" accept="image/*" onChange={(e) => {
                handleImageChange(e)
            }} />
            <Button disabled={image ? false : true} variant="contained" color="primary" onClick={(e) => handleUpload(e)}> Upload </Button>
        </div>
    )
}

export default UploadPhoto;
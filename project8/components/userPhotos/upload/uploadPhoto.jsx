import React from 'react';
import {
    Button,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import Select from 'react-select';

const axios = require('axios');

const UploadPhoto = () => {

    const [user, setUser] = React.useState();
    const [users, setUsers] = React.useState();
    const [image, setImage] = React.useState();
    const [base64Img, setB64Img] = React.useState();
    const [filename, setFileName] = React.useState();
    const [previewImg, setPreviewImg] = React.useState();


    const [visibleList, setVisibleList] = React.useState();
    const [optionsList, setOptionsList] = React.useState([]);
    const [checkEO, setCheckEO] = React.useState(true);
    const [checkOM, setCheckOM] = React.useState(false);

    React.useEffect(() => {
        getUser();
        getUserList();
    }, [])

    const getUser = () => {
        axios.get('http://localhost:3000/get_session')
            .then(result => {
                setUser(result.data)
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    const getUserList = () => {
        axios.get('http://localhost:3000/user/list')
            .then(result => {
                var data = result.data;
                setUsers(data)
                console.log(data);
                var listUser = []
                data.map((user) => {
                    listUser.push({ label: user.first_name + " " + user.last_name, value: user._id, user_id: user._id })
                })
                setOptionsList(listUser);
                setVisibleList(listUser)
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleUpload = (e) => {

        e.preventDefault();
        console.log(visibleList);
        if (visibleList.length > 0) {
            toBase64(image)
                .then(data => {
                    const body = {
                        file: data,
                        filename: filename,
                        userId: user._id,
                        viewer: visibleList,
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
        else {
            alert("No one can see your photos !!!")
        }
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

    const handleSelectList = (value) => {
        setCheckEO(false);
        setCheckOM(false);
        var visible = [{ label: user.first_name + " " + user.last_name, value: user._id, user_id: user._id }]
        value.concat(visible);
        setVisibleList(value);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            { image ? <div style={{ flexDirection: "row", display: "flex" }}>
                <img width={500} height={370} style={{ objectFit: "contain", marginRight: 20 }} src={previewImg} alt="fileUpload" />
                {users ? <div>
                    <h3>Who can see your photos ? </h3>
                    <FormControlLabel
                        control={<Checkbox checked={checkEO}
                            onChange={() => {
                                setCheckEO(!checkEO)
                                if (checkOM == true) {
                                    setCheckOM(false);
                                }
                                setVisibleList(optionsList);
                            }
                            } color="primary" name="checkedA" />}
                        label="Everyone"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checkOM}
                            onChange={() => {
                                setCheckOM(!checkOM)
                                if (checkEO == true) {
                                    setCheckEO(false);
                                }
                                var visible = [{ label: user.first_name + " " + user.last_name, value: user._id, user_id: user._id }]
                                setVisibleList(visible);
                            }
                            }
                            color="primary" name="checkedA" />}
                        label="Only me"
                    />
                    <h3>Or specified people :  </h3>
                    <p></p>
                    {users ? <Select
                        isMulti
                        name="colors"
                        options={optionsList}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(e) => handleSelectList(e)}
                    /> : null}
                </div> : null}
            </div> :
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
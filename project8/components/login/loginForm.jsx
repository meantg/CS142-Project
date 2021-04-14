import React from 'react';
import {
    Button,
    Link,
    TextField
} from '@material-ui/core';
import './LoginForm.css';
import axios from 'axios';
import { Redirect } from 'react-router';

import { useGlobalFunctions } from '../../context/accountContext';
import { render } from 'react-dom';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
const LoginForm = () => {

    const { updateUser } = useGlobalFunctions();

    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [redirect, setRedirect] = React.useState(false);


    const handleLogin = (e) => {
        e.persist();

        if (userName != "" && password != "") {
            const headers = {
                "Content-Type": "application/json"
            }
            const data = {
                login_name: userName,
                password: password
            }
            axios.post("http://localhost:3000/admin/login", data, headers).then(result => {
                updateUser(result.data);
                alert("Login success with user: " + userName);
                window.location.replace("/photo-share.html")
            }).catch(err => {
                console.log(err);
                alert("Username or password is incorrect!");
            })
        } else {
            alert("Username or password cannot empty !!!")
        }
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    }

    return (
        <div>
            <h1>Login Form</h1>
            <form className="loginForm" onKeyDown={(e) => handleEnter(e)} noValidate autoComplete="off">
                <TextField id="username" value={userName} onChange={(un) => setUserName(un.target.value)} label="Username" variant="outlined" ></TextField>
                <TextField type="password" id="password" value={password} onChange={(pw) => setPassword(pw.target.value)} label="Password" variant="outlined" ></TextField>
                <Button onClick={(e) => handleLogin(e)}> Log me in</Button>
                <Link href="photo-share.html#/register" style={{ cursor: "pointer" }} >Don't have an account ? Register now !</Link>
            </form>
        </div>
    );

}

export default LoginForm;

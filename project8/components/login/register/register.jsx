import React from 'react';
import {
    Button,
    Link,
    TextField
} from '@material-ui/core';
import axios from 'axios';

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            rePassword: ""
        }

        this.handleRegister = this.handleRegister.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleRegister() {
        const userName = this.state.userName;
        const password = this.state.password;
        const rePassword = this.state.rePassword;
        if (userName != "" && password != "" && rePassword != "") {
            if (password === rePassword) {
                //Register
                const headers = {
                    "Content-Type": "application/json"
                }
                const data = {
                    login_name: userName,
                    password: password
                }
                axios.post("http://localhost:3000/admin/register", data, headers).then(result => {
                    console.log(result);
                    alert("Register Done");
                    window.location.reload();
                }).catch(err => {
                    console.log(err);
                    alert("Username or password is incorrect!");
                })
            } else {
                alert("Password and RePassword not the same !");
            }
        } else {
            alert("UserName, password or repassword cannot not be empty !!!")
        }
    }

    handleEnter(e) {
        if (e.key === 'Enter') {
            this.handleRegister();
        }
    }

    render() {
        return (
            <div>
                <h1>Register Form</h1>
                <form className="loginForm" onKeyDown={(e) => this.handleEnter(e)} noValidate autoComplete="off">
                    <TextField id="username" value={this.state.userName} onChange={(un) => this.setState({userName : un.target.value})} label="Username" variant="outlined" ></TextField>
                    <TextField id="password" value={this.state.password} onChange={(pw) => this.setState({password : pw.target.value})} label="Password" variant="outlined" ></TextField>
                    <TextField id="rePassword" value={this.state.rePassword} onChange={(rpw) => this.setState({rePassword: rpw.target.value})} label="RePassword" variant="outlined" ></TextField>
                    <Button onClick={(e) => this.handleRegister(e)}>Register !</Button>
                    <Link href="photo-share.html#/login" style={{ cursor: "pointer", alignSelf: "center" }} >Back to Login</Link>
                </form>
            </div>
        )
    }
}

export default Register;
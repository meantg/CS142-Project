import React from 'react';
import {
    Button,
    Link,
    TextField
} from '@material-ui/core';
import './LoginForm.css';
import axios from 'axios';
import { Redirect } from 'react-router';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            redirect: false
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleLogin(e) {
        e.persist();

        if (this.state.userName != "" && this.state.password != "") {
            const headers = {
                "Content-Type": "application/json"
            }
            const data = {
                login_name: this.state.userName,
                password: this.state.password
            }
            axios.post("http://localhost:3000/admin/login", data, headers).then(result => {
                console.log(result.data);
                this.setState({
                    redirect: true
                })
            }).catch(err => {
                console.log(err);
                alert("Username or password is incorrect!");
            })
        } else {
            alert("Username or password cannot empty !!!")
        }
    }

    handleEnter(e) {
        if (e.key === 'Enter') {
            this.handleLogin(e);
        }
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            alert("Login success with user: " + this.state.userName);
            window.location.replace("/photo-share.html")
        }

        return (
            <div>
                <h1>Login Form</h1>
                <form className="loginForm" onKeyDown={(e) => this.handleEnter(e)} noValidate autoComplete="off">
                    <TextField id="username" value={this.state.userName} onChange={(un) => this.setState({ userName: un.target.value })} label="Username" variant="outlined" ></TextField>
                    <TextField type="password" id="password" value={this.state.password} onChange={(pw) => this.setState({ password: pw.target.value })} label="Password" variant="outlined" ></TextField>
                    <Button onClick={(e) => this.handleLogin(e)}> Log me in</Button>
                    <Link href="photo-share.html#/register" style={{cursor: "pointer"}} >Don't have an account ? Register now !</Link>
                </form>
            </div>
        );
    }
}

export default LoginForm;

import React, { Component } from 'react';
import {
    FaUserCheck,
    FaLock
    }
    from "react-icons/fa";

/* -- Custom made components -- */
import Constants      from '../commons/Constants.js';
import './LoginComponent.css';

class LoginComponent extends Component {
    
    state = {
        loginUsername     : '',
        loginPassword     : '',
        showPasswordInput : 'password'
    }

    handleUsernameInput = (event)=>{
        this.setState({loginUsername:event.target.value});
    }

    handlePasswordInput = (event)=>{
        this.setState({loginPassword:event.target.value});
    }

    showPassword = ()=>{
        if(this.state.showPasswordInput ==='password'){
            this.setState({showPasswordInput:'text'});
        }
        else{
            this.setState({showPasswordInput:'password'});
        }
    }

    submitLoginCredentials = ()=>{
        this.props.doSubmitAdminLogin(this.state.loginUsername,
            this.state.loginPassword);
    }

	render() {
        return (
            <div id = 'LoginComponentWrapper'>
            	<div id='LoginContentWrapper'>
            		<p id='LoginContentTitle'>
            			Res-sys Admin Login Page
            		</p>
            		<p id='UsernameLabel'>
            			USERNAME
            		</p>
            		<div id='UsernameSection'>
                        <p id = 'UsernameIcon'>
                            <FaUserCheck/>
                        </p>
                        <input type='text' id='UsernameInput' value = {this.state.loginUsername}
                            onChange = {this.handleUsernameInput}/>
            		</div>
                    <p id='PasswordLabel'>
                        PASSWORD
                    </p>
                    <div id='PasswordSection'>
                        <p id = 'PasswordIcon'>
                            <FaLock/>
                        </p>
                        <input type={this.state.showPasswordInput} id = 'PasswordInput' value = {this.state.loginPassword} 
                            onChange ={this.handlePasswordInput} />
                        <p id = 'ShowPasswordButton' onClick = {this.showPassword} >
                            Show Password
                        </p>
                    </div>

                    <p id = 'ErrorDisplay' >
                        {this.props.doGetLoginError}
                    </p>
                    <p id = 'LoginSubmit' onClick = {this.submitLoginCredentials} > 
                        SUBMIT
                    </p>
            	</div>
            </div>
        );
    }
}


export default LoginComponent;
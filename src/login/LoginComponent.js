import React, { Component } from 'react';


/* -- Custom made components -- */
import Constants      from '../commons/Constants.js';
import './LoginComponent.css';

class LoginComponent extends Component {
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
            		</div>
            	</div>
            </div>
        );
    }
}


export default LoginComponent;
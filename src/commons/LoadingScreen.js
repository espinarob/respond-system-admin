import React, { Component } from 'react';


/* -- Custom made components -- */
import './LoadingScreen.css';
import Constants      from './Constants.js';

class LoadingScreen extends Component {

	render() {
        return (
        	<div id = 'LoadingScreenWrapper'>
        		<div id = 'LoadingScreenBackGround'>
        		</div>
        		<img src = '/anim/loading.gif' id = 'LoaderIcon' />
        		<p id = 'LoadedMessage'>
        			{this.props.doGetLoadMessage}
        		</p>
        	</div>
    	);
    }
}

export default LoadingScreen;
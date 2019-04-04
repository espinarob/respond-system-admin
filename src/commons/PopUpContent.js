import React, { Component } from 'react';


/* -- Custom made components -- */
import './PopUpContent.css';
import Constants      from './Constants.js';
import {
	IoMdCloseCircle
	} 
    from "react-icons/io";
class PopUpContent extends Component {


	render() {
        return (
        	<div id = 'PopUpContentWrapper'>
        		<p id = 'ExitPopUpButton' onClick={()=>this.props.doManipulatePopUpContent(false)}>
        			<IoMdCloseCircle/>
        		</p>
        		<div id = 'PopUpOperations'>
        			{this.props.doGetOptionsContent}
        		</div>
        	</div>
    	);
    }
}

export default PopUpContent;
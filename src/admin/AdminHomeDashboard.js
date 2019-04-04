import React, { Component } from 'react';
import {
    FaUserCheck,
    FaLock
    }
    from "react-icons/fa";
import { 
    IoIosSearch,
    IoIosPin,
    IoIosPeople,
	IoMdLogIn,
	IoMdSettings,
	IoIosOptions
	} 
    from "react-icons/io";

/* -- Custom made components -- */
import Constants      from '../commons/Constants.js';
import './AdminHomeDashboard.css';

class AdminHomeDashboard extends Component {

	logoutAdmin = ()=>{
		this.props.doLogoutAdminCredentials();
	}

	displayOptionsContent = ()=>{
		let content = 
			<React.Fragment>
				<p id = 'LogoutOperationWrapper' onClick={this.logoutAdmin} >
					Logout
				</p>
			</React.Fragment>
		this.props.doTogglePopUpContent();
		this.props.doChangeOptionsContent(content);
	}

	render() {
        return (
        	<div id = 'AdminHomeDashboardWrapper'>
        		<div id = 'AdminContentWrapper'>
        			<div id = 'AdminHeaderWrapper'>
        				<div id = 'SearchBarWrapper'>
        					<p id = 'SearchBarIcon'>
        						<IoIosSearch/>
        					</p>
        					<input type="text" placeholder="Search something" id="SearchInput"/>
        				</div>
        				<div id = 'ModifyRangeWrapper'>
        					<p id = 'ModifyRangeIcon'>
        						<IoIosPin/>
        					</p>
        					<p id = 'ModifyRangeLabel'>
        						Modify Center Point
        					</p>
        				</div>
        				<div id = 'AddCallSignWrapper'>
        					<p id = 'AddCallSignIcon'>
        						<IoIosPeople/>
        					</p>
        					<p id = 'AddCallSignLabel'>
        						Add Call Sign
        					</p>
        				</div>

        				<div id = 'LoginsMadeWrapper'>
        					<p id = 'LoginsMadeIcon'>
        						<IoMdLogIn/>
        					</p>
        					<p id = 'LoginsMadeLabel'>
        						Logins Made
        					</p>
        				</div>

        				<div id = 'OptionsWrapper' onClick={this.displayOptionsContent} >
        					<p id = 'OptionsIcon'>
        						<IoIosOptions/>
        					</p>
        					<p id = 'OptionsLabel'>
        						More
        					</p>
        				</div>
        			</div>
        			<div id = 'AdminDataSection'>
        			</div>
        		</div>
        	</div>
    	);
    }
}


export default AdminHomeDashboard;
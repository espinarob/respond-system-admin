import React, { Component } from 'react';
import {
    FaUserCheck,
    FaLock,
    FaTags
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

	state = {
        newRadius       : '',
        newLatitude     : '',
        newLongitude    : '',
        currentRange    : '',
        newOrganization : '',
        newCallSignID   : '',
        newResponder    : ''
    }

    handleInputRadius = (event)=>{
        this.setState({newRadius:event.target.value});
    }

    handleInputLatitude = (event)=>{
        this.setState({newLatitude:event.target.value});
    }

    handleInputLongitude = (event)=>{
        this.setState({newLongitude:event.target.value});
    }


    logoutAdmin = ()=>{
		this.props.doLogoutAdminCredentials();
	}

    modifyCenterPoint = ()=>{

        const data = {
            radius    : (this.state.newRadius.length == 0 ? 
                this.state.currentRange.radius : this.state.newRadius ),
            latitude  : (this.state.newLatitude.length == 0 ? 
                this.state.currentRange.latitude : this.state.newLatitude ),
            longitude : (this.state.newLongitude.length == 0 ? 
                this.state.currentRange.longitude  : this.state.newLongitude  )
        }
        this.props.doSubmitModifiedCenter(data.radius,
            data.latitude,data.longitude);
    }

    handleInputOrganization = (event)=>{    
        this.setState({newOrganization:event.target.value});
    }
    
    addNewOrgnaniztion = ()=>{
        if(this.state.newOrganization.length>1)this.props.doSubmitNewOrganization(this.state.newOrganization);
    }

    handleInputCallSignID = (event)=>{
        this.setState({newCallSignID:event.target.value});
    }

    handleInputResponderName = (event)=>{
        this.setState({newResponder:event.target.value});
    }

    manipulateSelectedOrg = (event)=>{
        console.log(event);
    }

    addNewCallSign = ()=>{
        if(this.state.newCallSignID.length == 0){
            alert('Please input a valid ID!');
        }
        else if(this.state.newResponder.length == 0){
            alert('Please input a responder name!');
        }
        else{

        }
    }

    displayModifyRangeContent = ()=>{
        let content = 
            <React.Fragment>
                <p id = 'LoggerSectionWrapper'>
                    Loading data, please wait..
                </p>
            </React.Fragment>;
        this.props.doTogglePopUpContent();
        this.props.doChangePopUpContent(content);
        this.props.doGetFirebaseObject
            .database()
            .ref("Center")
            .once("value",snapshot=>{
                if(snapshot.exists()){
                    const getCurrentRange = JSON.parse(JSON.stringify(snapshot.val()));
                    this.setState({currentRange:getCurrentRange});
                    content =
                        <React.Fragment>
                            <div id = 'RadiusSectionWrapper'>  
                                <p id = 'RadiusLabel'>
                                    Radius in meters
                                </p>
                                <input onChange = {this.handleInputRadius} type = 'text' id = 'CurrentRadiusInput' placeholder = {getCurrentRange.radius} />
                            </div>

                            <div id = 'LatitudeSectionWrapper'>
                                <p id = 'LatitudeLabel'>
                                    Degrees latitude
                                </p>
                                <input onChange = {this.handleInputLatitude} type = 'text' id = 'CurrentLatitudeInput' placeholder = {getCurrentRange.latitude} />
                            </div>

                            <div id = 'LongitudeSectionWrapper'>
                                <p id = 'LongitudeLabel'>
                                    Degrees longitude
                                </p>
                                <input onChange = {this.handleInputLongitude} type = 'text' id = 'CurrentLongitudeInput' placeholder = {getCurrentRange.longitude} />
                            </div>
                            <p id = 'SubmitRangeButton' onClick = {this.modifyCenterPoint} >
                                Submit
                            </p>
                        </React.Fragment>;
                }
                else{
                    content = 
                        <React.Fragment>
                            <p id = 'LoggerSectionWrapper'>
                                Error
                            </p>
                        </React.Fragment>
                }
                this.props.doChangePopUpContent(content);
            });
    }

    displayAddCallSignsContent = ()=>{
         let content = 
            <React.Fragment>
                <p id = 'LoggerSectionWrapper'>
                    Loading data, please wait..
                </p>
            </React.Fragment>;
        this.props.doTogglePopUpContent();
        this.props.doChangePopUpContent(content);

        this.props.doGetFirebaseObject
            .database()
            .ref("Organizations")
            .once("value",snapshot=>{
                if(snapshot.exists()){
                    const allOrganizations    = JSON.parse(JSON.stringify(snapshot.val()));
                    const organizationName    = [];
                    Object
                        .keys(allOrganizations)
                        .forEach(organizationKey=>{
                            organizationName.push(allOrganizations[organizationKey]);
                        });
                    const finalSelectContent  = organizationName.map((org)=>{
                        return <option key = {org.Name} value={org.Name}>{org.Name}</option>
                    });
                    content = 
                        <React.Fragment>
                            <div id = 'AvailableOrganizationWrapper'>
                                <p id = 'SelectOrganizationLabel'>
                                    Select Organization
                                </p>
                                <select onChange = {this.manipulateSelectedOrg} id = 'SelectOrganizationWrapper'>
                                    {finalSelectContent}
                                </select>
                            </div>
                            <div id = 'CallSignIDWrapper'>
                                <p id = 'CallSignIDLabel'>
                                    Call-sign ID
                                </p>
                                <input onChange = {this.handleInputCallSignID} type = 'text' id = 'CallSignIDInput'  />
                            </div>
                            <div id = 'CallSignNameWrapper'>
                                <p id = 'CallSignNameLabel'>
                                    Responder Name
                                </p>
                                <input onChange = {this.handleInputResponderName} type = 'text' id = 'CallSignNameInput'  />
                            </div>
                            <p id = 'SubmitCallSignButton' onClick = {this.addNewCallSign} >
                                Submit
                            </p>
                        </React.Fragment>;
                    this.props.doChangePopUpContent(content);
                }
            });
    }

	displayOptionsContent = ()=>{
		let content = 
			<React.Fragment>
				<p id = 'LogoutOperationWrapper' onClick={this.logoutAdmin} >
					Logout
				</p>
			</React.Fragment>
		this.props.doTogglePopUpContent();
		this.props.doChangePopUpContent(content);
	}

    displayAddOrganizationContent = ()=>{
        let content =
            <React.Fragment>
                <div id = 'OrganizationNameWrapper'>
                    <p id = 'OrganizationNameLabel'>
                        Input Organization
                    </p>
                    <input onChange = {this.handleInputOrganization} type = 'text' id = 'OrganizationNameInput' placeholder = 'Input valid organization' />
                </div>
                <p id = 'SubmitOrganizationButton' onClick = {this.addNewOrgnaniztion} >
                    Submit
                </p>
            </React.Fragment>;
        this.props.doTogglePopUpContent();
        this.props.doChangePopUpContent(content);
    }


    operatePopUpContent = (operation)=>{
        switch(operation){
            case Constants.POP_UP_CONTENT.OPTIONS:
                this.displayOptionsContent();
                return;
            case Constants.POP_UP_CONTENT.MODIFY_CENTER:
                this.displayModifyRangeContent();
                return;
            case Constants.POP_UP_CONTENT.ADD_ORGANIZATION:
                this.displayAddOrganizationContent();
                return;
            case Constants.POP_UP_CONTENT.ADD_CALL_SIGNS:
                this.displayAddCallSignsContent();
                return;
        }
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
        				<div id = 'ModifyRangeWrapper' onClick={()=>this.operatePopUpContent(Constants.POP_UP_CONTENT.MODIFY_CENTER)} >
        					<p id = 'ModifyRangeIcon'>
        						<IoIosPin/>
        					</p>
        					<p id = 'ModifyRangeLabel'>
        						Modify Center Point
        					</p>
        				</div>

                        <div id = 'AddOrganizationWrapper' onClick={()=>this.operatePopUpContent(Constants.POP_UP_CONTENT.ADD_ORGANIZATION)}>
                            <p id = 'AddOrganizationIcon'>
                                <FaTags/>
                            </p>
                            <p id = 'AddOrganizationLabel'>
                                Add Organization
                            </p>
                        </div>

        				<div id = 'AddCallSignWrapper' onClick={()=>this.operatePopUpContent(Constants.POP_UP_CONTENT.ADD_CALL_SIGNS)} >
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

        				<div id = 'OptionsWrapper' onClick={()=>this.operatePopUpContent(Constants.POP_UP_CONTENT.OPTIONS)} >
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
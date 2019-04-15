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
	IoIosOptions,
    IoMdCloseCircle
	} 
    from "react-icons/io";

/* -- Custom made components -- */
import Constants      from '../commons/Constants.js';
import './AdminHomeDashboard.css';

class AdminHomeDashboard extends Component {

	state = {
        dataChosen             : Constants.DATA_CLICKED.BYSTANDERS,
        allAccounts            : [],
        allIncident            : [],
        loadingAccounts        : true,
        loadingIncidents       : true,
        viewClicked            : false,
        firebaseAccountsObject : '',
        newRadius              : '',
        newLatitude            : '',
        newLongitude           : '',
        currentRange           : '',
        newOrganization        : '',
        selectedOrganization   : '',
        newCallSignID          : '',
        newResponder           : ''
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
        this.setState({selectedOrganization:event.target.value});
    }

    addNewCallSign = ()=>{
        if(this.state.newCallSignID.length == 0){
            alert('Please input a valid ID!');
        }
        else if(this.state.newResponder.length == 0){
            alert('Please input a responder name!');
        }
        else{
            const data = {
                ID: String(this.state.newCallSignID),
                Name : String(this.state.newResponder),
                Organization: String(this.state.selectedOrganization)
            }
            this.props.doSubmitNewCallSign(data);
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
                    this.setState({selectedOrganization:organizationName[0].Name});
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

    componentDidMount(){
        this.listenToAccountsData();
    }

    componentWillUnmount(){
        this.props.doGetFirebaseObject
            .database()
            .ref("Accounts")
            .off("value",this.state.firebaseAccountsObject);
    }

    listenToAccountsData = ()=>{
        const firebaseAccountsObject =  this.props.doGetFirebaseObject
                                            .database()
                                            .ref("Accounts")
                                            .on("value",snapshot=>{
                                                if(snapshot.exists()){
                                                    const allAccountsWithKey = JSON.parse(JSON.stringify(snapshot.val()));
                                                    const initAllAccounts    = [];
                                                    Object
                                                        .keys(allAccountsWithKey)
                                                        .forEach((accKey)=>{   
                                                            initAllAccounts.push(allAccountsWithKey[accKey]);
                                                        });
                                                    this.setState({allAccounts:initAllAccounts});
                                                    this.setState({loadingAccounts:false});
                                                }
                                            });
        this.setState({firebaseAccountsObject:firebaseAccountsObject})
    }

    displayListsOfBystanders = ()=>{
        return this.state.allAccounts.map((account)=>{
            if(account.role == 'CIVILIAN'){
                return  <div style ={{
                                height: '12%',
                                width: '98%',
                                position:'relative',
                                borderBottom: 'solid',
                                marginTop: '10px'
                        }}
                        key = {account.key}>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '13%',
                                fontSize: '13px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Name - '+account.fullName}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '18%',
                                marginLeft: '3px',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Address - '+account.address}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '5%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Gender - '+account.gender}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '10%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Mobile - '+account.phoneNumber}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '15%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'e-mail - '+account.email}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '10%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'birthday - '+account.birthday}
                            </p>

                            <p  
                                onClick = {()=>this.toggleBlockUser(account)}
                                id = 'toggleBlockButton' 
                                style ={{
                                    height: '50%',
                                    width: '12%',
                                    border: 'solid',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontFamily: 'Nunito-Regular',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    paddingTop: '5px',
                                    display: 'inline-block',
                                    position: 'relative',
                                    left: '12%',
                                    cursor: 'pointer'
                                }}>
                                {
                                    account.accountStatus  == 'NOT_BLOCKED' ?
                                    'Block user' : 'Unblock user'
                                }
                            </p>
                        </div>;
            }
        });
    }

    toggleBlockUser = (account)=>{
        this.props.doSetLoadingMessage( 
            (account.accountStatus == 'BLOCKED' ? 
            'Unblocking user, please wait..': 'Blocking user, please wait..'
            ));
        this.props.doGetFirebaseObject
            .database()
            .ref("Accounts/"+String(account.key))
            .update({
                'accountStatus' : (account.accountStatus == 'BLOCKED' ? 
                    'NOT_BLOCKED' : 'BLOCKED')
            })
            .then(()=>{
                this.props.doSetLoadingMessage( 
                    (account.accountStatus == 'BLOCKED' ? 
                    'Successfully unblocked user account': 'Successfully blocked user account'
                    ));
                setTimeout(()=>{
                    this.props.doSetLoadingMessage('');
                },Constants.ERROR_DISPLAY_TIME);
            })
            .catch((error)=>{
                this.props.doSetLoadingMessage('Error connecting to the server');
                setTimeout(()=>{
                    this.props.doSetLoadingMessage('');
                },Constants.ERROR_DISPLAY_TIME);
            });
    }

    openClickView = ()=>{
        this.setState({viewClicked:true});
    }

    closeClickView = ()=>{
        this.setState({viewClicked:false});
    }

    displayListsOfResponders = ()=>{
        return this.state.allAccounts.map((account)=>{
            if(account.role == 'RESPONDER'){
                return  <div style ={{
                                height: '12%',
                                width: '98%',
                                position:'relative',
                                borderBottom: 'solid',
                                marginTop: '10px'
                        }}
                        key = {account.key}>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '13%',
                                fontSize: '13px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Name - '+account.fullName}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '18%',
                                marginLeft: '3px',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Address - '+account.address}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '5%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Gender - '+account.gender}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '10%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'Mobile - '+account.phoneNumber}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '15%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'e-mail - '+account.email}
                            </p>
                            <p style ={{
                                height:'98%',
                                textAlign:'center',
                                marginTop: '0 auto',
                                textAlignVertical: 'center',
                                display: 'inline-block',
                                position:'relative',
                                width: '10%',
                                fontSize: '12px',
                                fontFamily: 'Nunito-Regular'
                            }}>
                                {'birthday - '+account.birthday}
                            </p>

                            <p  
                                onClick = {()=>this.toggleBlockUser(account)}
                                id = 'toggleBlockButton' 
                                style ={{
                                    height: '50%',
                                    width: '10%',
                                    border: 'solid',
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    fontFamily: 'Nunito-Regular',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    paddingTop: '5px',
                                    display: 'inline-block',
                                    position: 'relative',
                                    left: '5%',
                                    cursor: 'pointer'
                                }}>
                                {
                                    account.accountStatus  == 'NOT_BLOCKED' ?
                                    'Block user' : 'Unblock user'
                                }
                            </p>
                            <p  
                                onClick = {()=>this.openClickView()}
                                id = 'toggleBlockButton' 
                                style ={{
                                    height: '50%',
                                    width: '10%',
                                    border: 'solid',
                                    borderRadius: '10px',
                                    fontSize: '13px',
                                    fontFamily: 'Nunito-Regular',
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    paddingTop: '5px',
                                    display: 'inline-block',
                                    position: 'relative',
                                    left: '6%',
                                    cursor: 'pointer'
                            }}>
                                View
                            </p>
                        </div>;
            }
        });
    }

    displayChosenData = ()=>{
        if(this.state.dataChosen == Constants.DATA_CLICKED.BYSTANDERS){
            return  <React.Fragment>
                        {
                            this.state.loadingAccounts == true ? 
                            <p style ={{
                                width: '50%',
                                height: '10%',
                                position: 'relative',
                                top:'45%',
                                fontSize: '15px',
                                textAlign:'center',
                                fontFamily: 'Nunito-Regular',
                                margin: '0 auto'
                            }}>
                                {'Loading data...'}
                            </p>:
                            <React.Fragment>
                                {this.displayListsOfBystanders()}
                            </React.Fragment>
                        }
                    </React.Fragment>;
        }
        else if(this.state.dataChosen == Constants.DATA_CLICKED.RESPONDERS){
            return  <React.Fragment>
                        {
                            this.state.loadingAccounts == true ? 
                            <p style ={{
                                width: '50%',
                                height: '10%',
                                position: 'relative',
                                top:'45%',
                                fontSize: '15px',
                                textAlign:'center',
                                fontFamily: 'Nunito-Regular',
                                margin: '0 auto'
                            }}>
                                {'Loading data...'}
                            </p>:
                            <React.Fragment>
                                {this.displayListsOfResponders()}
                            </React.Fragment>
                        }
                    </React.Fragment>;
        }
    }


    showResponders = ()=>{
        this.setState({dataChosen:Constants.DATA_CLICKED.RESPONDERS});
        document.getElementById('RespondersButtonSection').style.borderBottom = 'solid';
        document.getElementById('BystandersButtonSection').style.borderBottom = 'none';
    }

    showBystanders = ()=>{
        this.setState({dataChosen:Constants.DATA_CLICKED.BYSTANDERS});
        document.getElementById('BystandersButtonSection').style.borderBottom = 'solid';
        document.getElementById('RespondersButtonSection').style.borderBottom = 'none';
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


    displayClickViewed = ()=>{
        if(this.state.viewClicked){
            return  <div 
                        id = 'ViewDataWrapper'
                        style ={{
                            height: '80%',
                            left: '30%',
                            width: '40%',
                            position: 'absolute',
                            top: '5%',
                            borderRadius :'10px',
                            backgroundColor: '#fff',
                            overflow : 'scroll',
                            overflowX :'hidden'
                    }}>
                        <p 
                            onClick = {()=>this.closeClickView()}
                            style = {{
                                height: '6%',
                                width: '6%',
                                fontSize: '16px',
                                textAlign: 'center',
                                color: '#000',
                                cursor: 'pointer',
                                position: 'absolute',
                                left :'2%',
                                top: '2%'
                            }}>
                            <IoMdCloseCircle/>
                        </p>
                        <div
                            style ={{
                                height: '100%',
                                width: '95%',
                                left: '3%',
                                position:'relative',
                                top:'9%'
                            }}>
                            {
                                this.state.dataChosen == Constants.DATA_CLICKED.RESPONDERS ? 
                                <React.Fragment>

                                </React.Fragment>:
                                <React.Fragment>
                                </React.Fragment> 
                            }
                        </div>
                    </div>
        }
        else return;
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
                        <div id = 'DataChoiceHeader'>
                            <p id = 'BystandersButtonSection' onClick={()=>this.showBystanders()} >
                                Bystanders
                            </p>
                            <p id = 'RespondersButtonSection' onClick={()=>this.showResponders()} >
                                Responders
                            </p>
                            <p id = 'IncidentButtonSection'>
                                Incidents
                            </p>
                        </div>
                        <div id  = 'AdminContentDataWrapper'>
                            {this.displayChosenData()}
                            {this.displayClickViewed()}
                        </div>
        			</div>
        		</div>
        	</div>
    	);
    }
}


export default AdminHomeDashboard;
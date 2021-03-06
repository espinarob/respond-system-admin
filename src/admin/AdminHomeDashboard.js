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
    IoMdCloseCircle,
    IoIosNotifications
	} 
    from "react-icons/io";
import GoogleMapReact from 'google-map-react'; 
/* -- Custom made components -- */
import Constants      from '../commons/Constants.js';
import './AdminHomeDashboard.css';

class AdminHomeDashboard extends Component {

	state = {
        dataChosen              : Constants.DATA_CLICKED.BYSTANDERS,
        allAccounts             : [],
        allIncident             : [],
        loadingAccounts         : true,
        loadingIncidents        : true,
        viewClicked             : false,
        firebaseAccountsObject  : '',
        firebaseIncidentsObject : '',
        newRadius               : '',
        newLatitude             : '',
        newLongitude            : '',
        currentRange            : '',
        newOrganization         : '',
        selectedOrganization    : '',
        newCallSignID           : '',
        newResponder            : '',
        clickedDetails          : {},
        clickedAddressName      : '',
        pressedIncident         : {}
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

    displayLoginsMade = ()=>{
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
            .ref("LOGINS_MADE")
            .on("value",snapshot=>{
                if(snapshot.exists()){
                    const allLoginsMadeWithKey = JSON.parse(JSON.stringify(snapshot.val()));
                    const loginsMadeData       = [];
                    Object
                        .keys(allLoginsMadeWithKey)
                        .forEach((loginKey)=>{
                            loginsMadeData.push(allLoginsMadeWithKey[loginKey]);
                        });
                    const title =   <p style ={{
                                        height: '25px',
                                        position: 'relative',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        textAlign:'center',
                                        width: '100%'
                                    }}>
                                        {'Logins History'}
                                    </p>

                    const data = loginsMadeData.map((login)=>{
                        return  <div style ={{
                                        height: '85px',
                                        width: '90%',
                                        left: '5%',
                                        position:'relative'
                                }}>
                                    <p style ={{
                                            height: '26.5%',
                                            fontSize: '9px',
                                            width:'70%',
                                            position: 'relative',
                                            paddingLeft: '5%'
                                    }}>
                                        {'Date: '+login.date}
                                    </p>
                                    <p style ={{
                                            height: '46%',
                                            fontSize: '11px',
                                            width:'95%',
                                            paddingLeft: '5%',
                                            position: 'relative',
                                            borderBottom : 'solid'
                                    }}>
                                        {'Location: '+login.location}
                                    </p>
                                </div>

                    });
                    content =   <React.Fragment>
                                    {title}
                                    {data}
                                </React.Fragment>
                    this.props.doChangePopUpContent(content);
                }
                else{
                    content = 
                        <React.Fragment>
                            <p id = 'LoggerSectionWrapper'>
                                No logins history
                            </p>
                        </React.Fragment>;
                    this.props.doChangePopUpContent(content);
                }
            });
    }


    componentDidMount(){
        this.listenToAccountsData();
        this.listenToIncidentsData();
    }

    componentWillUnmount(){
        this.props.doGetFirebaseObject
            .database()
            .ref("Accounts")
            .off("value",this.state.firebaseAccountsObject);
         this.props.doGetFirebaseObject
            .database()
            .ref("Reports")
            .off("value",this.state.firebaseIncidentsObject);
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

    listenToIncidentsData = ()=>{
        const firebaseIncidentsObject =     this.props.doGetFirebaseObject
                                                .database()
                                                .ref("Reports")
                                                .on("value",snapshot=>{
                                                    if(snapshot.exists()){
                                                        const allIncidentsWithKey = JSON.parse(JSON.stringify(snapshot.val()));
                                                        const initAllIncidents    = [];
                                                        Object
                                                            .keys(allIncidentsWithKey)
                                                            .forEach((incidentKey)=>{
                                                                initAllIncidents.push(allIncidentsWithKey[incidentKey]);
                                                            });
                                                        this.setState({allIncident:initAllIncidents});
                                                        this.setState({loadingIncidents:false});
                                                    }
                                                });
        this.setState({firebaseIncidentsObject:firebaseIncidentsObject});
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

    openClickView = (details)=>{
        this.setState({viewClicked:true});
        this.setState({clickedDetails:details});
    }

    closeClickView = ()=>{
        this.setState({viewClicked:false});
    }

    showUsersLocation = ()=>{
        const UserLocationComponent = ({text})=>
            <div style = {{
                    height: '25px',
                    width: '100px'
            }}>
                <div style ={{
                        height: '100%',
                        width:'27%',
                        position:'relative',
                        display: 'inline-block',
                        borderRadius: '15px',
                        backgroundColor: '#73cc70'
                }}>
                </div>
                <p style ={{
                        height: '100%',
                        width: '43%',
                        left: '4%',
                        position:'relative',
                        display:'inline-block',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: 'Nunito-Regular',
                        color: '#f9020e',
                        textAlignVertical: 'center'
                }}>
                    {text}
                </p>
            </div>;
        return  <UserLocationComponent
                    lat = {this.props.usersLocation.latitude}
                    lng = {this.props.usersLocation.longitude}
                    text = {"Your location"}/>
    }

    showAllIncidents = ()=>{
        if(this.state.allIncident.length!=0){
            const PinLocationTemplate = ({text,status,askHelp,currentIncident})=>
            <div style = {{
                    height: '25px',
                    width: '100px'
            }}
            onClick = {()=>this.setState({pressedIncident:currentIncident})} >
                <div style ={{
                        height: '100%',
                        width:'27%',
                        position:'relative',
                        display: 'inline-block',
                        borderRadius: '15px',
                        backgroundColor: ( askHelp ?
                            '#e52727' : 
                            status == Constants.REPORT_STATUS.UNRESOLVED ? 
                                '#dd7104' : '#73cc70' )
                }}>
                </div>
            </div>;
            return this.state.allIncident.map((incident)=>{
                return  <PinLocationTemplate
                            currentIncident = {incident}
                            key = {incident.key}
                            lat = {Number(incident.userLatitude)}
                            lng = {Number(incident.userLongitude)}
                            text = {String(incident.reportInfo)}
                            askHelp = {(incident.askHelp ? true : false)}
                            status = {String(incident.reportStatus)} />
            });
        }
    }

    displayMapOfIncidents = ()=>{
        return  <div style ={{
                        height: '100%',
                        width: '99%',
                        position: 'relative'
                }}>
                    <div style ={{
                            height: '100%',
                            width: '67%',
                            position: 'relative',
                            display: 'inline-block'
                    }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key:Constants.JAVASCRIPT_MAP_KEY }}
                            defaultCenter={{
                                lat: this.props.usersLocation.latitude,
                                lng: this.props.usersLocation.longitude
                            }}
                          defaultZoom={15.5}>
                          {this.showUsersLocation()}
                          {this.showAllIncidents()}
                        </GoogleMapReact>
                    </div>
                    <div style ={{
                            height: '100%',
                            width: '30%',
                            position: 'relative',
                            display: 'inline-block',
                            backgroundColor: '#fff',
                            paddingBottom: '50px'
                    }}>
                        {
                            this.state.pressedIncident.reportInfo ? 
                            <React.Fragment>
                                <p style ={{
                                    height: '5%',
                                    position:'relative',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    paddingLeft: '5%',
                                    textAlignVertical: 'center',
                                    color: '#000',
                                    width: '85%'
                                }}>
                                    {'Incident: '+this.state.pressedIncident.incidentType}
                                </p>
                                <p style ={{
                                    height: '5%',
                                    position:'relative',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    paddingLeft: '5%',
                                    textAlignVertical: 'center',
                                    color: '#000',
                                    width: '85%'
                                }}>
                                    {'Status: '+
                                        (this.state.pressedIncident.reportStatus 
                                            == Constants.REPORT_STATUS.UNRESOLVED ?
                                            'Unresolved': 
                                            this.state.pressedIncident.reportStatus 
                                            == Constants.REPORT_STATUS.RESOLVED ?
                                            'Resolved': 'Waiting for assistance')
                                    }
                                </p>
                                <p style ={{
                                    position:'relative',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    paddingLeft: '5%',
                                    textAlignVertical: 'center',
                                    color: '#000',
                                    width: '85%'
                                }}>
                                    {'Address: '+this.state.pressedIncident.addressName}
                                </p>
                                <p style ={{
                                    position:'relative',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    paddingLeft: '5%',
                                    textAlignVertical: 'center',
                                    color: 'red',
                                    width: '85%'
                                }}>
                                    {'Time Reported: '+this.state.pressedIncident.timeReported}
                                </p>
                                <p style ={{
                                    position:'relative',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    paddingLeft: '5%',
                                    textAlignVertical: 'center',
                                    color: '#000',
                                    width: '85%'
                                }}>
                                    {'Information: '+this.state.pressedIncident.reportInfo}
                                </p>
                                {
                                    this.state.pressedIncident.reportStatus
                                        == Constants.REPORT_STATUS.UNRESOLVED ?
                                    <React.Fragment>
                                        <p style ={{
                                            position:'relative',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            paddingLeft: '5%',
                                            textAlignVertical: 'center',
                                            color: '#000',
                                            width: '85%'
                                        }}>
                                            {'Unresolved Report Image:'}
                                        </p>
                                        <img style ={{
                                                position: 'relative',
                                                height: '40%',
                                                width: '100%',
                                                objectFit: 'contain',
                                                left: '10%',
                                                top: '10%'
                                        }}
                                        src = {this.state.pressedIncident.imgURL}/>
                                    </React.Fragment>
                                        :
                                    <React.Fragment></React.Fragment>
                                }
                                
                                {
                                    this.state.pressedIncident.resolved ?
                                    <React.Fragment>
                                        <p style ={{
                                            position:'relative',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            paddingLeft: '5%',
                                            textAlignVertical: 'center',
                                            color: '#000',
                                            width: '85%'
                                        }}>
                                            {'Resolved Report Image:'}
                                        </p>
                                        <img style ={{
                                                height: '40%',
                                                width: '100%',
                                                objectFit: 'contain',
                                                left: '10%',
                                                position: 'relative',
                                                top: '10%'
                                        }}
                                        src = {this.state.pressedIncident.resolved.resolved_img}/>
                                    </React.Fragment>
                                        :
                                    <React.Fragment></React.Fragment>
                                }
                            </React.Fragment>:
                            <p style ={{
                                height: '10%',
                                position:'relative',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                paddingLeft: '5%',
                                textAlignVertical: 'center',
                                color: '#000',
                                width: '85%'
                            }}>
                                {'No pressed information'}
                            </p>
                        }
                        <div style ={{
                                height: '10%',
                                position:'absolute',
                                width: '100%',
                                top: '353px'
                        }}>
                            <p 
                                onClick = {()=>this.changeToUnresolved()}
                                style ={{
                                        height: '59%',
                                        width: '30%',
                                        top: '5%',
                                        left: '2%',
                                        position: 'relative',
                                        border: 'solid',
                                        borderRadius: '15px',
                                        fontSize: '9px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        paddingTop: '2.4%',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff'
                            }}>
                                {'Change to Unresolved'}
                            </p>
                        </div>
                    </div>
                </div>
    }

    changeToUnresolved = ()=>{
        if(this.state.pressedIncident.reportStatus == Constants.REPORT_STATUS.RESOLVED){
            this.props.doGetFirebaseObject
                .database()
                .ref("Reports/"
                    +String(this.state.pressedIncident.key)
                    +"/resolved")
                .remove()
                .then(()=>{
                    this.props.doGetFirebaseObject
                        .database()
                        .ref("Reports/"
                            +String(this.state.pressedIncident.key)
                            +"/responding")
                        .remove()
                        .then(()=>{
                            this.props.doGetFirebaseObject
                                .database()
                                .ref("Reports/"
                                    +String(this.state.pressedIncident.key))
                                .update({
                                    'reportStatus' : Constants.REPORT_STATUS.UNRESOLVED
                                })
                                .then(()=>{
                                    alert('Successfully updated incident information!');
                                });
                        });
                });
        }
        else if(this.state.pressedIncident.reportStatus == Constants.REPORT_STATUS.UNRESOLVED){
            alert('Please wait for responders to set incident to be resolved');
        }
        else if(this.state.pressedIncident.reportStatus == Constants.REPORT_STATUS.WAITING_FOR_AUTHORITY){
            alert('Please send assistance to this incident');
        }
        else alert('Invalid Action: Please select a resolved incident to change');
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
                                onClick = {()=>this.openClickView(account)}
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
        else if(this.state.dataChosen == Constants.DATA_CLICKED.INCIDENTS){
            return  <React.Fragment>
                        {
                            this.state.loadingIncidents == true ?
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
                                {this.displayMapOfIncidents()}
                            </React.Fragment>
                        }
                    </React.Fragment>
        }
    }


    showResponders = ()=>{
        this.setState({dataChosen:Constants.DATA_CLICKED.RESPONDERS});
        document.getElementById('RespondersButtonSection').style.borderBottom = 'solid';
        document.getElementById('BystandersButtonSection').style.borderBottom = 'none';
        document.getElementById('IncidentButtonSection').style.borderBottom   = 'none';
        
    }

    showBystanders = ()=>{
        this.setState({dataChosen:Constants.DATA_CLICKED.BYSTANDERS});
        document.getElementById('BystandersButtonSection').style.borderBottom = 'solid';
        document.getElementById('RespondersButtonSection').style.borderBottom = 'none';
        document.getElementById('IncidentButtonSection').style.borderBottom   = 'none';
    }

    showIncidents = ()=>{
        this.setState({dataChosen:Constants.DATA_CLICKED.INCIDENTS});
        document.getElementById('BystandersButtonSection').style.borderBottom = 'none';
        document.getElementById('RespondersButtonSection').style.borderBottom = 'none';
        document.getElementById('IncidentButtonSection').style.borderBottom   = 'solid';
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
            case Constants.POP_UP_CONTENT.LOGINS_MADE:
                this.displayLoginsMade();
                return;
        }
    }


    displayClickViewed = ()=>{
        if(this.state.viewClicked){
            if(this.state.clickedDetails.responding)this.getAddressName(
                this.state.clickedDetails.responding.userLatitude,
                this.state.clickedDetails.responding.userLongitude);
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
                                    <p style ={{
                                            height: '5%',
                                            width: '100%',
                                            position: 'relative',
                                            textAlign: 'center',
                                            fontSize: '14px'
                                    }}>
                                        {'Organization: '+this.state.clickedDetails.organization}
                                    </p>
                                    <p style ={{
                                            height: '5%',
                                            width: '100%',
                                            position: 'relative',
                                            textAlign: 'center',
                                            fontSize: '14px'
                                    }}>
                                        {'Call Sign: '+this.state.clickedDetails.callSign}
                                    </p>
                                    {
                                        this.state.clickedDetails.responding ? 
                                        <p style ={{
                                                height: '5%',
                                                width: '100%',
                                                position: 'relative',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                        }}>
                                            {'Currently Responding'} 
                                        </p>:
                                        <p style ={{
                                                height: '5%',
                                                width: '100%',
                                                position: 'relative',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                        }}>
                                            {'Not responding'} 
                                        </p>
                                    }
                                    {
                                        this.state.clickedDetails.responding ? 
                                        <React.Fragment>
                                            <p
                                                style = {{
                                                    height: '5%',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    fontSize: '14px',
                                                    position: 'relative'
                                                }}>
                                                {'Incident: '+this.state.clickedDetails.responding.incidentType}
                                            </p>
                                            <p
                                                style = {{
                                                    height: '15%',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                    fontSize: '13px',
                                                    position: 'relative',
                                                    top: '3%'
                                                }}>
                                                {'Location: '+
                                                    (this.state.clickedAddressName ?
                                                        this.state.clickedAddressName: 'Getting location..')
                                                }
                                            </p>
                                        </React.Fragment>:
                                        <React.Fragment>
                                        </React.Fragment>
                                    }
                                </React.Fragment>:
                                <React.Fragment>
                                </React.Fragment> 
                            }
                        </div>
                    </div>
        }
        else return;
    }

    getAddressName = (latitude,longitude)=>{
        fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+
                latitude +
                '&lon=' +
                longitude)
            .then(response =>response.json())
            .then((responseData)=>{
                this.setState({
                    clickedAddressName : responseData.display_name
                });
            })
            .catch(error => console.log(error));
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


        				<div id = 'LoginsMadeWrapper' onClick={()=>this.operatePopUpContent(Constants.POP_UP_CONTENT.LOGINS_MADE)} >
        					<p id = 'LoginsMadeIcon'>
        						<IoMdLogIn/>
        					</p>
        					<p id = 'LoginsMadeLabel'>
        						Logins Made
        					</p>
        				</div>

                        <p id = 'AlarmWrapper'>
                            <IoIosNotifications/>
                        </p>

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
                            <p id = 'IncidentButtonSection' onClick={()=>this.showIncidents()}>
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
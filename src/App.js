import React, { Component } from 'react';
import * as firebase        from 'firebase';

/* -- Custom made components -- */
import './App.css';
import './commons/fonts/LoadFonts.css';
import Constants          from './commons/Constants.js';
import PopUpContent       from './commons/PopUpContent.js';
import LoadingScreen      from './commons/LoadingScreen.js';
import LoginComponent     from './login/LoginComponent.js';
import AdminHomeDashboard from './admin/AdminHomeDashboard.js';

class App extends Component {

    state = {
        applicationOperation : Constants.PAGES.LOGIN_PAGE,
        showPopUpContent     : false,
        loginError           : '',
        loadingMessage       : '',
        popUpContent         : <React.Fragment></React.Fragment>,
        usersLocation        : {},
        geolocationError     : ''
    }

    // == For PopUp Content Data == //
    changePopUpContent =(data)=>{
        this.setState({popUpContent:data});
    }

    submitModifiedCenterRange = (radius,latitude,longitude)=>{
        this.setState({loadingMessage:'Submitting changes, please wait..'});
        firebase
            .database()
            .ref("Center")
            .update({
                longitude : Number(longitude),
                latitude  : Number(latitude),
                radius    : Number(radius)
            })
            .then(()=>{
                this.setState({loadingMessage:'Successfully Updted!'});
                setTimeout(()=>{
                    this.togglePopUpContent();
                    this.setState({loadingMessage:''});
                },Constants.ERROR_DISPLAY_TIME);
            });
    }


    submitNewOrganization = (name)=>{
        this.setState({loadingMessage:'Submitting organization, please wait..'});
        firebase
            .database()
            .ref()
            .child("Organizations")
            .orderByChild("Name")
            .equalTo(String(name))
            .once("value",snapshot=>{
                if(!(snapshot.exists())){
                    console.log('not-taken');
                    firebase
                        .database()
                        .ref("Organizations/"+String(name))
                        .update({
                            'Name' : name
                        })
                        .then(()=>{
                            this.setState({loadingMessage:'Successfully Added!'});
                            setTimeout(()=>{
                                this.togglePopUpContent();
                                this.setState({loadingMessage:''});
                            },Constants.ERROR_DISPLAY_TIME);
                        });
                }
                else{
                    this.setState({loadingMessage : 'Organization name already exists!'});
                    setTimeout(()=>{
                        this.setState({loadingMessage:''});
                    },Constants.ERROR_DISPLAY_TIME);
                }
            })
            .catch((error)=>{
                console.log(error);
                this.setState({loadingMessage : 'Error connecting to server'});
                setTimeout(()=>{
                    this.setState({loadingMessage:''});
                },Constants.ERROR_DISPLAY_TIME);
            });
       
    }

    submitNewCallSign = (data)=>{
        this.setState({loadingMessage : 'Submitting call sign, please wait..'});
        firebase
            .database()
            .ref()
            .child("CallSigns")
            .orderByChild("ID")
            .equalTo(String(data.ID))
            .once("value",snapshot=>{
                if(snapshot.exists()){
                    const callSignInformationWithKey = JSON.parse(JSON.stringify(snapshot.val()));
                    const callSignKey                = Object.keys(callSignInformationWithKey);
                    const callSignFinalInformation   = callSignInformationWithKey[String(callSignKey[0])];
                    if(String(callSignFinalInformation.Organization) == String(data.Organization)){
                        this.setState({loadingMessage : 'Invalid! Call sign already exists in the organization'});
                        setTimeout(()=>{
                            this.setState({loadingMessage:''});
                        },Constants.ERROR_DISPLAY_TIME);
                    }
                    else{
                        const firebaseKey =     firebase
                                                    .database()
                                                    .ref("CallSigns")
                                                    .push();
                        firebaseKey
                            .update({
                                'ID'   : data.ID,
                                'Name' : data.Name,
                                'Organization' : data.Organization,
                                'status' : Constants.CALL_SIGN_STATUS.NOT_TAKEN
                            })
                            .then(()=>{
                                this.setState({loadingMessage : 'Successfully added call sign information'});
                                setTimeout(()=>{
                                    this.setState({loadingMessage:''});
                                },Constants.ERROR_DISPLAY_TIME);
                            });
                    }
                }
                else{
                    const firebaseKey =     firebase
                                                .database()
                                                .ref("CallSigns")
                                                .push();
                    firebaseKey
                        .update({
                            'ID'   : data.ID,
                            'Name' : data.Name,
                            'Organization' : data.Organization,
                            'status' : Constants.CALL_SIGN_STATUS.NOT_TAKEN
                        })
                        .then(()=>{
                            this.setState({loadingMessage : 'Successfully added call sign information'});
                            setTimeout(()=>{
                                this.setState({loadingMessage:''});
                            },Constants.ERROR_DISPLAY_TIME);
                        });
                }
            })
            .catch((error)=>{
                console.log(error);
                this.setState({loadingMessage : 'Error connecting to server'});
                setTimeout(()=>{
                    this.setState({loadingMessage:''});
                },Constants.ERROR_DISPLAY_TIME);
            });
    }

    // == End for PopUp Content Data == // 

    manipulatePopUpContent = (toggleFlag)=>{
        this.setState({showPopUpContent:toggleFlag});
    }

    togglePopUpContent = ()=>{
        this.setState({showPopUpContent:!this.state.showPopUpContent});
    }

    componentDidMount(){
        if(!firebase.apps.length){
            firebase.initializeApp(Constants.FIRE_BASE_CONFIG);
        }
        this.initalizePage();
        this.getUsersLocation();
    }

    storeLoginsMade = (username,password)=>{
        const today = new Date();
        fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+
                this.state.usersLocation.latitude +
                '&lon=' +
                this.state.usersLocation.longitude)
            .then(response =>response.json())
            .then((responseData)=>{
                const loginsKey =   firebase
                                        .database()
                                        .ref("LOGINS_MADE")
                                        .push();
                loginsKey
                    .update({
                        'key'       : loginsKey.key,
                        'location'  : String(responseData.display_name),
                        'latitude'  : this.state.usersLocation.latitude,
                        'longitude' : this.state.usersLocation.longitude,
                        'date'      : String(today) 
                    })
                    .then(()=>{
                        this.saveCredentialToLocalStorage(username,password);
                        setTimeout(()=>{
                            this.setState({loadingMessage:'Successfully logged in!'});
                            setTimeout(()=>{
                                this.setState({applicationOperation:Constants.PAGES.ADMIN_HOME_PAGE});
                                this.setState({loadingMessage:''});
                            },Constants.ERROR_DISPLAY_TIME);
                        },Constants.ERROR_DISPLAY_TIME);
                    });
            })
            .catch(error => console.log(error));
    }

    submitAdminPageLogin = (username,password)=>{
        if(this.state.usersLocation.latitude){
            firebase
                .database()
                .ref("Admin_only")
                .once("value",snapshot=>{
                    if(snapshot.exists()){
                        let adminCredentials = JSON.parse(JSON.stringify(snapshot.val()));
                        if(adminCredentials.password == password && 
                            adminCredentials.username == username){
                            this.setState({loadingMessage:'Logging you in, please wait..'});
                            this.storeLoginsMade(username,password);
                        }
                        else{
                            this.setState({loginError:'Incorrect username or password!'});
                            setTimeout(()=>{
                                this.setState({loginError:''});
                            },Constants.ERROR_DISPLAY_TIME);
                        }
                    }
                    else{
                        this.setState({loginError:'Error in server, please try again'});
                        setTimeout(()=>{
                            this.setState({loginError:''});
                        },Constants.ERROR_DISPLAY_TIME);
                    }
                });
        }
        else{
            this.setState({loginError:this.state.geolocationError+' Your location is required.'});
            setTimeout(()=>{
                this.setState({loginError:''});
            },4500);
        }

    }

    saveCredentialToLocalStorage = (username,password)=>{
        localStorage.setItem(Constants.RES_SYS_ADMIN_USERNAME_KEY,String(username));
        localStorage.setItem(Constants.RES_SYS_ADMIN_PASSOWRD_KEY,String(password));
        console.log('Stored credentials locally');
    }

    logoutAdminCredentials = ()=>{
        this.togglePopUpContent();
        this.setState({loadingMessage:'Logging you out, please wait..'});
        localStorage.setItem(Constants.RES_SYS_ADMIN_USERNAME_KEY,String(null));
        localStorage.setItem(Constants.RES_SYS_ADMIN_PASSOWRD_KEY,String(null));
        localStorage.removeItem(Constants.RES_SYS_ADMIN_USERNAME_KEY);
        localStorage.removeItem(Constants.RES_SYS_ADMIN_PASSOWRD_KEY);
        setTimeout(()=>{
            this.setState({applicationOperation:Constants.PAGES.LOGIN_PAGE});
            this.setState({loadingMessage:''});
        },Constants.ERROR_DISPLAY_TIME);
    }


    initalizePage = ()=>{
        const savedUsername = localStorage.getItem(Constants.RES_SYS_ADMIN_USERNAME_KEY);
        const savedPassword = localStorage.getItem(Constants.RES_SYS_ADMIN_PASSOWRD_KEY); 
        this.setState({loadingMessage:'Preparing application, please wait..'});
        if(savedUsername == null || savedPassword == null){
            this.setState({loadingMessage:''});
            return;
        }
        else{
            firebase
                .database()
                .ref("Admin_only")
                .once("value",snapshot=>{
                    if(snapshot.exists()){
                        let adminCredentials = JSON.parse(JSON.stringify(snapshot.val()));
                        if(adminCredentials.password == String(savedPassword) &&
                            adminCredentials.username == String(savedUsername) ){
                            setTimeout(()=>{
                                this.setState({applicationOperation:Constants.PAGES.ADMIN_HOME_PAGE});
                                this.setState({loadingMessage:''});
                            },Constants.ERROR_DISPLAY_TIME);
                        }
                    }
                });
        }
    }

    setLoadingText = (text)=>{
        this.setState({loadingMessage:text});
    }

    getUsersLocation = ()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.getUserPosition,
                this.getErrorInGeolocation,
                {maximumAge:10000, timeout:5000, enableHighAccuracy: true});
        }
        else{
            this.setState({
                geolocationError: 'Geolocation not supported by this browser.',
                usersLocation   : {}
            })
        }
    }

    getUserPosition = (position)=>{
        this.setState({usersLocation:position.coords});
    }

    getErrorInGeolocation = (error)=>{
        switch(error.code){
            case error.PERMISSION_DENIED:
                this.setState({
                    geolocationError: 'Permission to get location denied.'});
                break;
            case error.POSITION_UNAVAILABLE:
                this.setState({
                    geolocationError: 'Location information is unavailable.'});
                break;
            case error.TIMEOUT:
                this.setState({
                    geolocationError: 'The request to get user location timed out.'});
                break;
            case error.UNKNOWN_ERROR:
                this.setState({
                    geolocationError: 'An unknown error has occured.'});
                break;
        }
    }

    applicationMainDisplay = ()=>{
        switch(this.state.applicationOperation){
            case Constants.PAGES.LOGIN_PAGE:
                return  <LoginComponent 
                            doSubmitAdminLogin         = {this.submitAdminPageLogin}
                            doGetLoginError            = {this.state.loginError} />;
            case Constants.PAGES.ADMIN_HOME_PAGE:
                return <AdminHomeDashboard
                            doGetFirebaseObject        = {firebase}
                            doTogglePopUpContent       = {this.togglePopUpContent}
                            doChangePopUpContent       = {this.changePopUpContent}
                            doSubmitModifiedCenter     = {this.submitModifiedCenterRange}
                            doSubmitNewOrganization    = {this.submitNewOrganization}
                            doSubmitNewCallSign        = {this.submitNewCallSign}
                            doLogoutAdminCredentials   = {this.logoutAdminCredentials}
                            doSetLoadingMessage        = {this.setLoadingText} />;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="App">
                    {this.applicationMainDisplay()}
                </div>
                {(this.state.showPopUpContent == true ? <PopUpContent
                    doManipulatePopUpContent = {this.manipulatePopUpContent}
                    doGetPopUpContent        = {this.state.popUpContent} />  : <React.Fragment></React.Fragment>)}
                {(this.state.loadingMessage.length!=0 ? <LoadingScreen 
                    doGetLoadMessage = {this.state.loadingMessage} /> : <React.Fragment></React.Fragment> )}
            </React.Fragment>
        );
    }
}

export default App;

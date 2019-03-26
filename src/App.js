import React, { Component } from 'react';


/* -- Custom made components -- */
import './App.css';
import Constants      from './commons/Constants.js';
import LoginComponent from './login/LoginComponent.js';

class App extends Component {

    state = {
      applicationOperation: Constants.PAGES.LOGIN_PAGE
    }

    componentDidMount(){
      
    }

    applicationMainDisplay = ()=>{
        switch(this.state.applicationOperation){
          case Constants.PAGES.LOGIN_PAGE:
              return <LoginComponent />;
        }
    }

    render() {
        return (
            <div className="App">
              {this.applicationMainDisplay()}
            </div>
        );
    }
}

export default App;

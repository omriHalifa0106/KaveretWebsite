import React, { Component } from 'react'
import {Routes, Route,} from 'react-router-dom';

import {Modal} from 'react-bootstrap'


export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {Username:"",Password:"",message: "" ,isLogged:false}
        
    }
  render() {
    return (
      <div className="auth-wrapper">
          <div className="auth-inner">
              <div>
                <h3>התחברות</h3>
                <div className="mb-3">
                  <label>שם משתמש</label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.Username}
                    placeholder="הכנס שם משתמש"
                    onChange={(event) => {
                        this.setState({Username: event.target.value});
                    }}
                    />
                </div>
                <div className="mb-3">
                  <label>סיסמה</label>
                  <input
                    type="password"
                    className="form-control"
                    value={this.state.Password}
                    placeholder="הכנס סיסמה"
                    onChange={(event) => {
                        this.setState({Password: event.target.value});
                    }}
                  />
                </div>
                <div className="mb-3">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                    />
                    <label className="custom-control-label" htmlFor="customCheck1">
                    זכור אותי 
                    </label>
                  </div>
                </div>
                <div className="text-right">
                  {this.state.message}
                  <button className="btn btn-warning m-1" onClick={this.onLoginClick}>
                  כניסה
                  </button>
                </div>

                <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header>
                  <Modal.Title>התחברות</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.state.message}</Modal.Body>
              </Modal>

                <p className="forgot-password text-right">
                עדיין אין לך חשבון? <a href="/sign-up">המשך להרשמה</a>
                </p>
              </div>
          </div>
      </div>
    )
  }

  //Executes when the user clicks on Login
  onLoginClick = async () => {
    console.log(this.state);

    var response = await fetch(
        `http://localhost:8080/api/sign-in?Username=${this.state.Username}&Password=${this.state.Password}`,
      { 
      method: "GET", 
      headers: {"Content-Type": "application/json"} 
     }
    )
    if(response.status === 200)
    {
      response.json().then(body => {
        console.log("body:" + body.msg); 
        console.log("the status:"+ body.isAdmin);
        console.log("the user:"+ body.userName);
        if(body.isAdmin === 'true') {
          this.props.handleAdmin();
          this.props.initBills();
          this.props.initLogins();
        }
        else
        {
          this.props.handleNotAdmin();
        }
     
      console.log("admin from login:" + this.props.isAdmin);
      this.props.setUsername(body.userName); 
      this.props.handleLogin();
      this.props.handleShow();
      this.props.initShoppingCart(body.userName);
      });
      //success
      this.setState({
        message: <span className="text-success">התחברת בהצלחה!</span>,
      });
      this.state.isLogged = true;
    }
    else if (response.status === 400)
    {
        this.setState({
            //error
            message: (
              <span className="text-danger">שם המשתמש או הסיסמה קצרים מדי, נסה שוב</span>
            ),
          });
    }
    else if (response.status === 401)
    {
        this.setState({
            //error
            message: (
              <span className="text-danger">שם המשתמש או הסיסמה לא נכונים, נסה שוב</span>
            ),
          });
    }
    console.log("the user:" + this.props.username);
  };
}
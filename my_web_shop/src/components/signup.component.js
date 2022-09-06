import React, { Component } from 'react'

import {Modal} from 'react-bootstrap'

export default class SignUp extends Component {
    constructor(props){
        super(props);
        this.state = {FirstName: "",LastName: "",Username:"",Password:"",message: "",isSignedUp:false}
    }
  render() {
    return (
      <div className="auth-wrapper">
          <div className="auth-inner">
                <div>
                  <h3>הרשמה</h3>
                  <div className="mb-3">
                    <label>שם פרטי</label>
                    <input
                      type="text"
                      value={this.state.FirstName}
                      className="form-control"
                      placeholder="הכנס שם פרטי"
                      onChange={(event) => {
                          this.setState({FirstName: event.target.value});
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label>שם משפחה</label>
                    <input type="text"
                    value={this.state.LastName}
                    className="form-control" 
                    placeholder="הכנס שם משפחה"
                    onChange={(event) => {
                      this.setState({LastName: event.target.value});
                      }}
                      />
                  </div>
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
                  <div className="d-grid">
                  {this.state.message}
                    <button type="submit" className="btn btn-warning" onClick={this.onSignUpClick}>
                      הרשמה
                    </button>
                  </div>
                  <Modal show={this.state.isSignedUp}>
                  <Modal.Header>
                    <Modal.Title>הרשמה</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{this.state.message}</Modal.Body>
                  <Modal.Body>ברוכים הבאים {this.state.FirstName}!!</Modal.Body>
                  <Modal.Footer>
                  <button variant= "primary" className="btn btn-warning m-1" onClick={event =>  window.location.href='/sign-in'}>
                      כניסה
                    </button>
                  </Modal.Footer>
                </Modal>
                  <p className="forgot-password text-right">
                    כבר רשום?<a href="/sign-in">התחבר</a>
                  </p>
                </div>
          </div>
      </div>
    )
  }


  //Executes when the user clicks on Login
  onSignUpClick = async () => {
    console.log(this.state);

    var response = await fetch(
        `http://localhost:8080/api/signup?Username=${this.state.Username}&Password=${this.state.Password}`,
      { //mode: 'no-cors',
       method: "GET", headers: {"Content-Type": "application/json"} }
    )
    
    
    console.log(response);
    var body = await JSON.stringify(response)
    console.log( " body ",body);

    if(response.status === 200)
    {
      //success
      this.setState({
        message: <span className="text-success">נרשמת בהצלחה!</span>,
      });
      this.state.isSignedUp = true;
    }
    else if (response.status === 401)
    {
        this.setState({
            //error
            message: (
              <span className="text-danger">שם המשתמש קיים,נסה שוב</span>
            ),
          });
    }
    else if (response.status === 400)
    {
        this.setState({
            //error
            message: (
              <span className="text-danger">שם המשתמש או הסיסמה קצרים מדי,נסה שוב</span>
            ),
          });
    }
  };
}
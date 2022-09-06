import React, { Component } from "react";
import { useState } from 'react';

import Product from "./product";
import ProductClick from "./productClick";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
        <h3> </h3>
        <h3> </h3>
        <h3>כוורת אונליין</h3>
        <h5>ברוכים הבאים לכוורת און ליין, אתר הקניות המקוון של רשת חנויות הנוחות של קרן לב!</h5>
        <p >
                 היכנס לאזור האישי שלך: <a href="/sign-in">כניסה</a>
        </p>
        <p >
                עדיין אין לך חשבון? <a href="/sign-up">המשך להרשמה</a>
        </p>
        <img className="photoHomePage" src="https://www.caveret.org/media/ves/brand/LOGO.JPG" alt={"כוורת"}/>
        
        </div>
      </div>
    );
  }
}
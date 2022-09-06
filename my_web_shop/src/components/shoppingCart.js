import { toHaveAccessibleDescription } from "@testing-library/jest-dom/dist/matchers";
import React, { Component } from "react";
import { useState } from 'react';
import {Modal} from 'react-bootstrap'
import { GrUserAdmin,GrUserExpert } from "react-icons/gr";

import Product from "./product";
import ProductClick from "./productClick";

export default class ShoppingCart extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
        cartItems: this.props.cartItems,
        username : this.props.username,
    };

  }

  render() {
    //console.log("render - ShoppingCart");

    return (
      <div className="auth-inner2">
        <h5></h5>
        <h3>סל קניות</h3>
        <div className="row">
          {console.log("login:" + this.props.login)}
          {console.log("admin:" + this.props.isAdmin)}
        {this.props.login === false &&
          <p>
          <GrUserAdmin /> אתה נמצא במצב לא מקוון! <a href="/sign-in">התחבר</a>
          </p>}
          {this.props.login === true &&
          <p>
          <GrUserExpert /> מחובר למשתמש {this.props.username},<button variant= "primary" className="btn btn-warning m-1" onClick={this.props.disconnect}>התנתק</button>
          </p>} 
        {this.props.cartItems.length === 0 && <div> סל הקניות ריק!</div>}
        {console.log(this.props.cartItems)}
        {this.props.cartItems.map((prod) => {
            return (
              <ProductClick
                key={prod.id}
                product = {prod}
                onAdd = {this.props.onAdd}
                onRemove = {this.props.onRemove}
              >
              </ProductClick>
            );
          })}
         {this.props.cartItems.length !== 0 && <button onClick = {this.props.handleShow} className="btn btn-danger m-1" >מחק את כל סל הקניות</button>}
         
         <Modal show={this.props.show}>
                <Modal.Header>
                  <Modal.Title>מחיקת כל סל הקניות</Modal.Title>
                </Modal.Header>
                <Modal.Body> האם אתה בטוח שאתה רוצה למחוק את כל המוצרים בסל הקניות?</Modal.Body>
                <Modal.Footer>
                <button variant= "primary" className="btn btn-warning m-1" onClick={this.onRemoveClick}>
                  מחיקה
                  </button>
                <button variant= "primary" className="btn btn-warning m-1" onClick={this.props.handleClose}>
                  לא, התחרטתי
                  </button>
                </Modal.Footer>
          </Modal>

        </div>
      </div>
    );
  }

  onRemoveClick = async () => {
    this.props.RemoveAll();
    this.props.handleClose();
  }

}
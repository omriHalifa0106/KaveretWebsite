import React, { Component } from "react";
import { useState } from 'react';
import {Modal} from 'react-bootstrap';
import Product from "./product";
import ProductClick from "./productClick";
import { AiFillEye,AiFillLock,AiFillUnlock } from "react-icons/ai";
import { GrUserAdmin,GrUserExpert } from "react-icons/gr";

export default class Bill extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        cartItems: this.props.cartItems,
    };

    this.itemsPrice = this.props.cartItems.reduce((a, c) => a + c.quantity * c.price, 0);
    this.shippingPrice = this.itemsPrice > 500 ? 20 : 0;
    this.totalPrice = this.itemsPrice + this.shippingPrice;

  }

  render() {
    //console.log("render - ShoppingCart");

    return (
      <div className="auth-inner2">
        <h5></h5>
        <h3>חשבונית</h3>
        {this.props.login === false &&
          <p>
         <GrUserAdmin /> אתה נמצא במצב לא מקוון! <a href="/sign-in">התחבר</a>
        </p>}
        
        {this.props.login === true &&
          <p>
          <GrUserExpert /> מחובר למשתמש {this.props.username},<button variant= "primary" className="btn btn-warning m-1" onClick={this.props.disconnect}>התנתק</button>
          </p>
        }   
        <div className="row">
        {this.props.cartItems.length === 0 && <div> התחל לקנות!</div>}
        {this.props.cartItems.map((prod) => {
            return (
              <div> מוצר #{prod.id} {prod.productName}, מחיר ליחידה: {prod.price}.0, כמות: {prod.quantity} </div>
            );
          })}
        </div>

        {this.props.cartItems.length !== 0 && (
          <>
            <hr></hr>
            <div className="row">
              <div className="col-2">מחיר מוצרים</div>
              <div className="col-1 text-right">₪{this.itemsPrice.toFixed(2)}</div>
            </div>
            <div className="row">
              <div className="col-2">דמי משלוח</div>
              <div className="col-1 text-right">
               ₪{this.shippingPrice.toFixed(2)}
              </div>
            </div>

            <div className="row">
              <div className="col-2">
                <strong>לתשלום</strong>
              </div>
              <div className="col-1 text-right">
                <strong>₪{this.totalPrice.toFixed(2)}</strong>
              </div>
            </div>
            <hr />
            <div className="row">
              <button className="btn btn-warning m-1" onClick= {this.props.handleShow}>
                רכישה
              </button>
              <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header>
                  <Modal.Title>רכישה</Modal.Title>
                </Modal.Header>
                <Modal.Body> האם אתה בטוח שאתה רוצה לקנות את המוצרים בסל הקניות?</Modal.Body>
                <Modal.Footer>
                <button variant= "primary" className="btn btn-warning m-1" onClick={this.purchaseCompletedSuccessfully}>
                  קנייה
                  </button>
                <button variant= "primary" className="btn btn-warning m-1" onClick={this.props.handleClose}>
                  לא, בא לי להמשיך לקנות
                  </button>
                </Modal.Footer>
          </Modal>
            </div>
          </>
        )}
      </div>
    );
  }
  
  purchaseCompletedSuccessfully = async () => {
    this.props.handleClose();
    this.props.saveBills();
    this.props.RemoveAll();
    console.log(this.props.cartItems);
    this.itemsPrice = 0;
    this.shippingPrice = 0;
    this.totalPrice =0;
    alert('הרכישה הושלמה בהצלחה!')
  }

}
import React, { Component } from "react";
import { useState } from 'react';
import {Modal} from 'react-bootstrap';
import Product from "./product";
import ProductClick from "./productClick";
import Select from 'react-select'
import { AiFillEye,AiFillLock,AiFillUnlock } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiTakeMyMoney } from "react-icons/gi";
import { GrUserAdmin,GrUserExpert } from "react-icons/gr";

export default class Administrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bills: this.props.bills,
        logins: this.props.logins,
        sumTotal: 0,
        maxSum:0,
        maxUserSum:" ",
        SearchInput: "",
        SortAndFilterInput: "",
        min_sum:0,
        max_sum:1000000,
    }

    this.actions = [{ value: 0, label: 'סנן לפי טווח סכומים בחשבונית'},{ value: 1, label: 'מיין לפי סכום חשבונית מהנמוך לגבוה'},{ value: 2, label: 'מיין לפי סכום חשבונית מהגבוה לנמוך'},{ value: 3, label: 'מיין לפי שם משתמש בסדר עולה'},{ value: 4, label: 'מיין לפי שם משתמש בסדר יורד'},{ value: 5, label: 'ללא סינון/מיון'}]
  }

  render() {
    //console.log("render - ShoppingCart");

    return (
      <div className="auth-inner2">
        <h5></h5>
        <h3>הרשאות מנהל</h3>
        {this.props.login === true &&
          <p>
          <MdAdminPanelSettings /> מחובר למנהל {this.props.username},<button variant= "primary" className="btn btn-warning m-1" onClick={this.props.disconnect}>התנתק</button>
          </p>
        }   
        {this.props.login === false &&
          <p>
         <GrUserAdmin /> אתה נמצא במצב לא מקוון! <a href="/sign-in">התחבר</a>
        </p>}

        <p>
            <div>
            <AiFillEye /> <b>צפייה בכניסות האחרונות לאתר</b>
            </div> 
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">שם משתמש</th>
                    <th scope="col">תאריך</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.logins.map((login) => {
                    return (
                        <tr>
                        <th scope="row">{login.id}</th>
                        <td>{login.username}</td>
                        <td>{login.Date}</td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            <div>
            <AiFillEye /> <b>צפייה בחשבוניות </b>
                <input
                type="text"
                className="form-control"
                placeholder="חפש משתמש..."
                onChange={(event) => {this.setState({SearchInput: event.target.value})}}
            />
            <Select 
            value={this.state.SortAndFilterInput} onChange={(event) => {this.setState({SortAndFilterInput: event})}}
            placeholder="מיין/סנן..."
            options={this.actions}   
            />
            {this.SortingAndFiltering()}
            {this.state.SortAndFilterInput.value === 0 && 
            <div>
            <label>סנן על פי טווח סכום חשבונית מהסכום  </label> 
            <input
                type="text"
                className="form"
                placeholder="סכום נמוך"
                onChange={(event) => {this.setState({min_sum: event.target.value})}}
            />
            <label>עד הסכום </label> 
            <input
                type="text"
                className="form"
                placeholder="סכום גבוה"
                onChange={(event) => {this.setState({max_sum: event.target.value})}}
            />
            </div>
            }
            </div> 
            <table class="table">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">שם משתמש</th>
                    <th scope="col">מוצרים</th>
                    <th scope="col">סכום</th>
                    <th scope="col">תאריך</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.bills.map((bill) => {
                    return (
                        <tr>
                        <th scope="row">{bill.id}</th>
                        <td>{bill.username}</td>
                        <td>{this.showProductsNameInCartItem(bill.items)}</td>
                        <td>{bill.sum}.0</td>
                        <td>{bill.Date}</td>
                        </tr>
                    );
                    })
                    }
                </tbody>
                </table>
            <div>
            
            {this.state.bills.map((bill) => {
                this.state.sumTotal+=bill.sum
            })}
            <GiTakeMyMoney /> <b> סך הכל רווחים: {this.state.sumTotal}.0 </b>
            </div> 
            <div>
            
            {this.state.bills.map((bill) => {
                if(bill.sum>this.state.maxSum)
                {
                    this.state.maxSum= bill.sum;
                    this.state.maxUserSum = bill.username;
                }

            })}
            <GiTakeMyMoney /> <b> סכום החשבונית הגבוה ביותר הוא {this.state.maxSum}.0  של משתמש {this.state.maxUserSum}</b>
            </div> 
        </p>

      </div>
    );
  }
  
  showProductsNameInCartItem = (cartItem) => {
    var itemsNames = [];
    var data_items = JSON.parse(cartItem)
    console.log(data_items);
    data_items.forEach(item => itemsNames.push(item.productName));
    return <div>{itemsNames.join()}</div>;
  }

  SortingAndFiltering = () => {
    this.state.bills = this.props.bills;
    if(this.state.min_sum === "")
    {
      this.state.min_sum = 0;
    }
    if(this.state.max_sum ===  "")
    {
      this.state.max_sum = 100000;
    }
    this.state.bills = this.state.bills.filter ((bill) => bill.username.toLowerCase().includes(this.state.SearchInput.toLowerCase()))
     if(this.state.SortAndFilterInput.value === 0){
      this.state.bills = this.state.bills.filter ((bill) => { return bill.sum >= this.state.min_sum && bill.sum <= this.state.max_sum})
    }  else if(this.state.SortAndFilterInput.value === 1){
        this.state.bills.sort((a,b) => (a.sum > b.sum) ? 1 : ((b.sum > a.sum) ? -1 : 0))
    } else if(this.state.SortAndFilterInput.value === 2){
      this.state.bills.sort((a,b) => (a.sum < b.sum) ? 1 : ((b.sum < a.sum) ? -1 : 0))
    } else if(this.state.SortAndFilterInput.value === 3){
      this.state.bills.sort((a,b) => (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0))
    } else if(this.state.SortAndFilterInput.value === 4){
      this.state.bills.sort((a,b) => (a.username < b.username) ? 1 : ((b.username < a.username) ? -1 : 0))
    };
}

}
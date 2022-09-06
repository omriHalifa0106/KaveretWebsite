import React, { Component } from "react";
import Select from 'react-select'
import Product from "./product";
import {Modal} from 'react-bootstrap'
import { AiFillEye,AiFillLock,AiFillUnlock } from "react-icons/ai";
import { GrUserAdmin,GrUserExpert } from "react-icons/gr";
export default class ListOfProducts extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      products: this.props.products,
      SearchInput: "",
      SortAndFilterInput: "",
      categoryInput: "",
      min_price:0,
      max_price:5000,
      inputToAdd:false,
      product_name:"",
      product_price:0,
      product_category: "",
      product_imageUrl: "",
      product_stock: 0,
    };
    this.props.initProducts();
    this.actions = [{ value: 0, label: 'סנן לפי קטגוריה'},{ value: 1, label: 'סנן לפי טווח מחירים'},{ value: 2, label: 'מיין לפי מחיר מהנמוך לגבוה'},{ value: 3, label: 'מיין לפי מחיר מהגבוה לנמוך'},{ value: 4, label: 'מיין לפי שם בסדר עולה'},{ value: 5, label: 'מיין לפי שם בסדר יורד'},{ value: 6, label: 'ללא סינון/מיון'}]
  }
  render() {
    return (
      <div className="auth-inner2">
        <h5></h5>
        <h3>רשימת מוצרים</h3>
        {this.props.login === false &&
          <p>
          <GrUserAdmin />אתה נמצא במצב לא מקוון! <a href="/sign-in">התחבר</a>
          </p>}
          {this.props.login === true &&
          <p>
          <GrUserExpert /> מחובר למשתמש {this.props.username},<button variant= "primary" className="btn btn-warning m-1" onClick={this.props.disconnect}>התנתק</button>
          </p>} 

        <input
            type="text"
            className="form-control"
            placeholder="חפש מוצר..."
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
          <label>בחר קטגוריה:  </label> 
          <select onChange={(event) => {this.setState({categoryInput: event.target.value})}}>
            <option value="מחשבים וסלולר" >מחשבים וסלולר</option>
            <option value="אביזרים" >אביזרים</option>
            <option value="ציוד צבאי" >ציוד צבאי</option>
            <option value="מוצרי חשמל" >מוצרי חשמל</option>
            <option value="מוצרי טיפוח" >מוצרי טיפוח</option>
            <option value="מזון" >מזון</option>
            <option value="" selected="כל הקטגוריות" >כל הקטגוריות</option>
          </select>
        </div>
        }
        
        {this.state.SortAndFilterInput.value === 1 && 
        <div>
          <label>סנן על פי טווח מחירים מהמחיר  </label> 
          <input
            type="text"
            className="form"
            placeholder="מחיר נמוך"
            onChange={(event) => {this.setState({min_price: event.target.value})}}
        />
        <label>עד מחיר </label> 
        <input
            type="text"
            className="form"
            placeholder="מחיר גבוה"
            onChange={(event) => {this.setState({max_price: event.target.value})}}
        />
        </div>
        }
        <div className="row">
          {this.state.products.map((prod) => {
            return (
              <Product
                key={prod.id}
                product = {prod}
                onAdd = {this.props.onAdd}
                onRemove = {this.props.onRemove}
                isAdmin = {this.props.isAdmin}
                RemoveProductAdmin = {this.props.RemoveProductAdmin}
                EditProductsAdmin = {this.props.EditProductsAdmin} 
              >
              </Product>
            );
          })}
          {this.props.isAdmin === true && <button onClick =  {()=>{this.addOpenAndClose()}} className="btn btn-outline-success" >הוסף מוצר</button>}
          <Modal show={this.state.inputToAdd} onHide={this.addOpenAndClose}>
                <Modal.Header>
                  <Modal.Title>הוספת מוצר</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                      <div >
                          <label>הכנס שם מוצר:</label>
                          <input
                                type="text"
                                style={{ width: "300px" }}
                                value={this.state.product_name}
                                placeholder="הכנס שם מוצר"
                                onChange={(event) => {
                                    this.setState({product_name: event.target.value});
                                }}
                                />
                      </div>
                      <div >
                          <label>הכנס מחיר:</label>
                          <input
                                type="number"
                                value={this.state.product_price}
                                placeholder="הכנס מחיר"
                                onChange={(event) => {
                                    this.setState({product_price: event.target.value});
                                }}
                                />
                      </div>
                      <div>
                          <label>בחר קטגוריה:</label> 
                          <select onChange={(event) => {this.setState({product_category: event.target.value})}}>
                            <option value="מחשבים וסלולר" >מחשבים וסלולר</option>
                            <option value="אביזרים" >אביזרים</option>
                            <option value="ציוד צבאי" >ציוד צבאי</option>
                            <option value="מוצרי חשמל" >מוצרי חשמל</option>
                            <option value="מוצרי טיפוח" >מוצרי טיפוח</option>
                            <option value="מזון" >מזון</option>
                            <option value="" selected="כל הקטגוריות" >כל הקטגוריות</option>
                          </select>
                      </div>
                      <div>
                          <label>הכנס מלאי:</label>
                          <input
                                type="number"
                                value={this.state.product_stock}
                                placeholder="הכנס מלאי"
                                onChange={(event) => {
                                    this.setState({product_stock: event.target.value});
                                }}
                                />
                      </div>
                      <div >
                          <label>הכנס נתיב לתמונה:</label>
                          <input
                                type="text"
                                style={{ width: "300px" }}
                                value={this.state.product_imageUrl}
                                placeholder="הכנס נתיב לתמונה"
                                onChange={(event) => {
                                    this.setState({product_imageUrl: event.target.value});
                                }}
                                />
                      </div>
                </Modal.Body>
                <Modal.Footer>
                <div>
                  <button className="btn btn-success m-1" onClick={()=>this.AddProductAdmin()}>
                  הוסף
                  </button>
                <button variant= "primary" className="btn btn-warning m-1" onClick={this.addOpenAndClose}>
                  לא, התחרטתי
                  </button>
                  </div>
                </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }


  addOpenAndClose = () => {
    if(this.state.inputToAdd === false)
    {
      this.setState({inputToAdd: true})
    }
    else
    {
      this.setState({inputToAdd: false})
    }
  }


  AddProductAdmin = async() => {
    var product ={}
    product.id = this.props.products.length +1;
    product.productName = this.state.product_name;
    product.price = this.state.product_price;
    product.quantity = 0;
    product.category =this.state.product_category;
    product.productImgUrl = this.state.product_imageUrl;
    product.stock =this.state.product_stock;
    console.log(product);
    this.props.AddProductsAdmin(product);
    this.addOpenAndClose();
    this.state.product_name = "";
    this.state.product_price = 0;
    this.state.product_category ="";
    this.state.product_imageUrl = "";
    this.state.product_stock = 0;
  }


  SortingAndFiltering = () => {
    this.state.products = this.props.products;
    if(this.state.min_price === "")
    {
      this.state.min_price = 0;
    }
    if(this.state.max_price ===  "")
    {
      this.state.max_price = 5000;
    }
    this.state.products = this.state.products.filter ((prod) => prod.productName.toLowerCase().includes(this.state.SearchInput.toLowerCase()))
    if(this.state.SortAndFilterInput.value === 0){
        console.log("סנן לפי קטגוריה");
        console.log(this.state.categoryInput);
        this.state.products = this.state.products.filter ((prod) => prod.category.toLowerCase().includes(this.state.categoryInput.toLowerCase()))
    } else if(this.state.SortAndFilterInput.value === 1){
      console.log("סנן לפי טווח מחירים");
      this.state.products = this.state.products.filter ((prod) => { return prod.price >= this.state.min_price && prod.price <= this.state.max_price})
    }  else if(this.state.SortAndFilterInput.value === 2){
        console.log("מיין לפי מחיר בסדר עולה");
        this.state.products.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
    } else if(this.state.SortAndFilterInput.value === 3){
      console.log("מיין לפי מחיר בסדר יורד");
      this.state.products.sort((a,b) => (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0))
    } else if(this.state.SortAndFilterInput.value === 4){
      console.log("מיין לפי שם בסדר עולה");
      this.state.products.sort((a,b) => (a.productName > b.productName) ? 1 : ((b.productName > a.productName) ? -1 : 0))
    } else if(this.state.SortAndFilterInput.value === 5){
      this.state.products.sort((a,b) => (a.productName < b.productName) ? 1 : ((b.productName < a.productName) ? -1 : 0))
   }
  };

}
import React, { Component } from "react";
import {Modal} from 'react-bootstrap'

export default class Product extends Component {
  constructor(props) {
    super(props);

    //console.log("Constructor - Product");

    this.state = {
      product: this.props.product,
      inputToEdit: false,
      product_name:this.props.product.productName,
      product_price:this.props.product.price,
      product_category: this.props.product.category,
      product_imageUrl: this.props.product.productImgUrl,
      product_stock: this.props.product.stock,
    };
  }

  render() {
    return (
      <div className="col-lg-6">
        <div className="card m-2" >
          <img class="card-img-top" className="photo" src={this.state.product.productImgUrl} alt={this.state.product.productName}/>
          <div className="card-body">
            <div className="text-muted"># {this.state.product.id}</div>

            <h5 className="pt-5 border-top">{this.state.product.productName}</h5>

            <div>{this.state.product.price} ₪</div>
          </div>
        
          <div className="card-footer">
            <div className="float-left">
              <button onClick = {() => this.props.onAdd(this.state.product)} className="btn btn-warning m-1" >הוסף לסל</button>
              {this.props.isAdmin === true && <button onClick =  {()=>{this.props.RemoveProductAdmin(this.state.product)}} className="btn btn-danger m-1" >מחק מוצר</button>}
              {this.props.isAdmin === true && <button onClick =  {()=>{this.editOpenAndClose()}} className="btn btn-success" >ערוך מוצר</button>}
            </div>
            <div className="float-right"> {this.props.children}</div>
          </div>

          <Modal show={this.state.inputToEdit} onHide={this.editOpenAndClose}>
                <Modal.Header>
                  <Modal.Title>עריכת מוצר</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                      <div >
                        <div> <b> ערוך את השדה אותו תרצה לשנות:</b></div>
                        <h5> </h5> 
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
                  <button className="btn btn-success m-1" onClick={()=>this.editProductAdmin()}>
                  ערוך
                  </button>
                <button variant= "primary" className="btn btn-warning m-1" onClick={this.editOpenAndClose}>
                  לא, התחרטתי
                  </button>
                  </div>
                </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }

  editOpenAndClose = () => {
    if(this.state.inputToEdit === false)
    {
      this.setState({inputToEdit: true})
    }
    else
    {
      this.setState({inputToEdit: false})
    }
  }


  editProductAdmin = async() => {
    var product ={}
    product.id = this.state.product.id;
    product.productName = this.state.product_name;
    product.price = this.state.product_price;
    product.quantity = 0;
    product.category =this.state.product_category;
    product.productImgUrl = this.state.product_imageUrl;
    product.stock =this.state.product_stock;
    console.log(product);
    this.props.EditProductsAdmin(product);
    this.editOpenAndClose();
    this.state.product_name = this.props.product.productName;
    this.state.product_price = this.props.product.price;
    this.state.product_category =this.props.product.category;
    this.state.product_imageUrl = this.props.product.productImgUrl;
    this.state.product_stock = this.props.product.stock;
  }



}
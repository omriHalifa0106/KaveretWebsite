import React, { Component } from "react";

export default class ProductClick extends Component {
  constructor(props) {
    super(props);

    //console.log("Constructor - Product");

    this.state = {
      product: this.props.product,
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
              <span className="h5"> {this.props.product.quantity}  </span>
                <button 
                className="btn btn-outline-success"
                onClick={()=>{this.props.onAdd(this.state.product);}}
                >+</button>
                <button 
                className="btn btn-outline-danger"
                onClick={()=>{this.props.onRemove(this.state.product);}}
                >-</button>
            </div>
            <div className="float-right"> {this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}
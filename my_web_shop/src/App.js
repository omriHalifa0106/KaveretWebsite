import React from 'react'
import { useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/login.component'
import SignUp from './components/signup.component'
import ShoppingCart from './components/shoppingCart'
import ListOfProducts from './components/ListOfProducts'
import Bill from './components/Bill'
import HomePage from './components/HomePage'
import Administrator from './components/AdministratorPrivileges'

function App() {
    const [products,setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [bills, setBills] = useState([]);
    const [logins,setLogins] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () =>  setShow(true);


    const [login,setLogin] = useState(false);
    const handleNotLogin = () => setLogin(false);
    const handleLogin = () =>  setLogin(true);


    const [isAdmin,setIsAdmin] = useState(false);
    const handleNotAdmin = () => setIsAdmin(false);
    const handleAdmin = () =>  setIsAdmin(true);

    const [username, setUsername] = useState(" ");

    const onAdd = (product) => {
        const exist = cartItems.find((x) => x.id === product.id);
        console.log("onAdd!");
        if (exist) 
        {
          if(exist.quantity < exist.stock)
          {
            setCartItems(
              cartItems.map((x) =>
                x.id === product.id ? { ...exist, quantity: exist.quantity + 1} : x
              )
            );
          }
          else if(exist.quantity === exist.stock)
          {
            alert('אזל במלאי!')
          }
        } else {
          setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }

        console.log(cartItems);
    };
    const onRemove = (product) => {
      console.log("onRemove!");
      const exist = cartItems.find((x) => x.id === product.id);
      if (exist.quantity === 1) {
        setCartItems(cartItems.filter((x) => x.id !== product.id));
      } 
      else {
        setCartItems(
          cartItems.map((x) =>
            x.id === product.id ? { ...exist, quantity: exist.quantity - 1 } : x
          )
        );
      }
      console.log(cartItems);
    };

    const RemoveAll = () => {
      setCartItems([]);
    };


    const RemoveProductAdmin = async (product) => {
      setProducts(products.filter((x) => x.id !== product.id));
      setCartItems(cartItems.filter((x) => x.id !== product.id));

      var response = await  fetch(
        `http://localhost:8080/api/list-of-products`,
      { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id:product.id ,productName:product.productName,price:product.price,quantity:product.quantity,category:product.category,productImgUrl:product.productImgUrl,stock:product.stock,action:"remove"})
      }
    )
    console.log(response);
    var body = await JSON.stringify(response)
    console.log(body);
    }


    const EditProductsAdmin = async (product) => {
      var response = await  fetch(
        `http://localhost:8080/api/list-of-products2`,
      { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id:product.id ,productName:product.productName,price:product.price,quantity:product.quantity,category:product.category,productImgUrl:product.productImgUrl,stock:product.stock,action:"remove"})
      }
    )
    console.log(response);
    var body = await JSON.stringify(response)
    console.log(body);
    alert("העריכה בוצעה בהצלחה! רענן את הדף וצפה בשינויים")
    
    setProducts(
      products.map((x) =>
        x.id === product.id ?  { ...x, productName:product.productName,price:product.price,category:product.category,productImgUrl:product.productImgUrl,stock:product.stock } :x
      )
    ); 

    setCartItems(
      cartItems.map((x) =>
        x.id === product.id ?  { ...x, productName:product.productName,price:product.price,category:product.category,productImgUrl:product.productImgUrl,stock:product.stock } :x
      )
    ); 

    }

    const AddProductsAdmin = async (product) => {
      var response = await  fetch(
        `http://localhost:8080/api/list-of-products`,
      { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id:product.id ,productName:product.productName,price:product.price,quantity:product.quantity,category:product.category,productImgUrl:product.productImgUrl,stock:product.stock,action:"add"})
      }
    )
    console.log(response);
    var body = await JSON.stringify(response)
    console.log(body);
    setProducts([...products, { ...product }]);
    alert("המוצר נוסף בהצלחה");
    }


    const disconnect = async () => {
      var response = await  fetch(
        `http://localhost:8080/api/`,
      { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ user_name:username ,cartItems:cartItems})
     }
    )
    console.log(response);
    var body = await JSON.stringify(response)
      RemoveAll();
      handleNotLogin();
      handleNotAdmin();
      saveLogins();
    }


    const saveBills = async () => {
      var response = await  fetch(
        `http://localhost:8080/api/bill`,
      { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ user_name:username ,cartItems:cartItems,sum:cartItems.reduce((a, c) => a + c.quantity * c.price, 0)})
     }
    )
    }

    const saveLogins = async () => {
      var response = await  fetch(
        `http://localhost:8080/api/administrator`,
      { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ user_name:username })
     }
    )
    }

    const initProducts = async () => {
      var response = await  fetch(
        `http://localhost:8080/api/list-of-products`,
      { 
      method: "GET", 
      headers: {"Content-Type": "application/json"} 
     }
    )
    console.log(response);

    var body = await response.json();
    var data_products = JSON.parse(body)
    console.log( " body ", body);
    console.log(" products:" , data_products);
    setProducts(data_products);
    };

    const initShoppingCart = async (user_name) => {
      console.log(user_name);
      var response = await  fetch(
        `http://localhost:8080/api/shopping-cart`,
      { 
      method: "POST", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(user_name)
     }
    )
    console.log(response);

    var body_response = await response.json();
    var data_products = JSON.parse(body_response)
    console.log("user name:" , username)
    console.log("body: ", body_response);
    console.log("shopping cart: " , data_products);
    setCartItems(data_products);
    };


    const initBills = async () => {
      var response = await  fetch(
        `http://localhost:8080/api/bill`,
      { 
      method: "GET", 
      headers: {"Content-Type": "application/json"},
     }
    )
    console.log(response);

    var body_response = await response.json();
    var data_products = JSON.parse(body_response)
    console.log("body: ", body_response);
    console.log("bills: " , data_products);
    setBills(data_products);
    };


    const initLogins = async () => {
      var response = await  fetch(
        `http://localhost:8080/api/administrator`,
      { 
      method: "GET", 
      headers: {"Content-Type": "application/json"},
     }
    )
    console.log(response);

    var body_response = await response.json();
    var data_products = JSON.parse(body_response)
    console.log("body: ", body_response);
    console.log("logins: " , data_products);
    setLogins(data_products);
    };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/'}>
            <img className="photoIcon" src="https://www.caveret.org/media/ves/brand/LOGO.JPG" alt={"כוורת"}/>
                כוורת און-ליין  
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
              {login !== true && 
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    התחברות
                  </Link>
                </li>
              }
                {login !== true && 
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                   הרשמה
                  </Link>
                </li>
                }
                {login === true && 
                <li className="nav-item">
                  <Link className="nav-link" to={'/list-of-products'}>
                   רשימת מוצרים 
                  </Link>
                </li>
                }
                {login === true && 
                <li className="nav-item">
                  <Link className="nav-link" to={'/shopping-cart'} >
                  סל קניות
                  {cartItems.length ? (
                  <button className="badge">{cartItems.length}</button>
                  ) : (
                  ''
                  )}
                  </Link>
                </li>
                }
                {login === true && 
                <li className="nav-item">
                  <Link className="nav-link" to={'/bill'}>
                   חשבונית
                  </Link>
                </li>
                } 
                {console.log("admin: " + isAdmin)}
                {isAdmin === true && 
                <li className="nav-item">
                <Link className="nav-link" to={'/administrator'}> 
                הרשאות מנהל 
                </Link>
                </li> }
              </ul>
             
            </div>
          </div> 
        </nav>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route path="/sign-in" element={<Login login = {login} setLogin= {setLogin} handleNotLogin={handleNotLogin} handleLogin={handleLogin} show = {show} setShow= {setShow} handleClose = {handleClose} handleShow = {handleShow} username = {username} setUsername = {setUsername} initShoppingCart={initShoppingCart} isAdmin = {isAdmin} setIsAdmin = {setIsAdmin} handleNotAdmin = {handleNotAdmin} handleAdmin= {handleAdmin} initBills={initBills} initLogins={initLogins} saveLogins={saveLogins}/>} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/shopping-cart" element={<ShoppingCart onAdd = {onAdd}  onRemove = {onRemove} products = {products} cartItems= {cartItems} RemoveAll = {RemoveAll} show = {show} setShow= {setShow} handleClose = {handleClose} handleShow = {handleShow}  login = {login} setLogin= {setLogin} handleNotLogin={handleNotLogin} handleLogin={handleLogin} username = {username} setUsername = {setUsername} disconnect = {disconnect} isAdmin = {isAdmin} setIsAdmin = {setIsAdmin} handleNotAdmin = {handleNotAdmin} handleAdmin= {handleAdmin} />} />
              <Route path="/list-of-products" element={<ListOfProducts onAdd = {onAdd} onRemove = {onRemove} products = {products} show = {show} setShow= {setShow} handleClose = {handleClose} handleShow = {handleShow} initProducts = {initProducts} login = {login} setLogin= {setLogin} handleNotLogin={handleNotLogin} handleLogin={handleLogin} username = {username} setUsername = {setUsername} disconnect = {disconnect}  isAdmin = {isAdmin} setIsAdmin = {setIsAdmin} handleNotAdmin = {handleNotAdmin} handleAdmin= {handleAdmin} RemoveProductAdmin = {RemoveProductAdmin} AddProductsAdmin= {AddProductsAdmin} EditProductsAdmin={EditProductsAdmin}/>} />
              <Route path="/bill" element={<Bill onAdd = {onAdd} onRemove = {onRemove} products = {products} cartItems= {cartItems} RemoveAll = {RemoveAll} show = {show} setShow= {setShow} handleClose = {handleClose} handleShow = {handleShow} login = {login} setLogin= {setLogin} handleNotLogin={handleNotLogin} handleLogin={handleLogin} username = {username} setUsername = {setUsername} disconnect = {disconnect} isAdmin = {isAdmin} setIsAdmin = {setIsAdmin} handleNotAdmin = {handleNotAdmin} handleAdmin= {handleAdmin} saveBills= {saveBills} bills= {bills}  setBills= {setBills} />}/>
              <Route path="/administrator" element={<Administrator onAdd = {onAdd} onRemove = {onRemove} products = {products} cartItems= {cartItems} RemoveAll = {RemoveAll} show = {show} setShow= {setShow} handleClose = {handleClose} handleShow = {handleShow} login = {login} setLogin= {setLogin} handleNotLogin={handleNotLogin} handleLogin={handleLogin} username = {username} setUsername = {setUsername} disconnect = {disconnect} isAdmin = {isAdmin} setIsAdmin = {setIsAdmin} handleNotAdmin = {handleNotAdmin} handleAdmin= {handleAdmin} bills= {bills}  setBills= {setBills} logins={logins} setLogins={setLogins} />}/>
            </Routes>
          </div>
    </Router>
  )
}
export default App



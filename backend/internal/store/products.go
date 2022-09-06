package store

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var err error

type Product struct {
	ID          int    `json:"id"`
	ProductName string `json:"productName"`
	Price       int    `json:"price"`
	Quantity    int    `json:"quantity"`
	Category    string `json:"category"`
	UrlImage    string `json:"productImgUrl"`
	Stock       int    `json:"stock"`
}

func InitProducts(ctx *gin.Context) {
	if err != nil {
		panic(err)
	}
	if err = Database_shop_web.Ping(); err != nil {
		panic(err)
	}
	//fmt.Println("Now we are connected to POSTGRESQL DATABASE.")

	rows, err := Database_shop_web.Query("SELECT id,productName,price,quantity,category,urlImage,stock  from products ORDER BY id ASC;")

	if err != nil {
		log.Println(err)
		return
	}
	defer rows.Close()

	products := make([]Product, 0)
	for rows.Next() {
		prod := Product{}
		err := rows.Scan(&prod.ID, &prod.ProductName, &prod.Price, &prod.Quantity, &prod.Category, &prod.UrlImage, &prod.Stock)
		if err != nil {
			log.Println(err)
			return
		}
		products = append(products, prod)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
		return
	}
	productsBytes, _ := json.Marshal(&products)
	//fmt.Println(string(productsBytes))
	ctx.JSON(http.StatusOK, string(productsBytes))
}

func SaveShoppingCart(ctx *gin.Context) {
	if err != nil {
		panic(err)
	}
	if err = Database_shop_web.Ping(); err != nil {
		panic(err)
	}

	bodyAsByteArray, _ := ioutil.ReadAll(ctx.Request.Body)

	body := make(map[string]interface{})
	err := json.Unmarshal(bodyAsByteArray, &body)
	if err != nil {
		log.Fatal(err)
	}
	user_name := body["user_name"]
	itemsCartJson := body["cartItems"]
	itemsCartJsonBin, _ := json.Marshal(itemsCartJson)
	itemsCartString := string(itemsCartJsonBin)

	fmt.Println("the user name is:", user_name)
	fmt.Println("the cart items is:", itemsCartString)

	sqlStatement := "INSERT INTO itemscart (user_name,items) VALUES (?, ?); "
	_, err = db.Exec(sqlStatement, user_name, itemsCartString)
	if err != nil {
		panic(err)
	}
}

func InitShoppingCart(ctx *gin.Context) {
	if err != nil {
		panic(err)
	}
	if err = Database_shop_web.Ping(); err != nil {
		panic(err)
	}
	bodyAsByteArray, _ := ioutil.ReadAll(ctx.Request.Body)
	user_name := string(bodyAsByteArray)
	user_name = user_name[1 : len(user_name)-1]
	fmt.Println("user name:", user_name)
	var itemscart string
	sqlStatement := "SELECT items FROM itemscart  WHERE user_name = $1 ORDER BY id DESC LIMIT 1;"
	row := Database_shop_web.QueryRow(sqlStatement, user_name)
	row.Scan(&itemscart)
	fmt.Println("itemscart: ", itemscart)
	ctx.JSON(http.StatusOK, string(itemscart))
}

func RemoveOrAddProduct(ctx *gin.Context) {
	if err != nil {
		panic(err)
	}
	if err = Database_shop_web.Ping(); err != nil {
		panic(err)
	}

	bodyAsByteArray, _ := ioutil.ReadAll(ctx.Request.Body)

	body := make(map[string]interface{})
	err := json.Unmarshal(bodyAsByteArray, &body)
	if err != nil {
		log.Fatal(err)
	}
	action := body["action"]
	fmt.Println("the action is:", action)

	if action == "remove" {
		product_id := body["id"]
		fmt.Println("the product id  is:", product_id)
		sqlStatement := "DELETE FROM products WHERE id = ?; "
		_, err = db.Exec(sqlStatement, product_id, product_id)
		if err != nil {
			panic(err)
		}
		ctx.JSON(http.StatusOK, "remove product succsessfully!")
		return
	}

	if action == "add" {
		sqlStatement := "INSERT INTO products (id,productname,price,quantity,category,urlImage,stock) VALUES (?,?,?,?,?,?,?); "
		fmt.Println("the product id is:", body["id"])
		fmt.Println("the product name is:", body["productName"])
		fmt.Println("the product price is:", body["price"])
		fmt.Println("the product quantity is:", body["quantity"])
		fmt.Println("the product category is:", body["category"])
		fmt.Println("the product stock is:", body["stock"])
		_, err = db.Exec(sqlStatement, body["id"], body["productName"], body["price"], body["quantity"], body["category"], body["productImgUrl"], body["stock"])
		if err != nil {
			panic(err)
		}
		ctx.JSON(http.StatusOK, "add product succsessfully!")
		return
	}
	ctx.JSON(http.StatusBadRequest, "error!")
}

func EditProduct(ctx *gin.Context) {
	if err != nil {
		panic(err)
	}
	if err = Database_shop_web.Ping(); err != nil {
		panic(err)
	}

	bodyAsByteArray, _ := ioutil.ReadAll(ctx.Request.Body)

	body := make(map[string]interface{})
	err := json.Unmarshal(bodyAsByteArray, &body)
	if err != nil {
		log.Fatal(err)
	}

	sqlStatement := "Update products SET productname=?,price=?,quantity=?,category=?,urlImage=?,stock=? Where id=?; "
	fmt.Println("the product id is:", body["id"])
	fmt.Println("the product name is:", body["productName"])
	fmt.Println("the product price is:", body["price"])
	fmt.Println("the product quantity is:", body["quantity"])
	fmt.Println("the product category is:", body["category"])
	fmt.Println("the product stock is:", body["stock"])
	_, err = db.Exec(sqlStatement, body["productName"], body["price"], body["quantity"], body["category"], body["productImgUrl"], body["stock"], body["id"])
	ctx.JSON(http.StatusOK, "edit product succsessfully!")
}

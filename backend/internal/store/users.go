package store

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID             int
	Username       string `binding:"required,min=5,max=30"`
	Password       string `pg:"-" binding:"required,min=7,max=32"`
	HashedPassword []byte `json:"-"`
	Salt           []byte `json:"-"`
	CreatedAt      time.Time
	ModifiedAt     time.Time
	Admin          bool
}

type Bill struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Items    string `json:"items"`
	Sum      int    `json:"sum"`
	Date     time.Time
}

type Login struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Date     time.Time
}

func AddUser(user *User) error {
	salt, err := GenerateSalt()
	if err != nil {
		return err
	}
	toHash := append([]byte(user.Password), salt...)
	hashedPassword, err := bcrypt.GenerateFromPassword(toHash, bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Salt = salt
	user.HashedPassword = hashedPassword
	_, err = db.Model(user).Returning("*").Insert()
	if err != nil {
		return err
	}
	return err
}

func Authenticate(username, password string) (*User, error) {
	fmt.Println("user : " + username + password)
	user := new(User)
	if err := db.Model(user).Where(
		"username = ?", username).Select(); err != nil {
		return nil, err
	}
	salted := append([]byte(password), user.Salt...)
	if err := bcrypt.CompareHashAndPassword(user.HashedPassword, salted); err != nil {
		return nil, err
	}
	return user, nil
}

func GenerateSalt() ([]byte, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return nil, err
	}
	return salt, nil
}

func InitBills(ctx *gin.Context) {
	if err != nil {
		panic(err)
	}
	if err = Database_shop_web.Ping(); err != nil {
		panic(err)
	}

	rows, err := Database_shop_web.Query("SELECT id,user_name,items,sum,date  from bills ORDER BY id ASC;")

	if err != nil {
		log.Println(err)
		return
	}
	defer rows.Close()

	bills := make([]Bill, 0)
	for rows.Next() {
		bill := Bill{}
		err := rows.Scan(&bill.ID, &bill.Username, &bill.Items, &bill.Sum, &bill.Date)
		if err != nil {
			log.Println(err)
			return
		}
		bills = append(bills, bill)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
		return
	}
	billsBytes, _ := json.Marshal(&bills)
	fmt.Println(string(billsBytes))
	ctx.JSON(http.StatusOK, string(billsBytes))
}

func SaveBills(ctx *gin.Context) {
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
	sumProfit := body["sum"]
	itemsCartJsonBin, _ := json.Marshal(itemsCartJson)
	itemsCartString := string(itemsCartJsonBin)

	fmt.Println("the user name is:", user_name)
	fmt.Println("the cart items is:", itemsCartString)
	fmt.Println("the sum profit is:", sumProfit)
	sqlStatement := "INSERT INTO bills (user_name,items,sum) VALUES (?, ?,?); "
	_, err = db.Exec(sqlStatement, user_name, itemsCartString, sumProfit)
	if err != nil {
		panic(err)
	}
}

func InitLogins(ctx *gin.Context) {
	if err != nil {
		panic(err)
	}
	if err = Database_shop_web.Ping(); err != nil {
		panic(err)
	}

	rows, err := Database_shop_web.Query("SELECT id,user_name,date  from logins ORDER BY id ASC;")

	if err != nil {
		log.Println(err)
		return
	}
	defer rows.Close()

	logins := make([]Login, 0)
	for rows.Next() {
		login := Login{}
		err := rows.Scan(&login.ID, &login.Username, &login.Date)
		if err != nil {
			log.Println(err)
			return
		}
		logins = append(logins, login)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
		return
	}
	billsBytes, _ := json.Marshal(&logins)
	fmt.Println(string(billsBytes))
	ctx.JSON(http.StatusOK, string(billsBytes))
}

func SaveLogins(ctx *gin.Context) {
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

	fmt.Println("the user name is:", user_name)

	sqlStatement := "INSERT INTO logins (user_name) VALUES (?); "
	_, err = db.Exec(sqlStatement, user_name)
	if err != nil {
		panic(err)
	}
}

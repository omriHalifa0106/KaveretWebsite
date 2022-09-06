package server

import (
	"backend/internal/store"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func signUp(ctx *gin.Context) {
	user := new(store.User)
	if err := ctx.Bind(user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"min tag": err.Error()})
		return
	}
	if err := store.AddUser(user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"duplicate": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"msg": "Signed up successfully.",
		"jwt": "123456789",
	})
}

func signIn(ctx *gin.Context) {
	user := new(store.User)
	if err := ctx.Bind(user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"min tag": err.Error()})
		return
	}
	user, err := store.Authenticate(user.Username, user.Password)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"wrong": "Sign in failed."})
		return
	}
	sqlStatement := "SELECT admin FROM users WHERE username = $1;"
	row := store.Database_shop_web.QueryRow(sqlStatement, user.Username)
	var isAdmin bool
	row.Scan(&isAdmin)
	fmt.Println("isAdmin:", isAdmin)
	if isAdmin == true {
		ctx.JSON(http.StatusOK, gin.H{
			"msg":      "Signed in successfully.",
			"isAdmin":  "true",
			"userName": user.Username,
		})
	} else {
		ctx.JSON(http.StatusOK, gin.H{
			"msg":      "Signed in successfully.",
			"isAdmin":  "false",
			"userName": user.Username,
		})
	}

}

func Bills_Save(ctx *gin.Context) {
	store.SaveBills(ctx)
}

func Bills_Init(ctx *gin.Context) {
	store.InitBills(ctx)
}

func Logins_Save(ctx *gin.Context) {
	store.SaveLogins(ctx)
}

func Logins_Init(ctx *gin.Context) {
	store.InitLogins(ctx)
}

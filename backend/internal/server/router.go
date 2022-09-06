package server

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setRouter() *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()
	router.Use(cors.Default())
	// Enables automatic redirection if the current route can't be matched but a
	// handler for the path with (without) the trailing slash exists.
	router.RedirectTrailingSlash = true

	// Create API route group
	api := router.Group("/api")

	api.GET("/signup", signUp)
	api.GET("/sign-in", signIn)
	api.GET("/list-of-products", Products)
	api.POST("/shopping-cart", ShoppingCart_Init)
	api.POST("/", ShoppingCart_Save)
	api.POST("/list-of-products", RemoveOrAddProducts)
	api.POST("/list-of-products2", EditProductAdmin)
	api.GET("/bill", Bills_Init)
	api.POST("/bill", Bills_Save)
	api.GET("/administrator", Logins_Init)
	api.POST("/administrator", Logins_Save)
	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}

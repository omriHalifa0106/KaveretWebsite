package server

import (
	"backend/internal/store"

	"github.com/gin-gonic/gin"
)

func Products(ctx *gin.Context) {
	store.InitProducts(ctx)
}

func RemoveOrAddProducts(ctx *gin.Context) {
	store.RemoveOrAddProduct(ctx)
}

func ShoppingCart_Save(ctx *gin.Context) {
	store.SaveShoppingCart(ctx)
}

func ShoppingCart_Init(ctx *gin.Context) {
	store.InitShoppingCart(ctx)
}

func EditProductAdmin(ctx *gin.Context) {
	store.EditProduct(ctx)
}

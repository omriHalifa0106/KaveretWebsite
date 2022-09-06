package server

import (
	"backend/internal/database"
	"backend/internal/store"
)

func Start() {
	store.SetDBConnection(database.NewDBOptions())
	router := setRouter()

	// Start listening and serving requests
	router.Run(":8080")
}

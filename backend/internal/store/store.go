package store

import (
	"database/sql"
	"log"

	"github.com/go-pg/pg/v10"
)

// Database connector
var db *pg.DB
var Database_shop_web *sql.DB

func SetDBConnection(dbOpts *pg.Options) {
	if dbOpts == nil {
		log.Panicln("DB options can't be nil")
	} else {
		db = pg.Connect(dbOpts)
	}

	connStr := "postgresql://postgres:omri0106@localhost/database_shop_web?sslmode=disable"
	Database_shop_web, err = sql.Open("postgres", connStr)
}

func GetDBConnection() *pg.DB { return db }

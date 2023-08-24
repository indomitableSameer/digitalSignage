package dbprovider

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DBObj *gorm.DB

func getDB() (*gorm.DB, error) {
	var db, err = gorm.Open(postgres.Open("postgresql://root@localhost:26257?sslmode=disable"+"&application_name=$ dss_reg_server"), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true})
	return db, err
}

func init() {
	log.Print("init called")
	var db, err = getDB()
	if err != nil {
		log.Fatal("Failed to init db:", err)
	}
	DBObj = db
}

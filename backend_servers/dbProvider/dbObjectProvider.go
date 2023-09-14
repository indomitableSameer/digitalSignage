package dbprovider

import (
	"log"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Conn *dbConnObj

type dbConnObj struct {
	RDb   *gorm.DB
	ObjDb *minio.Client
}

func getDB() (*gorm.DB, error) {
	var db, err = gorm.Open(postgres.Open("postgresql://root@localhost:26257?sslmode=disable"+"&application_name=$ dss_reg_server"), &gorm.Config{DisableForeignKeyConstraintWhenMigrating: true})
	return db, err
}

func initMinioDB() (*minio.Client, error) {
	endpoint := "127.0.0.1:9000"
	accessKeyID := "vsNweSSuziq4AqjtoJtj"
	secretAccessKey := "fTlBJAz9UVuaFKj7hZ3fAdHrNe1BkUP3kF1k6925"
	useSSL := false

	// Initialize minio client object.
	var minioClient, err = minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})

	return minioClient, err
}

func init() {
	log.Print("init called")
	var db, err = getDB()
	if err != nil {
		log.Fatal("Failed to init db:", err)
	}

	var objStorage, objDbErr = initMinioDB()
	if objDbErr != nil {
		log.Fatal("Failed to init db:", err)
	}

	Conn = &dbConnObj{RDb: db, ObjDb: objStorage}
}

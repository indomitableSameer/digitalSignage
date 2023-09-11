package requesthandlers

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

func HandleAddContentRequest() {
	const url = "postgresql://root@localhost:26257?sslmode=disable"
	config, err := pgx.ParseConfig(url)
	if err != nil {
		log.Fatal(err)
	}
	config.RuntimeParams["application_name"] = "$ docs_simplecrud_gopgx"
	conn, err := pgx.ConnectConfig(context.Background(), config)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close(context.Background())

	tx, err := conn.Begin(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	loW := tx.LargeObjects()
	id, err := loW.Create(context.Background(), 0)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(id)

	return
}

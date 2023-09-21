package dbentities

type Country struct {
	Id       uint   `gorm:"primary_key; unique; not null"`
	Name     string `gorm:"unique; not null"`
	TimeZone string `gorm:"unique; not null"`
}

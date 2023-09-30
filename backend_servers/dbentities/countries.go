package dbentities

type Country struct {
	Id       uint64 `gorm:"primary_key;autoIncrement;unique;not null"`
	Name     string `gorm:"unique;not null"`
	TimeZone string `gorm:"unique;not null"`
	City     []City
}

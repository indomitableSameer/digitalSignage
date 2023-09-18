package dbentities

import (
	"gorm.io/gorm"
)

type Country struct {
	gorm.Model
	CountryId   uint   `gorm:"primary_key; unique; not null"`
	CountryName string `gorm:"unique; not null"`
	TimeZone    string `gorm:"unique; not null"`
	Cities      []City `gorm:"foreignKey:CityId;"`
}

type City struct {
	gorm.Model
	CityId   uint   `gorm:"primary_key; unique; not null"`
	CityName string `gorm:"unique; not null"`
}

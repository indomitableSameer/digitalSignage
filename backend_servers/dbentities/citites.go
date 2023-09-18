package dbentities

import "gorm.io/gorm"

type City1 struct {
	gorm.Model
	CityId    uint   `gorm:"primary_key; unique; not null"`
	CityName  string `gorm:"unique; not null"`
	CountryId int    `gorm:"foreignKey:country_id;references:countries(country_id);constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

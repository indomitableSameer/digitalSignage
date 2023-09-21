package dbentities

type Building struct {
	Id     uint   `gorm:"primary_key; unique; not null"`
	Name   string `gorm:"unique; not null"`
	CityId int
	City   City `gorm:"foreignKey:CityId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

package dbentities

type City struct {
	Id        uint   `gorm:"primary_key; unique; not null"`
	Name      string `gorm:"unique; not null"`
	CountryId int
	Country   Country `gorm:"foreignKey:CountryId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

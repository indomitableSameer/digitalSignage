package dbentities

type City struct {
	Id        uint64 `gorm:"primary_key;autoIncrement;unique;not null"`
	Name      string `gorm:"unique;not null"`
	CountryId uint64
	Country   Country `gorm:"foreignKey:CountryId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Building  []Building
}

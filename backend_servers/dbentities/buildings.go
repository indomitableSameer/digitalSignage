package dbentities

type Building struct {
	Id     uint64 `gorm:"primary_key;autoIncrement;unique;not null"`
	Name   string `gorm:"unique;not null"`
	CityId uint64
	City   City `gorm:"foreignKey:CityId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Area   []Area
}

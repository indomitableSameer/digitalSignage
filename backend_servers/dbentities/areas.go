package dbentities

type Area struct {
	Id         uint64 `gorm:"primary_key;autoIncrement;unique;not null"`
	Name       string `gorm:"unique;not null"`
	BuildingId uint64
	Building   Building `gorm:"foreignKey:BuildingId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

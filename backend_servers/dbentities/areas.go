package dbentities

type Area struct {
	Id         uint   `gorm:"primary_key; unique; not null"`
	Name       string `gorm:"unique; not null"`
	BuildingId int
	Building   Building `gorm:"foreignKey:BuildingId;references:Id;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

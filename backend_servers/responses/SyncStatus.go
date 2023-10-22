package response

type SyncStatus struct {
	ContentSync  bool
	ScheduleSync bool
	ConfigSync   bool
	ModeSync     bool
}

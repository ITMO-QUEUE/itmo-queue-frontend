export enum ParticipantStatus {
	WAITING = 'waiting',
	CALLED = 'called',
	IN_DEFENSE = 'in_defense',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
	REMOVED = 'removed'
}

export type StudentRecord = {
	id: string /** UUID записи участника. */
	student_id: string /** UUID студента. */
	student_name: string
	queue_id: string /** UUID очереди. */
	status: ParticipantStatus
	position: number | null
	is_reserve: boolean
	is_top3: boolean
	self_moves_count: number
	teacher_id?: string | null
	attempt_id?: string | null
	works: ParticipantWork[]
	work_id?: string | null
	artifact_url?: string | null
}

export type ParticipantWork = {
	work_id: string /** UUID работы. */
	title: string
	priority: number
	artifact_url?: string | null
}

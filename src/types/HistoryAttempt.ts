import type { ParticipantWork } from './StudentRecord'

export type AttemptStatus =
	| 'called'
	| 'in_progress'
	| 'finished'
	| 'no_show'
	| 'aborted'

export type HistoryWorkResult = {
	work_id: string
	kind: 'score' | 'accepted'
	score?: string | null
	comment?: string | null
}

export type HistoryAttempt = {
	id: string /** UUID попытки. */
	entry_id: string /** UUID записи в очереди. */
	queue_id: string
	queue_title: string
	discipline_id: string
	discipline_name: string
	student_id: string
	student_name: string
	teacher_id: string
	teacher_name: string
	status: AttemptStatus
	called_at: string
	started_at: string | null
	finished_at: string | null
	called_out_of_order: boolean
	works: ParticipantWork[]
	results: HistoryWorkResult[]
}

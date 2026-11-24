import type { QueueStatus } from '../../../components/ui/UIQueueStatus'
import type { StudentRecord } from '../../../types/StudentRecord'

export interface QueueWork {
	type: 'lab'
	number: number
	priority?: number
	enabled?: boolean
}

export interface StudentWork {
	type: 'lab'
	number: number
	isScore?: boolean
	result?: string
	score?: number
	link: string | null
}

type QueueLocation =
	| {
			auditorium: string
			onlineLink?: never
	  }
	| {
			auditorium?: never
			onlineLink: string
	  }

export type TeacherQueue = QueueLocation & {
	id: string

	subject: Subject
	teachers: string[]

	startsAt: Date
	endsAt: Date

	status: Exclude<
		QueueStatus,
		QueueStatus.REGISTRATION_OPEN | QueueStatus.REGISTRATION_CLOSED
	>
	isRegistrationOpen: boolean

	studentsMax: number | null
}

export type StudentQueue = TeacherQueue & {
	teacher: string
	queueNumber: number
	works: QueueWork[]
}

export type fullQueue = StudentQueue & {
	studentRecords: StudentRecord[]
	minutesPerStudent: number
	requireArtifact: boolean
}

export enum Subject {
	PROGRAMMING = 'Программирование',
	DATABASES = 'Базы данных',
	WEB_DEVELOPMENT = 'Веб-разработка',
	OPERATING_SYSTEMS = 'Операционные системы'
}

export type QueueChanges = Partial<
	Pick<
		fullQueue,
		| 'status'
		| 'isRegistrationOpen'
		| 'minutesPerStudent'
		| 'studentsMax'
		| 'endsAt'
		| 'requireArtifact'
		| 'works'
	>
>

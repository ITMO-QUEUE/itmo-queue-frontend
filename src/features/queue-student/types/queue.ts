import type { QueueStatus } from '../../../components/ui/UIQueueStatus'

export interface QueueWork {
	type: 'lab'
	number: number
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

export enum Subject {
	PROGRAMMING = 'Программирование',
	DATABASES = 'Базы данных',
	WEB_DEVELOPMENT = 'Веб-разработка',
	OPERATING_SYSTEMS = 'Операционные системы'
}

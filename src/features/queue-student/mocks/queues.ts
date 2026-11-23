import { QueueStatus } from '../../../components/ui/UIQueueStatus'
import { type StudentQueue, Subject } from '../types/queue'

export const mockQueues: StudentQueue[] = [
	{
		id: 'queue-001',
		subject: Subject.PROGRAMMING,

		works: [
			{ type: 'lab', number: 3 },
			{ type: 'lab', number: 4 }
		],

		teacher: 'Павел Кузнецов',
		teachers: ['Павел Кузнецов', 'Елена Иванова'],

		auditorium: '305',

		startsAt: new Date('2026-11-10T14:00:00'),
		endsAt: new Date('2026-11-10T16:00:00'),

		status: QueueStatus.ACTIVE,
		isRegistrationOpen: false,

		studentsMax: 15,
		queueNumber: 2
	},

	{
		id: 'queue-002',
		subject: Subject.DATABASES,

		works: [{ type: 'lab', number: 2 }],

		teacher: 'Елена Иванова',
		teachers: ['Елена Иванова'],

		auditorium: '401',

		startsAt: new Date('2026-11-12T12:00:00'),
		endsAt: new Date('2026-11-12T14:00:00'),

		status: QueueStatus.PREREGISTRATION,
		isRegistrationOpen: true,

		studentsMax: 10,
		queueNumber: 4
	},

	{
		id: 'queue-003',
		subject: Subject.WEB_DEVELOPMENT,

		works: [
			{ type: 'lab', number: 1 },
			{ type: 'lab', number: 2 }
		],

		teacher: 'Александр Смирнов',
		teachers: ['Александр Смирнов', 'Мария Петрова'],

		onlineLink: 'https://example.com/meeting',

		startsAt: new Date('2026-11-17T10:00:00'),
		endsAt: new Date('2026-11-17T12:00:00'),

		status: QueueStatus.PAUSED,
		isRegistrationOpen: true,

		studentsMax: 20,
		queueNumber: 7
	},

	{
		id: 'queue-004',
		subject: Subject.PROGRAMMING,

		works: [{ type: 'lab', number: 5 }],

		teacher: 'Павел Кузнецов',
		teachers: ['Павел Кузнецов'],

		auditorium: '305',

		startsAt: new Date('2026-11-20T14:00:00'),
		endsAt: new Date('2026-11-20T16:00:00'),

		status: QueueStatus.PREREGISTRATION,
		isRegistrationOpen: false,

		studentsMax: 15,
		queueNumber: 1
	},

	{
		id: 'queue-005',
		subject: Subject.OPERATING_SYSTEMS,

		works: [
			{ type: 'lab', number: 1 },
			{ type: 'lab', number: 2 },
			{ type: 'lab', number: 3 },
			{ type: 'lab', number: 4 }
		],

		teacher: 'Дмитрий Волков',
		teachers: ['Дмитрий Волков', 'Анна Соколова'],

		auditorium: '210',

		startsAt: new Date('2026-11-24T10:00:00'),
		endsAt: new Date('2026-11-24T13:00:00'),

		status: QueueStatus.COMPLETED,
		isRegistrationOpen: false,

		studentsMax: null,
		queueNumber: 12
	}
]

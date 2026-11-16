import { QueueStatus } from '../../../components/ui/UIQueueStatus'
import { type StudentQueue, Subject } from '../types/queue'

export const mockFullQueues: StudentQueue[] = [
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

		students: [
			{name: "Максим Ковзик", id: 555555, position: 1, status: UIParticipantStatusStatus.WAITING, group: 'основная группа', 
				works = [
					{ type: 'lab', number: 3 , isScore: true, link: 'ссылка'},
					{ type: 'lab', number: 4, isScore: false, link: 'ссылка'}
				]
			}
		],

		studentsMax: 15,
		queueNumber: 2
	}
]
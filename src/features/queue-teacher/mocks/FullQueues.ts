import { QueueStatus } from '../../../components/ui/UIQueueStatus'
import { UIParticipantStatusStatus } from '../../../components/ui/UIParticipantStatus'
import { type fullQueue, Subject } from '../types/queue'

export const mockFullQueues: fullQueue[] = [
	{
		id: 'queue-001',
		subject: Subject.PROGRAMMING,

		works: [
			{ type: 'lab', number: 3, priority: 1, enabled: true },
			{ type: 'lab', number: 4, priority: 2, enabled: true }
		],

		teacher: 'Павел Кузнецов',
		teachers: ['Павел Кузнецов', 'Елена Иванова'],

		auditorium: '305',

		startsAt: new Date('2026-11-10T14:00:00'),
		endsAt: new Date('2026-11-10T16:00:00'),

		status: QueueStatus.ACTIVE,
		isRegistrationOpen: false,
		minutesPerStudent: 10,
		requireArtifact: true,

		students: [
			{
				name: 'Алексей Смирнов',
				id: 111111,
				position: 1,
				status: UIParticipantStatusStatus.WAITING,
				group: 'Топ-3',
				works: [
					{ type: 'lab', number: 3, link: 'https://example.com/students/111111/labs/3' },
					{ type: 'lab', number: 4, link: 'https://example.com/students/111111/labs/4' }
				]
			},
			{
				name: 'Мария Орлова',
				id: 222222,
				position: 2,
				status: UIParticipantStatusStatus.WAITING,
				group: 'Топ-3',
				works: [
					{ type: 'lab', number: 3, link: 'https://example.com/students/222222/labs/3' },
					{ type: 'lab', number: 4, link: 'https://example.com/students/222222/labs/4' }
				]
			},
			{
				name: 'Даниил Петров',
				id: 333333,
				position: 3,
				status: UIParticipantStatusStatus.WAITING,
				group: 'Топ-3',
				works: [
					{ type: 'lab', number: 3, link: 'https://example.com/students/333333/labs/3' }
				]
			},
			{
				name: 'София Волкова',
				id: 444444,
				position: 4,
				status: UIParticipantStatusStatus.WAITING,
				group: 'Основная группа',
				works: [
					{ type: 'lab', number: 4, link: 'https://example.com/students/444444/labs/4' }
				]
			},
			{
				name: 'Максим Ковзик',
				id: 555555,
				position: 5,
				status: UIParticipantStatusStatus.WAITING,
				group: 'Основная группа',
				works: [
					{ type: 'lab', number: 3, isScore: true, link: 'https://example.com/students/555555/labs/3' },
					{ type: 'lab', number: 4, isScore: false, link: 'https://example.com/students/555555/labs/4' }
				]
			},
			{
				name: 'Иван Соколов',
				id: 666666,
				position: 6,
				status: UIParticipantStatusStatus.WAITING,
				group: 'Основная группа',
				works: [
					{ type: 'lab', number: 3, link: 'https://example.com/students/666666/labs/3' }
				]
			}
		],

		studentsMax: 15,
		queueNumber: 2
	}
]

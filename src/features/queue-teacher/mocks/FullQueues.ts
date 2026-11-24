import { QueueStatus } from '../../../components/ui/UIQueueStatus'
import {
	ParticipantStatus,
	type StudentRecord
} from '../../../types/StudentRecord'
import { type fullQueue, Subject } from '../types/queue'

const queueId = 'queue-001'
type StudentRecordParams = Pick<
	StudentRecord,
	'student_id' | 'student_name'
> &
	Partial< StudentRecord >

export function createStudentRecord(
	recordSuffix: string,
	{
		student_id,
		student_name,
		queue_id = queueId,
		id = `${ queue_id }_${ student_id }_${ recordSuffix }`,
		position = null,
		status = ParticipantStatus.WAITING,
		is_reserve = false,
		is_top3 = false,
		self_moves_count = 0,
		works = [],
		...optionalFields
	}: StudentRecordParams
): StudentRecord {
	return {
		id,
		student_id,
		student_name,
		queue_id,
		position,
		status,
		is_reserve,
		is_top3,
		self_moves_count,
		works,
		...optionalFields
	}
}

const lab3 = { title: 'ЛР № 3', priority: 1 }
const lab4 = { title: 'ЛР № 4', priority: 2 }

export const mockFullQueues: fullQueue[] = [
	{
		id: queueId,
		subject: Subject.PROGRAMMING,

		works: [
			{ type: 'lab', number: 3, priority: 1, enabled: true },
			{ type: 'lab', number: 4, priority: 2, enabled: true }
		],

		teacher: 'Павел Кузнецов',
		teachers: [ 'Павел Кузнецов', 'Елена Иванова' ],

		auditorium: '305',

		startsAt: new Date( '2026-11-10T14:00:00' ),
		endsAt: new Date( '2026-11-10T16:00:00' ),

		status: QueueStatus.ACTIVE,
		isRegistrationOpen: false,
		minutesPerStudent: 10,
		requireArtifact: true,

		studentRecords: [
			createStudentRecord( '0021', {
				student_id: '111111',
				student_name: 'Алексей Смирнов',
				position: 1,
				is_top3: true,
				works: [
					{
						...lab3,
						work_id: '111111_0003',
						artifact_url: 'https://example.com/students/111111/labs/3'
					},
					{
						...lab4,
						work_id: '111111_0004',
						artifact_url: 'https://example.com/students/111111/labs/4'
					}
				]
			} ),
			createStudentRecord( '0022', {
				student_id: '222222',
				student_name: 'Мария Орлова',
				position: 2,
				is_top3: true,
				works: [
					{
						...lab3,
						work_id: '222222_0003',
						artifact_url: 'https://example.com/students/222222/labs/3'
					},
					{
						...lab4,
						work_id: '222222_0004',
						artifact_url: 'https://example.com/students/222222/labs/4'
					}
				]
			} ),
			createStudentRecord( '0001', {
				student_id: '333333',
				student_name: 'Даниил Петров',
				position: 3,
				is_top3: true,
				works: [
					{
						...lab3,
						work_id: '333333_0003',
						artifact_url: 'https://example.com/students/333333/labs/3'
					}
				]
			} ),
			createStudentRecord( '0010', {
				student_id: '444444',
				student_name: 'София Волкова',
				position: 4,
				works: [
					{
						...lab4,
						work_id: '444444_0004',
						artifact_url: 'https://example.com/students/444444/labs/4'
					}
				]
			} ),
			createStudentRecord( '0001', {
				student_id: '555555',
				student_name: 'Максим Ковзик',
				position: 5,
				works: [
					{
						...lab3,
						work_id: '555555_0003',
						artifact_url: 'https://example.com/students/555555/labs/3'
					},
					{
						...lab4,
						work_id: '555555_0004',
						artifact_url: 'https://example.com/students/555555/labs/4'
					}
				]
			} ),
			createStudentRecord( '0001', {
				student_id: '666666',
				student_name: 'Иван Соколов',
				position: 6,
				works: [
					{
						...lab3,
						work_id: '666666_0003',
						artifact_url: 'https://example.com/students/666666/labs/3'
					}
				]
			} ),
			createStudentRecord( '0001', {
				student_id: '777777',
				student_name: 'Анна Морозова',
				position: 7,
				is_reserve: true,
				works: [
					{
						...lab3,
						work_id: '777777_0003',
						artifact_url: 'https://example.com/students/777777/labs/3'
					}
				]
			} ),
			createStudentRecord( '0001', {
				student_id: '888888',
				student_name: 'Илья Новиков',
				position: 8,
				is_reserve: true,
				works: [
					{
						...lab4,
						work_id: '888888_0004',
						artifact_url: 'https://example.com/students/888888/labs/4'
					}
				]
			} )
		],

		studentsMax: 15,
		queueNumber: 2
	}
]

import { useState } from 'react'
import { Page } from '../../components/common/Page'
import { UIAlert, UIAlertTone } from '../../components/ui/UIAlert'
import { UISelect } from '../../components/ui/UISelect'
import { StudentQueue } from '../../features/queue-student/components/StudentQueue'
import { mockQueues } from '../../features/queue-student/mocks/queues'
import type {
	StudentQueue as StudentQueueType,
	Subject
} from '../../features/queue-student/types/queue'

const ALL_DISCIPLINES = '__all__'

export const StudentDashboardEmpty = () => (
	<Page
		title='Мои записи'
		subtitle='Все ваши текущие и предстоящие защиты'
		sidebutton='find-queue'
	>
		<div className='flex flex-col items-center justify-center gap-3 text-center w-full h-auto rounded-card bg-white border border-border-subtle p-6'>
			<p className='text-subheading'>Вы пока не записаны</p>
			<p className='text-small'>
				Найдите подходящую очередь и выберите работы для защиты.
			</p>
		</div>
	</Page>
)

function parseDisciplines(
	queues: StudentQueueType[]
): { value: string; label: string }[] {
	return [
		{ value: ALL_DISCIPLINES, label: 'Все' },
		...Array.from(new Set(queues.map(queue => queue.subject)))
			.sort()
			.map(value => ({
				value,
				label: value
			}))
	]
}

export const StudentDashboard = () => {
	const [discipline, setDiscipline] = useState<
		Subject | typeof ALL_DISCIPLINES
	>(ALL_DISCIPLINES)

	// TODO: Получить очереди из API
	const queues: StudentQueueType[] = [...mockQueues].sort(
		(a, b) => a.startsAt.getTime() - b.startsAt.getTime()
	)
	const filteredQueues: StudentQueueType[] = queues.filter(
		queue => discipline === ALL_DISCIPLINES || queue.subject === discipline
	)

	if (queues.length === 0) {
		return <StudentDashboardEmpty />
	}

	const disciplines = parseDisciplines(queues)
	const [nearestQueue, ...restQueues] = filteredQueues

	const handleOnMoveToEnd = async () => {
		// TODO: Отправить запрос на изменение места студента в очереди
		await 0
	}

	const handleOnOpenQueue = async () => {
		// TODO: Открыть модалку с очередью
		await 0
	}

	return (
		<Page
			title='Мои записи'
			subtitle='Все ваши текущие и предстоящие защиты'
			sidebutton='find-queue'
		>
			<div className='flex gap-4'>
				<UISelect
					label='Дисциплина'
					onChange={value =>
						setDiscipline(value as Subject | typeof ALL_DISCIPLINES)
					}
					options={disciplines}
					value={discipline}
				/>
			</div>

			<UIAlert
				tone={UIAlertTone.INFO}
				title='Вас вызывают на защиту'
				message='Программирование · 2 работы. Принимает Павел Кузнецов, аудитория 305.'
			/>
			<StudentQueue
				isNearest
				studentQueue={nearestQueue}
				onMoveToEnd={handleOnMoveToEnd}
				onOpenQueue={handleOnOpenQueue}
			/>
			{!!restQueues.length && (
				<div className='flex text-section'>Предстоящие записи</div>
			)}
			{!!restQueues.length &&
				restQueues.map(queue => (
					<StudentQueue
						onMoveToEnd={handleOnMoveToEnd}
						onOpenQueue={handleOnOpenQueue}
						studentQueue={queue}
						key={queue.id}
					/>
				))}
		</Page>
	)
}

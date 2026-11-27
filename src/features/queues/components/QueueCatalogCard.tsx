import { useNavigate } from 'react-router'
import {
	UIButton,
	UIButtonTone
} from '../../../components/ui/UIButton'
import type { QueueList } from '../api/getQueues'

interface QueueCatalogCardProps {
	queue: QueueList[number]
}

const stageLabels = {
	preliminary: 'Предварительная запись',
	active: 'Активная защита',
	finished: 'Завершена'
}

export const QueueCatalogCard = ({
	queue
}: QueueCatalogCardProps) => {
	const navigate = useNavigate()

	const start = new Date(queue.planned_start)
	const end = new Date(queue.planned_end)

	const date = start.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long'
	})

	const timeOptions = {
		hour: '2-digit',
		minute: '2-digit'
	} as const

	const time = `${start.toLocaleTimeString(
		'ru-RU',
		timeOptions
	)}–${end.toLocaleTimeString('ru-RU', timeOptions)}`

	return (
		<article className='flex flex-col gap-3 rounded-card border-l-4 border-action-primary bg-bg-surface p-6 text-text-primary'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<p className='text-label'>Следующая защита</p>

				<div className='flex flex-wrap gap-2'>
					<span className='rounded-control bg-bg-selected px-4 py-2 text-caption'>
						{stageLabels[queue.stage]}
					</span>

					<span className='rounded-control bg-bg-selected px-4 py-2 text-caption'>
						{queue.registration_open
							? 'Запись открыта'
							: 'Запись закрыта'}
					</span>
				</div>
			</div>

			<h2 className='text-subheading font-bold'>
				{queue.discipline_name}
			</h2>

			<p className='text-small'>{queue.title}</p>

			{queue.my_entry && (
				<p className='text-small'>Вы записаны</p>
			)}

			<p className='text-small'>
				Квота: {queue.quota ?? 'Без ограничения'}
			</p>

			<div className='flex flex-col gap-2 text-small text-text-secondary'>
				<p>
					{date} · {time} · {queue.location ?? 'Место не указано'}
				</p>

				<p>
					Преподаватели сеанса:{' '}
					{queue.teachers.map(teacher => teacher.name).join(' · ')
						|| 'Не назначены'}
				</p>
			</div>

			<div>
				<UIButton
					label='Открыть очередь'
					tone={UIButtonTone.PRIMARY}
					onClick={() => navigate(`/student/queues/${queue.id}`)}
				/>
			</div>

			<p className='text-caption text-text-secondary'>
				Каждая работа занимает отдельное место; порядок — по приоритету.
			</p>
		</article>
	)
}
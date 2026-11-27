import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { getQueueById } from '../../app/api/queues/queues.api'
import type { QueueDetail } from '../../app/api/queues/queues.api.d'
import { Page } from '../../components/common/Page'
import { QueueCallNotice } from '../../features/queue-student/components/QueueCallNotice'
import { QueueEnrollment } from '../../features/queue-student/components/QueueEnrollment'
import { QueueOutgoingSwap } from '../../features/queue-student/components/QueueOutgoingSwap'
import { QueueRealtime } from '../../features/queue-student/components/QueueRealtime'
import { QueueSwapInbox } from '../../features/queue-student/components/QueueSwapInbox'

interface QueueParticipantsProps {
	participants: QueueDetail['students']
	currentStudentId?: string
}

const QueueParticipants = ({
	participants,
	currentStudentId
}: QueueParticipantsProps) => (
	<section className='flex flex-col gap-4 rounded-card bg-bg-surface p-6'>
		<h2 className='text-section'>Участники очереди</h2>

		{participants.length === 0 && (
			<p className='text-small text-text-secondary'>
				В очереди пока нет участников.
			</p>
		)}

		{participants.map(participant => (
			<div
				key={participant.id}
				className={`flex flex-wrap items-center justify-between gap-3 rounded-control border border-border-subtle p-4 ${
					participant.student_id === currentStudentId
						? 'bg-bg-selected'
						: ''
				}`}
			>
				<div>
					<p className='text-label'>
						{participant.student_name}
						{participant.student_id === currentStudentId && ' · Вы'}
					</p>
					<p className='text-small text-text-secondary'>
						Место: {participant.position ?? 'Не назначено'}
						{participant.is_reserve && ' · Резерв'}
					</p>
				</div>

				<span className='text-small'>
					{participant.status}
				</span>
			</div>
		))}
	</section>
)

const QueueContent = ({ queue }: { queue: QueueDetail }) => (
	<Page
		title={queue.discipline_name}
		subtitle={queue.title}
		sidebutton='find-queue'
	>
		<QueueRealtime queueId={queue.id} />
		<QueueCallNotice key={queue.id} queue={queue} />
		<div className='flex flex-col gap-2 text-small text-text-secondary'>
			<p>{queue.registration_open ? 'Запись открыта' : 'Запись закрыта'}</p>
			<p>
				Начало: {new Date(queue.planned_start).toLocaleString('ru-RU')}
			</p>
			<p>Место: {queue.location ?? 'Не указано'}</p>
			<p>
				Преподаватели:{' '}
				{queue.teachers.map(teacher => teacher.name).join(' · ')
					|| 'Не назначены'}
			</p>
		</div>
		<QueueEnrollment queue={queue} />
		<QueueSwapInbox key={queue.id} queue={queue} />
		<QueueOutgoingSwap key={queue.id} queue={queue} />

		<QueueParticipants
			participants={queue.students}
			currentStudentId={queue.my_entry?.student_id}
		/>
	</Page>
)

export const StudentQueuePage = () => {
	const { queueId } = useParams()

	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ['queue', queueId],
		queryFn: () => {
			if (!queueId) {
				throw new Error('Не указан идентификатор очереди')
			}
			return getQueueById(queueId)
		},
		enabled: Boolean(queueId)
	})

	if (!queueId) {
		return <p className='p-6'>Не указана очередь.</p>
	}

	if (isPending) {
		return <p className='p-6'>Загрузка очереди…</p>
	}

	if (isError && !data) {
		return (
			<div className='flex flex-col items-start gap-3 p-6'>
				<p>Не удалось загрузить очередь.</p>
				<button
					type='button'
					onClick={() => refetch()}
					className='cursor-pointer text-action-primary'
				>
					Повторить
				</button>
			</div>
		)
	}

	return <QueueContent queue={data} />
}
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { getQueueById } from '../../app/api/queues/queues.api'
import type { QueueDetail } from '../../app/api/queues/queues.api.d'
import { Page } from '../../components/common/Page'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton'
import { QueueCallNotice } from '../../features/queue-student/components/QueueCallNotice'
import { QueueEnrollment } from '../../features/queue-student/components/QueueEnrollment'
import { QueueOutgoingSwap } from '../../features/queue-student/components/QueueOutgoingSwap'
import { QueueRealtime } from '../../features/queue-student/components/QueueRealtime'
import { QueueSwapInbox } from '../../features/queue-student/components/QueueSwapInbox'

type Participant = QueueDetail[ 'students' ][ number ]

const participantStatusLabels = {
	waiting: 'Ожидает',
	called: 'Вызван',
	in_defense: 'На защите',
	completed: 'Завершено',
	cancelled: 'Запись отменена',
	removed: 'Удалён из очереди'
}

const QueueParticipantRow = ( {
	participant,
	isCurrent
}: {
	participant: Participant
	isCurrent: boolean
} ) => (
	<li
		className={ `grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2 rounded-control border border-border-subtle px-4 py-3 sm:grid-cols-[2rem_minmax(0,1fr)_8rem_9rem] ${ isCurrent ? 'bg-bg-selected' : '' }` }
	>
		<span className='text-label tabular-nums'>
			{ participant.position ?? '—' }
		</span>
		<div className='min-w-0'>
			<p className='break-words text-label'>
				{ participant.student_name }
				{ isCurrent && ' · Вы' }
			</p>
			{ participant.works.map( work => (
				<p
					key={ work.work_id }
					className='break-words text-caption text-text-secondary'
				>
					{ work.title } · приоритет { work.priority }
				</p>
			) ) }
		</div>
		<span className='col-start-2 text-caption text-text-secondary sm:col-start-auto'>
			{ participant.is_reserve
				? 'Резерв'
				: participant.is_top3
					? 'Топ-3'
					: participant.position !== null && 'Основная группа' }
		</span>
		<span
			className={ `col-start-2 rounded-control px-3 py-2 text-center text-small sm:col-start-auto ${ participant.status === 'called' ? 'bg-status-warning-bg text-status-warning' : 'bg-bg-page text-text-secondary' }` }
		>
			{ participantStatusLabels[ participant.status ] }
		</span>
	</li>
)

const QueueParticipants = ( { queue }: { queue: QueueDetail } ) => {
	const participants = [ ...queue.students ].sort(
		( first, second ) =>
			( first.position ?? Number.MAX_SAFE_INTEGER ) -
			( second.position ?? Number.MAX_SAFE_INTEGER )
	)
	const groups = [
		{
			label: 'Основная группа',
			rows: participants.filter( row => ! row.is_reserve )
		},
		{ label: 'Резерв', rows: participants.filter( row => row.is_reserve ) }
	]

	return (
		<section className='flex flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'>
			<h2 className='text-section'>Участники очереди</h2>
			<p className='text-small text-text-secondary'>
				{ participants.length === 0
					? 'В очереди пока нет участников.'
					: 'За каждым участником закреплено одно место.' }
			</p>
			{ groups
				.filter( group => group.rows.length > 0 )
				.map( group => (
					<div
						key={ group.label }
						className='flex flex-col gap-3'
					>
						{ group.label === 'Резерв' && (
							<h3 className='border-t border-border-subtle pt-3 text-label text-text-secondary'>
								Резерв
							</h3>
						) }
						<ul
							aria-label={ group.label }
							className='flex flex-col gap-2'
						>
							{ group.rows.map( participant => (
								<QueueParticipantRow
									key={ participant.id }
									participant={ participant }
									isCurrent={
										participant.student_id === queue.my_entry?.student_id
									}
								/>
							) ) }
						</ul>
					</div>
				) ) }
		</section>
	)
}

const stageLabels = {
	preliminary: 'Предварительная запись',
	active: 'Активная защита',
	finished: 'Защита завершена'
}

const QueueContent = ( { queue }: { queue: QueueDetail } ) => {
	const start = new Date( queue.planned_start )
	const end = new Date( queue.planned_end )
	const date = start.toLocaleDateString( 'ru-RU', { dateStyle: 'long' } )
	const time = new Intl.DateTimeFormat( 'ru-RU', {
		hour: '2-digit',
		minute: '2-digit'
	} )
	const teachers = queue.teachers.map( teacher => teacher.name ).join( ' · ' )
	const registrationOpen = queue.registration_open && queue.stage !== 'finished'

	return (
		<Page
			title={ queue.discipline_name }
			subtitle={ `${ queue.title } · ${ date }` }
			sidebutton='find-queue'
		>
			<div className='flex flex-col gap-3'>
				<div className='flex flex-wrap gap-3 text-label'>
					<span
						className={
							queue.stage === 'active'
								? 'text-status-success'
								: 'text-action-primary'
						}
					>
						<span aria-hidden='true'>● </span>
						{ stageLabels[ queue.stage ] }
					</span>
					<span
						className={
							registrationOpen ? 'text-status-success' : 'text-text-secondary'
						}
					>
						<span aria-hidden='true'>● </span>
						{ registrationOpen ? 'Запись открыта' : 'Запись закрыта' }
					</span>
				</div>
				<p className='text-small text-text-secondary'>
					{ teachers || 'Преподаватели не назначены' }
					{ ' / ' }
					{ time.format( start ) }–{ time.format( end ) }
					{ ' / ' }
					{ queue.location ?? 'Место не указано' }
				</p>
			</div>

			<QueueRealtime queueId={ queue.id } />
			<QueueCallNotice
				key={ queue.id }
				queue={ queue }
			/>
			<QueueEnrollment queue={ queue } />
			<QueueSwapInbox
				key={ queue.id }
				queue={ queue }
			/>
			<QueueOutgoingSwap
				key={ queue.id }
				queue={ queue }
			/>

			<QueueParticipants queue={ queue } />
		</Page>
	)
}

export const StudentQueuePage = () => {
	const { queueId } = useParams()

	const { data, isPending, isError, refetch } = useQuery( {
		queryKey: [ 'queue', queueId ],
		queryFn: () => {
			if ( ! queueId ) {
				throw new Error( 'Не указан идентификатор очереди' )
			}
			return getQueueById( queueId )
		},
		enabled: Boolean( queueId )
	} )

	if ( ! queueId ) {
		return <p className='p-6'>Не указана очередь.</p>
	}

	if ( isPending ) {
		return <p className='p-6'>Загрузка очереди…</p>
	}

	if ( isError && ! data ) {
		return (
			<div className='flex flex-col items-start gap-3 p-6'>
				<p>Не удалось загрузить очередь.</p>
				<UIButton
					label='Повторить'
					tone={ UIButtonTone.GHOST }
					onClick={ () => {
						void refetch()
					} }
					compact
				/>
			</div>
		)
	}

	return <QueueContent queue={ data } />
}

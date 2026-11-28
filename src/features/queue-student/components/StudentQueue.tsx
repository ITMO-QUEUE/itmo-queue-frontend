import { useNavigate } from 'react-router'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { CancelQueueEntry } from './CancelQueueEntry'
import { MoveQueueEntry } from './MoveQueueEntry'

const dateFormat = new Intl.DateTimeFormat( 'ru-RU', {
	day: 'numeric',
	month: 'long'
} )
const timeFormat = new Intl.DateTimeFormat( 'ru-RU', {
	hour: '2-digit',
	minute: '2-digit'
} )
const stages = {
	preliminary: 'Предварительная запись',
	active: 'Активная защита',
	finished: 'Защита завершена'
}

export const isDefenseNow = ( queue: QueueDetail ) =>
	queue.my_entry?.status === 'called' || queue.my_entry?.status === 'in_defense'

export const StudentQueue = ( { queue }: { queue: QueueDetail } ) => {
	const navigate = useNavigate()
	const entry = queue.my_entry

	if ( ! entry ) return null

	const isNow = isDefenseNow( queue )
	const isCalled = entry.status === 'called'
	const teacher = queue.teachers.find(
		person => person.id === entry.teacher_id
	)
	const teachers = queue.teachers.map( person => person.name ).join( ' · ' )
	const start = new Date( queue.planned_start )
	const end = new Date( queue.planned_end )
	const total = queue.students.filter(
		person => person.position !== null
	).length
	const metaTone = isNow ? 'text-text-inverse/85' : 'text-text-secondary'

	return (
		<article
			className={ `flex flex-col gap-3 rounded-card border-l-4 border-action-primary p-6 ${ isNow ? 'bg-action-primary text-text-inverse' : 'bg-bg-surface text-text-primary' }` }
		>
			<div className='flex flex-wrap items-center justify-between gap-2 text-label'>
				<span>
					{ isNow
						? isCalled
							? 'Вас вызвали на защиту'
							: 'Защита идёт сейчас'
						: 'Следующая защита' }
				</span>
				<div className='flex flex-wrap gap-2'>
					<span
						className={
							isNow
								? undefined
								: queue.stage === 'active'
									? 'text-status-success'
									: 'text-action-primary'
						}
					>
						<span aria-hidden='true'>● </span>
						{ stages[ queue.stage ] }
					</span>
					<span
						className={
							isNow
								? undefined
								: queue.registration_open
									? 'text-status-success'
									: 'text-text-secondary'
						}
					>
						<span aria-hidden='true'>● </span>
						{ queue.registration_open ? 'Запись открыта' : 'Запись закрыта' }
					</span>
				</div>
			</div>
			<h3 className='text-section'>{ queue.discipline_name }</h3>
			{ entry.works.map( work => (
				<p
					className='text-label'
					key={ work.work_id }
				>
					{ work.title } · приоритет { work.priority }
				</p>
			) ) }
			{ isNow && teacher && (
				<p className={ `text-small ${ metaTone }` }>
					Принимает вашу работу: { teacher.name }
				</p>
			) }
			{ ! isNow && entry.position !== null && (
				<p className='text-body'>
					{ entry.is_reserve ? 'Резерв · место ' : 'Место ' }
					{ entry.position }
					{ total >= entry.position && ` из ${ total }` }
					{ ! entry.is_reserve && ' · основная группа' }
				</p>
			) }
			<div className={ `flex flex-col gap-1 text-small ${ metaTone }` }>
				<p>
					<span className='text-subheading'>
						{ dateFormat.format( start ) } · { timeFormat.format( start ) }–
						{ timeFormat.format( end ) }
					</span>
					{ queue.location && ` · ${ queue.location }` }
				</p>
				{ teachers && <p>Преподаватели сеанса: { teachers }</p> }
				{ queue.avg_duration_min !== null && (
					<p>Примерное время защиты — { queue.avg_duration_min } мин</p>
				) }
				{ queue.estimated_wait_minutes !== null && (
					<p>Примерное время ожидания — { queue.estimated_wait_minutes } мин</p>
				) }
			</div>

			<div className='flex flex-wrap items-start gap-2'>
				<div
					className={ `w-full sm:w-56 ${ isNow ? '[&_button]:border-transparent' : '' }` }
				>
					<UIButton
						label='Открыть очередь'
						tone={ isNow ? UIButtonTone.SECONDARY : UIButtonTone.PRIMARY }
						onClick={ () => navigate( `/student/queues/${ queue.id }` ) }
						fullWidth
					/>
				</div>
				<div className='w-full sm:w-56 [&_button]:w-full [&_button:disabled]:border-transparent'>
					<MoveQueueEntry queue={ queue } />
				</div>
				<div className='w-full sm:w-48 [&_button]:w-full'>
					<CancelQueueEntry
						queue={ queue }
						compact
					/>
				</div>
			</div>
			{ isNow && (
				<p className={ `text-caption ${ metaTone }` }>
					После вызова отмена записи и перенос в конец недоступны.
				</p>
			) }
			{ ! isNow && entry.is_top3 && (
				<p className='text-caption text-text-secondary'>
					В топ-3 отмена записи и перенос в конец недоступны.
				</p>
			) }
		</article>
	)
}

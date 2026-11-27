import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import {
	QueueStatus,
	UIQueueStatus
} from '../../../components/ui/UIQueueStatus'
import type { TeacherQueue as TeacherQueueType } from '../../queue-student/types/queue'

export interface TeacherQueueProps {
	teacherQueue: TeacherQueueType & { workTitles: ( string | undefined )[] }
	isNearest?: boolean
	onOpenQueue: () => void
}

const STAGE_LABELS = {
	[ QueueStatus.PREREGISTRATION ]: 'Предварительная запись',
	[ QueueStatus.ACTIVE ]: 'Активная защита',
	[ QueueStatus.PAUSED ]: 'Защита приостановлена',
	[ QueueStatus.COMPLETED ]: 'Завершён'
}
const dateFormatter = new Intl.DateTimeFormat( 'ru-RU', {
	day: 'numeric',
	month: 'long',
	year: 'numeric'
} )
const timeFormatter = new Intl.DateTimeFormat( 'ru-RU', {
	hour: '2-digit',
	minute: '2-digit'
} )

const formatWorkTitles = ( titles: ( string | undefined )[] ) => {
	if ( ! titles.length ) return ''
	if ( titles.every( title => ! title ) )
		return `Работ в очереди: ${ titles.length }`

	const numbers = titles.map(
		title => title?.match( /^(?:ЛР|Лабораторная работа)\s*№\s*(\d+)$/i )?.[ 1 ]
	)
	if ( numbers.every( number => number !== undefined ) ) {
		return `ЛР ${ numbers.map( number => `№ ${ number }` ).join( ', ' ) }`
	}
	return titles.map( title => title || 'Название недоступно' ).join( ', ' )
}

export const TeacherQueue = ( {
	teacherQueue: queue,
	isNearest = false,
	onOpenQueue
}: TeacherQueueProps ) => {
	const isCompleted = queue.status === QueueStatus.COMPLETED
	const workLabel = formatWorkTitles( queue.workTitles )

	return (
		<section
			className='flex flex-col gap-4'
			aria-label={ queue.subject }
		>
			<div
				className={ `flex flex-col gap-4 rounded-card border-l-4 border-action-primary p-6 ${ isNearest ? 'bg-action-primary text-text-inverse' : 'bg-bg-surface text-text-primary' }` }
			>
				<p className='text-label font-bold'>
					{ isCompleted
						? 'Завершённая защита'
						: isNearest
							? 'Ближайшая защита'
							: 'Следующая защита' }
				</p>
				<h2 className='text-subheading font-bold'>{ queue.subject }</h2>
				{ workLabel && <p className='text-label font-bold'>{ workLabel }</p> }
				<p className='text-body'>
					{ queue.status === QueueStatus.PREREGISTRATION
						? 'Защита ещё не началась'
						: STAGE_LABELS[ queue.status ] }
				</p>
				<div className='text-small'>
					<p>
						{ dateFormatter.format( queue.startsAt ) } ·{ ' ' }
						{ timeFormatter.format( queue.startsAt ) }–
						{ timeFormatter.format( queue.endsAt ) } ·{ ' ' }
						{ queue.auditorium ? `ауд. ${ queue.auditorium }` : 'онлайн' }
					</p>
					<p>Преподаватели сеанса: { queue.teachers.join( ' · ' ) }</p>
				</div>
				<div>
					<UIButton
						label={ isCompleted ? 'Открыть сеанс' : 'Управлять сеансом' }
						tone={ isNearest ? UIButtonTone.SECONDARY : UIButtonTone.PRIMARY }
						onClick={ onOpenQueue }
					/>
				</div>
				<p className='text-caption'>
					Один набор работ занимает одно место в очереди.
				</p>
			</div>
			<div className='flex flex-wrap gap-2 px-4'>
				<UIQueueStatus
					label={ STAGE_LABELS[ queue.status ] }
					status={ queue.status }
				/>
				<UIQueueStatus
					label={
						queue.isRegistrationOpen ? 'Запись открыта' : 'Запись закрыта'
					}
					status={
						queue.isRegistrationOpen
							? QueueStatus.REGISTRATION_OPEN
							: QueueStatus.REGISTRATION_CLOSED
					}
				/>
			</div>
		</section>
	)
}

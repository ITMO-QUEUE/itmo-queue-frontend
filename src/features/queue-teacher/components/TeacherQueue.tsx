import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import {
	QueueStatus,
	UIQueueStatus
} from '../../../components/ui/UIQueueStatus'
import type { TeacherQueue as TeacherQueueType } from '../../queue-student/types/queue'

export interface TeacherQueueProps {
	teacherQueue: TeacherQueueType & { workTitles: string[] }
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

export const TeacherQueue = ( {
	teacherQueue: queue,
	isNearest = false,
	onOpenQueue
}: TeacherQueueProps ) => {
	const isCompleted = queue.status === QueueStatus.COMPLETED

	return (
		<section
			className='flex flex-col gap-4'
			aria-label={ queue.subject }
		>
			<div
				className={ `flex flex-col items-start justify-between gap-4 rounded-card border-l-4 border-action-primary p-6 lg:flex-row ${ isNearest ? 'bg-action-primary text-text-inverse' : 'bg-bg-surface text-text-primary' }` }
			>
				<div className='flex min-w-0 flex-1 flex-col gap-3'>
					<p className='flex min-h-9 items-center text-label font-bold'>
						{ isCompleted
							? 'Завершённая защита'
							: isNearest
								? 'Ближайшая защита'
								: 'Следующая защита' }
					</p>
					<h2 className='text-subheading font-bold break-words'>
						{ queue.subject }
					</h2>
					{ queue.workTitles.length > 0 && <p className='text-label font-bold'>{ queue.workTitles.join( ', ' ) }</p> }
					<p className='text-body'>
						{ queue.status === QueueStatus.PREREGISTRATION
							? 'Защита ещё не началась'
							: STAGE_LABELS[ queue.status ] }
					</p>
					<div className={ `flex flex-col gap-1 text-small ${ isNearest ? 'text-text-inverse' : 'text-text-secondary' }` }>
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
				<div className='order-first flex shrink-0 flex-wrap items-start gap-2 lg:order-last [&>span]:h-9 [&>span]:w-52 [&>span]:max-w-full [&>span]:rounded-control'>
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
			</div>			
		</section>
	)
}

import { useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { Page } from '../../components/common/Page.tsx'
import { QueueStatus } from '../../components/ui/UIQueueStatus'
import { UITab } from '../../components/ui/UITab'
import { UISelect, type UISelectOption } from '../../components/ui/UISelect'
import { TeacherQueue } from '../../features/queue-teacher/components/TeacherQueue'
import { mockQueues } from '../../features/queue-student/mocks/queues'

const TABS = [
	{
		id: 'current',
		label: 'Текущие',
		subtitle: 'Все сеансы, в которых вы назначены преподавателем'
	},
	{
		id: 'archive',
		label: 'Завершённые',
		subtitle: 'Завершённые доступные вам сеансы'
	}
]

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
const dateKey = ( date: Date ) =>
	`${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }`
const resetOption = { value: '', label: 'Сбросить фильтр' }
const SUBJECTS: UISelectOption[] = [
	...Array.from(
		new Set( mockQueues.map( queue => queue.subject ) ),
		subject => ( { value: subject, label: subject } )
	),
	resetOption
]
const DATES: UISelectOption[] = [
	...Array.from(
		new Map(
			[ ...mockQueues ]
				.sort( ( a, b ) => a.startsAt.getTime() - b.startsAt.getTime() )
				.map( queue => [
					dateKey( queue.startsAt ),
					{
						value: dateKey( queue.startsAt ),
						label: dateFormatter.format( queue.startsAt )
					}
				] )
		).values()
	),
	resetOption
]
const STAGES: UISelectOption[] = [
	...Object.entries( STAGE_LABELS ).map( ( [ value, label ] ) => ( {
		value,
		label
	} ) ),
	resetOption
]

export const TeacherQueuesPage = () => {
	const navigate = useNavigate()
	const { queueId } = useParams()
	const [ activeTab, setActiveTab ] = useState( 'current' )
	const [ subject, setSubject ] = useState( '' )
	const [ stage, setStage ] = useState( '' )
	const [ date, setDate ] = useState( '' )
	const queues = [ ...mockQueues ]
		.filter(
			queue =>
				( queue.status === QueueStatus.COMPLETED ) ===
				( activeTab === 'archive' )
		)
		.sort( ( a, b ) => a.startsAt.getTime() - b.startsAt.getTime() )
	const visibleQueues =
		activeTab === 'archive'
			? queues
			: queues.filter(
					queue =>
						( ! subject || queue.subject === subject ) &&
						( ! date || dateKey( queue.startsAt ) === date ) &&
						( ! stage || queue.status === stage )
				)
	const nearestId = visibleQueues[ 0 ]?.id
	const searchParams = [
		{
			id: 'discipline',
			label: 'Дисциплина',
			options: SUBJECTS,
			value: subject,
			onChange: setSubject
		},
		{
			id: 'date',
			label: 'Дата',
			options: DATES,
			value: date,
			onChange: setDate
		},
		{
			id: 'stage',
			label: 'Этап сеанса',
			options: STAGES,
			value: stage,
			onChange: setStage
		}
	]

	if ( queueId ) return <Outlet />

	return (
		<Page
			title='Мои очереди'
			subtitle={ TABS.find( tab => tab.id === activeTab )?.subtitle }
			sidebutton='create-queue'
		>
			<div className='flex flex-wrap gap-2'>
				{ TABS.map( tab => (
					<UITab
						key={ tab.id }
						label={ tab.label }
						active={ activeTab === tab.id }
						onClick={ () => {
							setActiveTab( tab.id )
							setStage( '' )
						} }
					/>
				) ) }
			</div>

			{ activeTab === 'current' && (
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{ searchParams.map( param => (
						<UISelect
							key={ param.id }
							label={ param.label }
							value={ param.value }
							options={ param.options }
							placeholder='Все'
							onChange={ param.onChange }
							fullWidth
						/>
					) ) }
				</div>
			) }

			<div
				className='flex flex-col gap-7 font-nunito'
				aria-live='polite'
			>
				{ visibleQueues.map( queue => (
					<TeacherQueue
						key={ queue.id }
						teacherQueue={ queue }
						isNearest={ activeTab === 'current' && queue.id === nearestId }
						onOpenQueue={ () => navigate( `/teacher/queues/${ queue.id }` ) }
					/>
				) ) }
				{ visibleQueues.length === 0 && (
					<p className='rounded-card bg-bg-surface p-6 text-text-secondary'>
						Сеансов по выбранным фильтрам не найдено.
					</p>
				) }
			</div>
		</Page>
	)
}

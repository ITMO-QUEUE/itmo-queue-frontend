import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router'
import { getAllWorks, getMyQueues } from '../../app/api/queues/queues.api'
import type { QueueDetail } from '../../app/api/queues/queues.api.d'
import { Page } from '../../components/common/Page.tsx'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton'
import { QueueStatus } from '../../components/ui/UIQueueStatus'
import { UISelect, type UISelectOption } from '../../components/ui/UISelect'
import { UITab } from '../../components/ui/UITab'
import {
	TeacherQueue,
	type TeacherQueueProps
} from '../../features/queue-teacher/components/TeacherQueue'

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
const STAGES: UISelectOption[] = [
	...Object.entries( STAGE_LABELS ).map( ( [ value, label ] ) => ( {
		value,
		label
	} ) ),
	resetOption
]

const PAGE_SIZE = 50
const queueStatuses = {
	preliminary: QueueStatus.PREREGISTRATION,
	active: QueueStatus.ACTIVE,
	finished: QueueStatus.COMPLETED
} satisfies Record<
	QueueDetail[ 'stage' ],
	TeacherQueueProps[ 'teacherQueue' ][ 'status' ]
>

const toTeacherQueue = (
	detail: QueueDetail,
	workTitles: ReadonlyMap< string, string >
): TeacherQueueProps[ 'teacherQueue' ] => ( {
	id: detail.id,
	// Карточка пока использует enum дисциплин, API возвращает произвольное название.
	subject: detail.discipline_name as TeacherQueueProps[ 'teacherQueue' ][
		'subject'
	],
	teachers: detail.teachers.map( teacher => teacher.name ),
	startsAt: new Date( detail.planned_start ),
	endsAt: new Date( detail.planned_end ),
	status: queueStatuses[ detail.stage ],
	isRegistrationOpen: detail.registration_open,
	studentsMax: detail.quota,
	auditorium: detail.location ?? '',
	workTitles: [ ...detail.works ]
		.sort( ( a, b ) => a.priority - b.priority )
		.map(
			work => workTitles.get( work.work_id ) ?? 'Название работы недоступно'
		)
} )

export const TeacherQueuesPage = () => {
	const navigate = useNavigate()
	const { queueId } = useParams()
	const [ activeTab, setActiveTab ] = useState( 'current' )
	const [ subject, setSubject ] = useState( '' )
	const [ stage, setStage ] = useState( '' )
	const [ date, setDate ] = useState( '' )

	const {
		data,
		isPending,
		isFetching,
		isError,
		isFetchNextPageError,
		hasNextPage,
		fetchNextPage,
		refetch
	} = useInfiniteQuery( {
		queryKey: [ 'teacher', 'my-queues' ],
		queryFn: ( { pageParam } ) =>
			getMyQueues( { limit: PAGE_SIZE, offset: pageParam } ),
		initialPageParam: 0,
		getNextPageParam: ( lastPage, _pages, lastOffset ) =>
			lastPage.length === PAGE_SIZE ? lastOffset + lastPage.length : undefined,
		enabled: ! queueId
	} )

	const { data: works } = useQuery( {
		queryKey: [ 'teacher', 'works' ],
		queryFn: getAllWorks,
		enabled:
			! queueId &&
			!! data?.pages.some( page =>
				page.some( queue => queue.works.length > 0 )
			)
	} )
	const workTitles = new Map(
		works?.map( work => [ work.id, work.title ] as const )
	)

	// Фильтры локальные: догружаем все страницы, показывая полученные сразу.
	useEffect( () => {
		if ( ! queueId && hasNextPage && ! isFetching && ! isError ) {
			void fetchNextPage()
		}
	}, [ queueId, hasNextPage, isFetching, isError, fetchNextPage ] )

	const loadedQueues = Array.from(
		new Map(
			( data?.pages.flat() ?? [] ).map( queue => [ queue.id, queue ] )
		).values(),
		detail => toTeacherQueue( detail, workTitles )
	)
	const subjects: UISelectOption[] = [
		...Array.from(
			new Set( loadedQueues.map( queue => queue.subject ) ),
			discipline => ( { value: discipline, label: discipline } )
		),
		resetOption
	]
	const dates: UISelectOption[] = [
		...Array.from(
			new Map(
				[ ...loadedQueues ]
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

	const queues = [ ...loadedQueues ]
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
			options: subjects,
			value: subject,
			onChange: setSubject
		},
		{
			id: 'date',
			label: 'Дата',
			options: dates,
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
				{ ( isPending || isFetching || ( hasNextPage && ! isError ) ) && (
					<p
						role='status'
						className='text-text-secondary'
					>
						Загрузка очередей…
					</p>
				) }
				{ isError && (
					<div
						role='alert'
						className='rounded-card bg-bg-surface p-6'
					>
						<p className='mb-3 text-text-secondary'>
							{ data
								? 'Не удалось обновить или загрузить остальные очереди.'
								: 'Не удалось загрузить очереди.' }
						</p>
						<UIButton
							label='Повторить'
							tone={ UIButtonTone.SECONDARY }
							loading={ isFetching }
							onClick={ () => {
								void ( isFetchNextPageError ? fetchNextPage() : refetch() )
							} }
						/>
					</div>
				) }

				{ visibleQueues.map( queue => (
					<TeacherQueue
						key={ queue.id }
						teacherQueue={ queue }
						isNearest={ activeTab === 'current' && queue.id === nearestId }
						onOpenQueue={ () => navigate( `/teacher/queues/${ queue.id }` ) }
					/>
				) ) }
				{ ! isPending &&
					! isFetching &&
					! isError &&
					! hasNextPage &&
					visibleQueues.length === 0 && (
						<p className='rounded-card bg-bg-surface p-6 text-text-secondary'>
							Сеансов по выбранным фильтрам не найдено.
						</p>
					) }
			</div>
		</Page>
	)
}

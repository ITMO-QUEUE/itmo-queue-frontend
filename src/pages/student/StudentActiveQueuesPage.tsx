import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAllWorks, getMyQueues } from '../../app/api/queues/queues.api'
import type { QueueDetail } from '../../app/api/queues/queues.api.d'
import { Page } from '../../components/common/Page'
import { UISelect } from '../../components/ui/UISelect'
import {
	isDefenseNow,
	StudentQueue
} from '../../features/queue-student/components/StudentQueue'
import { myQueuesQueryKey } from '../../features/queue-student/myQueuesQuery'
import { useAuthStore } from '../../stores/useAuthStore'

const ALL = '__all__'

const loadMyQueues = async ( offset = 0 ): Promise< QueueDetail[] > => {
	const limit = 100
	const page = await getMyQueues( { limit, offset } )

	if ( page.length < limit ) {
		return page
	}

	const rest = await loadMyQueues( offset + page.length )
	return [ ...page, ...rest ]
}

const getWorkNumbers = (
	queues: QueueDetail[],
	workNumbers: Map< string, number >
) => {
	const numbers = new Set< number >()
	for ( const queue of queues ) {
		for ( const work of queue.my_entry?.works ?? [] ) {
			const number = workNumbers.get( work.work_id )
			if ( number !== undefined ) numbers.add( number )
		}
	}
	return numbers
}

const UpcomingQueues = ( { queues }: { queues: QueueDetail[] } ) => {
	const [ discipline, setDiscipline ] = useState( ALL )
	const [ workNumber, setWorkNumber ] = useState( ALL )
	const worksQuery = useQuery( { queryKey: [ 'works' ], queryFn: getAllWorks } )
	const workNumbers = new Map(
		worksQuery.data?.map( work => [ work.id, work.position_no ] )
	)
	const disciplineOptions = Array.from(
		new Map(
			queues.map( queue => [ queue.discipline_id, queue.discipline_name ] )
		),
		( [ value, label ] ) => ( { value, label } )
	).sort( ( first, second ) => first.label.localeCompare( second.label, 'ru' ) )
	const currentDiscipline = disciplineOptions.some(
		option => option.value === discipline
	)
		? discipline
		: ALL
	const disciplineQueues = queues.filter(
		queue =>
			currentDiscipline === ALL || queue.discipline_id === currentDiscipline
	)
	const numbers = getWorkNumbers( disciplineQueues, workNumbers )
	const currentWork = [ ...numbers ].some(
		number => String( number ) === workNumber
	)
		? workNumber
		: ALL
	const visibleQueues = disciplineQueues.filter(
		queue =>
			currentWork === ALL ||
			queue.my_entry?.works.some(
				work => workNumbers.get( work.work_id ) === Number( currentWork )
			)
	)

	return (
		<section className='flex flex-col gap-4'>
			<h2 className='text-section'>Остальные записи</h2>
			<div className='grid gap-4 sm:max-w-[44rem] sm:grid-cols-2'>
				<UISelect
					fullWidth
					label='Дисциплина'
					value={ currentDiscipline }
					onChange={ value => {
						setDiscipline( value )
						setWorkNumber( ALL )
					} }
					options={ [ { value: ALL, label: 'Все' }, ...disciplineOptions ] }
				/>
				<UISelect
					fullWidth
					label='Номер работы'
					value={ currentWork }
					onChange={ setWorkNumber }
					disabled={ numbers.size === 0 }
					options={ [
						{ value: ALL, label: 'Все' },
						...[ ...numbers ]
							.sort( ( a, b ) => a - b )
							.map( number => ( {
								value: String( number ),
								label: `№ ${ number }`
							} ) )
					] }
				/>
			</div>
			{ worksQuery.isError && (
				<button
					type='button'
					className='self-start text-action-primary'
					onClick={ () => worksQuery.refetch() }
				>
					Не удалось загрузить номера работ. Повторить
				</button>
			) }
			{ visibleQueues.map( queue => (
				<StudentQueue
					key={ queue.id }
					queue={ queue }
				/>
			) ) }
		</section>
	)
}

export const StudentActiveQueuesPage = () => {
	const userId = useAuthStore( state => state.user?.id )
	const { data, isPending, isError, refetch } = useQuery( {
		queryKey: [ ...myQueuesQueryKey, userId ],
		queryFn: () => loadMyQueues(),
		enabled: Boolean( userId ),
		refetchOnMount: 'always'
	} )
	const queues = ( data ?? [] )
		.filter( queue => queue.stage !== 'finished' && queue.my_entry )
		.sort(
			( first, second ) =>
				new Date( first.planned_start ).getTime() -
				new Date( second.planned_start ).getTime()
		)
	const current = queues.filter( isDefenseNow )
	const upcoming = queues.filter( queue => ! isDefenseNow( queue ) )

	return (
		<Page
			title='Мои записи'
			subtitle='Все ваши текущие и предстоящие защиты'
			sidebutton='find-queue'
		>
			{ isPending && <p>Загрузка записей…</p> }
			{ isError && (
				<button
					type='button'
					onClick={ () => refetch() }
					className='self-start cursor-pointer text-action-primary'
				>
					Не удалось загрузить записи. Повторить
				</button>
			) }
			{ ! isError && data && queues.length === 0 && (
				<div className='flex flex-col items-center gap-3 rounded-card border border-border-subtle bg-bg-surface p-6 text-center'>
					<p className='text-subheading'>Вы пока не записаны</p>
					<p className='text-small text-text-secondary'>
						Найдите подходящую очередь и выберите работы для защиты.
					</p>
				</div>
			) }
			{ current.length > 0 && (
				<section className='flex flex-col gap-4'>
					<h2 className='text-section'>Защита идёт сейчас</h2>
					{ current.map( queue => (
						<StudentQueue
							key={ queue.id }
							queue={ queue }
						/>
					) ) }
				</section>
			) }
			{ upcoming.length > 0 && <UpcomingQueues queues={ upcoming } /> }
		</Page>
	)
}

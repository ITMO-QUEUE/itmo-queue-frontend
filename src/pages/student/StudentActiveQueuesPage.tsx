import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAllWorks, getMyQueues } from '../../app/api/queues/queues.api'
import type { QueueDetail } from '../../app/api/queues/queues.api.d'
import { Page } from '../../components/common/Page'
import { UIButton, UIButtonTone } from '../../components/ui/UIButton'
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

const RetryWorkNumbers = ( { onRetry }: { onRetry: () => unknown } ) => (
	<div>
		<UIButton
			label='Повторить загрузку номеров работ'
			tone={ UIButtonTone.GHOST }
			onClick={ () => {
				void onRetry()
			} }
			compact
		/>
	</div>
)

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
		<section className='flex flex-col gap-6'>
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
				<RetryWorkNumbers onRetry={ worksQuery.refetch } />
			) }
			{ visibleQueues.length === 0 && (
				<p
					role='status'
					className='text-small text-text-secondary'
				>
					По выбранным фильтрам записей нет.
				</p>
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

const EmptyMyQueues = () => (
	<section className='flex min-h-32 flex-col items-center justify-center gap-1 rounded-card border border-border-subtle bg-bg-surface px-6 py-8 text-center text-text-primary'>
		<h2 className='text-section'>Вы пока не записаны</h2>
		<p className='text-body'>
			Найдите подходящую очередь и выберите работы для защиты.
		</p>
	</section>
)

export const StudentActiveQueuesPage = () => {
	const userId = useAuthStore( state => state.user?.id )
	const { data, isPending, isError, refetch } = useQuery( {
		queryKey: [ ...myQueuesQueryKey, userId ],
		queryFn: () => loadMyQueues(),
		enabled: Boolean( userId ),
		refetchOnMount: 'always',
		refetchInterval: 5000
	} )
	const queues = ( data ?? [] )
		.filter(
			queue =>
				queue.stage !== 'finished' &&
				queue.my_entry &&
				[ 'waiting', 'called', 'in_defense' ].includes( queue.my_entry.status )
		)
		.sort(
			( first, second ) =>
				new Date( first.planned_start ).getTime() -
				new Date( second.planned_start ).getTime()
		)
	const current = queues.filter( isDefenseNow )
	const upcoming = queues.filter( queue => ! isDefenseNow( queue ) )

	return (
		<div className='min-h-full text-text-primary'>
			<Page
				title='Мои записи'
				subtitle='Все ваши текущие и предстоящие защиты'
				sidebutton='find-queue'
			>
				{ ! userId && (
					<p role='status'>Войдите как студент, чтобы увидеть свои записи.</p>
				) }
				{ userId && isPending && <p role='status'>Загрузка записей…</p> }
				{ isError && (
					<div role='alert'>
						<p className='text-small text-status-danger'>
							Не удалось загрузить записи.
						</p>
						<UIButton
							label='Повторить'
							tone={ UIButtonTone.SECONDARY }
							compact
							onClick={ () => {
								void refetch()
							} }
						/>
					</div>
				) }
				{ ! isError && data && queues.length === 0 && <EmptyMyQueues /> }
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
		</div>
	)
}

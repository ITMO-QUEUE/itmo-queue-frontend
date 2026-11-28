import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getMyQueues } from '../../app/api/queues/queues.api'
import type { QueueDetail } from '../../app/api/queues/queues.api.d'
import { Page } from '../../components/common/Page'
import { UISelect } from '../../components/ui/UISelect'
import { QueueCatalogCard } from '../../features/queues/components/QueueCatalogCard'

const ALL_DISCIPLINES = '__all__'

const loadMyQueues = async ( offset = 0 ): Promise< QueueDetail[] > => {
	const limit = 100
	const page = await getMyQueues( { limit, offset } )

	if ( page.length < limit ) {
		return page
	}

	const rest = await loadMyQueues( offset + page.length )
	return [ ...page, ...rest ]
}

export const StudentActiveQueuesPage = () => {
	const [ discipline, setDiscipline ] = useState( ALL_DISCIPLINES )
	const { data, isPending, isError, refetch } = useQuery( {
		queryKey: [ 'student', 'my-queues' ],
		queryFn: () => loadMyQueues(),
		refetchOnMount: 'always'
	} )
	const queues = ( data ?? [] )
		.filter( queue => queue.stage !== 'finished' && queue.my_entry )
		.sort(
			( first, second ) =>
				new Date( first.planned_start ).getTime() -
				new Date( second.planned_start ).getTime()
		)
	const disciplines = [
		{ value: ALL_DISCIPLINES, label: 'Все' },
		...Array.from(
			new Map(
				queues.map( queue => [ queue.discipline_id, queue.discipline_name ] )
			),
			( [ value, label ] ) => ( { value, label } )
		).sort( ( first, second ) =>
			first.label.localeCompare( second.label, 'ru' )
		)
	]
	const visibleQueues = queues.filter(
		queue =>
			discipline === ALL_DISCIPLINES || queue.discipline_id === discipline
	)

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
					className='self-start text-action-primary'
				>
					Не удалось загрузить записи. Повторить
				</button>
			) }
			{ data && queues.length === 0 && (
				<div className='rounded-card border border-border-subtle bg-bg-surface p-6 text-center'>
					<p className='text-subheading'>Вы пока не записаны</p>
					<p className='text-small'>
						Найдите подходящую очередь и выберите работы для защиты.
					</p>
				</div>
			) }
			{ queues.length > 0 && (
				<UISelect
					label='Дисциплина'
					value={ discipline }
					onChange={ setDiscipline }
					options={ disciplines }
				/>
			) }
			{ queues.length > 0 && visibleQueues.length === 0 && (
				<p>По этой дисциплине нет записей.</p>
			) }
			{ visibleQueues.map( ( queue, index ) => (
				<QueueCatalogCard
					key={ queue.id }
					queue={ queue }
					isNearest={ index === 0 }
				/>
			) ) }
		</Page>
	)
}

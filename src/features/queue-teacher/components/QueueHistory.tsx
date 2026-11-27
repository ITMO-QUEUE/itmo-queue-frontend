import { useInfiniteQuery } from '@tanstack/react-query'
import { getQueueHistory } from '../../../app/api/queues/queues.api'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UIStudentWorkResult } from '../../../components/ui/UIStudentWorkResult'
import type {
	AttemptStatus,
	HistoryAttempt,
	HistoryWorkResult
} from '../../../types/HistoryAttempt'

const PAGE_SIZE = 50
const statusLabels: Record< AttemptStatus, string > = {
	called: 'Вызван',
	in_progress: 'На защите',
	finished: 'Завершено',
	no_show: 'Неявка',
	aborted: 'Прервано'
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

const formatResult = ( status: AttemptStatus, result?: HistoryWorkResult ) => {
	if ( status === 'no_show' ) return statusLabels.no_show
	if ( ! result ) return statusLabels[ status ]
	if ( result.kind === 'accepted' ) return 'Принято'
	return result.score?.replace( '.', ',' ) ?? 'Оценка не указана'
}

const HistoryAttemptRow = ( { attempt }: { attempt: HistoryAttempt } ) => {
	const startedAt = new Date( attempt.started_at ?? attempt.called_at )
	const date = dateFormatter.format( startedAt )
	const startTime = timeFormatter.format( startedAt )
	const endTime = attempt.finished_at
		? timeFormatter.format( new Date( attempt.finished_at ) )
		: '…'
	const workIds = Array.from(
		new Set( [
			...attempt.works.map( work => work.work_id ),
			...attempt.results.map( result => result.work_id )
		] )
	)

	return (
		<li className='flex min-w-0 flex-col gap-2'>
			<p className='text-label text-text-primary'>{ attempt.student_name }</p>
			{ ( workIds.length ? workIds : [ null ] ).map( workId => {
				const work = attempt.works.find( item => item.work_id === workId )
				const workResult = attempt.results.find(
					item => item.work_id === workId
				)
				const workName = work?.title ?? 'Работа не указана'
				const result = formatResult( attempt.status, workResult )
				return (
					<UIStudentWorkResult
						key={ workId ?? attempt.id }
						WorkName={ workName }
						Subject={ attempt.discipline_name }
						date={ date }
						startTime={ startTime }
						endTime={ endTime }
						Session={ attempt.queue_title }
						Teacher={ attempt.teacher_name }
						result={ result }
						OnClick={ () =>
							window.alert(
								[
									`Студент: ${ attempt.student_name }`,
									`${ workName } · ${ attempt.discipline_name }`,
									`${ date } · ${ startTime }–${ endTime }`,
									`Сеанс: ${ attempt.queue_title }`,
									`Преподаватель: ${ attempt.teacher_name }`,
									`Статус: ${ statusLabels[ attempt.status ] }`,
									`Результат: ${ result }`,
									workResult?.comment && `Комментарий: ${ workResult.comment }`,
									attempt.called_out_of_order && 'Вызван вне очереди'
								]
									.filter( Boolean )
									.join( '\n' )
							)
						}
					/>
				)
			} ) }
		</li>
	)
}

export const QueueHistory = ( { queueId }: { queueId: string } ) => {
	const {
		data,
		isPending,
		isError,
		isFetching,
		isFetchNextPageError,
		hasNextPage,
		fetchNextPage,
		refetch
	} = useInfiniteQuery( {
		queryKey: [ 'queue', queueId, 'history' ],
		queryFn: ( { pageParam } ) =>
			getQueueHistory( queueId, { limit: PAGE_SIZE, offset: pageParam } ),
		initialPageParam: 0,
		getNextPageParam: ( lastPage, _pages, lastOffset ) =>
			lastPage.length === PAGE_SIZE ? lastOffset + lastPage.length : undefined
	} )
	const attempts: HistoryAttempt[] = data?.pages.flat() ?? []

	return (
		<>
			{ isPending && <p role='status'>Загрузка истории попыток…</p> }
			{ isError && (
				<div className='flex flex-col items-start gap-3'>
					<p role='alert'>
						{ isFetchNextPageError
							? 'Не удалось загрузить следующие попытки.'
							: 'Не удалось загрузить историю попыток.' }
					</p>
					<UIButton
						label='Повторить'
						tone={ UIButtonTone.SECONDARY }
						loading={ isFetching }
						onClick={ async () => {
							if ( isFetchNextPageError ) await fetchNextPage()
							else await refetch()
						} }
					/>
				</div>
			) }
			{ ! isPending && ! isError && attempts.length === 0 && (
				<p className='text-body text-text-secondary'>
					В этой очереди пока нет попыток сдачи.
				</p>
			) }
			{ attempts.length > 0 && (
				<ul
					aria-label='История попыток'
					className='grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4'
				>
					{ attempts.map( attempt => (
						<HistoryAttemptRow
							key={ attempt.id }
							attempt={ attempt }
						/>
					) ) }
				</ul>
			) }
			{ hasNextPage && ! isError && (
				<UIButton
					label='Загрузить ещё'
					tone={ UIButtonTone.SECONDARY }
					loading={ isFetching }
					onClick={ async () => {
						await fetchNextPage()
					} }
				/>
			) }
		</>
	)
}

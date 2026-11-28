import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { CancelQueueEntry } from './CancelQueueEntry'
import { EditQueueEntry } from './EditQueueEntry'
import { MoveQueueEntry } from './MoveQueueEntry'
import { ProposeQueueSwap } from './ProposeQueueSwap'

const statusLabels = {
	waiting: 'Ожидает',
	called: 'Вызван',
	in_defense: 'На защите',
	completed: 'Завершено',
	cancelled: 'Запись отменена',
	removed: 'Удалён из очереди'
}

const LAB_TITLE_PREFIX = /^Лабораторная работа №\s*/iu
const shortWorkTitle = ( title: string ) =>
	title.replace( LAB_TITLE_PREFIX, 'ЛР № ' )

const QueueEntryArtifacts = ( { queue }: { queue: QueueDetail } ) => {
	const entry = queue.my_entry
	if ( ! entry ) return null

	const singleWork = entry.works.length === 1 ? entry.works[ 0 ] : undefined

	return (
		<div className='flex flex-col gap-1'>
			<h3 className='text-label'>
				{ singleWork
					? `Артефакт · ${ shortWorkTitle( singleWork.title ) }`
					: 'Артефакты' }
			</h3>
			<EditQueueEntry
				key={ entry.id }
				queue={ queue }
			>
				<ul className='flex min-w-0 flex-col gap-1 text-small'>
					{ entry.works.map( work => (
						<li key={ work.work_id }>
							{ ! singleWork && (
								<span>{ shortWorkTitle( work.title ) }: </span>
							) }
							{ work.artifact_url ? (
								<a
									href={ work.artifact_url }
									target='_blank'
									rel='noopener noreferrer'
									className='break-all text-action-primary hover:underline focus-visible:underline'
								>
									{ work.artifact_url }
								</a>
							) : (
								<span className='text-text-secondary'>Ссылка не указана</span>
							) }
						</li>
					) ) }
				</ul>
			</EditQueueEntry>
		</div>
	)
}

export const StudentEntryCard = ( { queue }: { queue: QueueDetail } ) => {
	const entry = queue.my_entry
	if ( ! entry ) return null

	const total = queue.students.filter(
		participant => participant.position !== null
	).length
	const singleWork = entry.works.length === 1 ? entry.works[ 0 ] : undefined
	const group = entry.is_reserve
		? 'Резерв'
		: entry.is_top3
			? 'Топ-3'
			: 'Основная группа'

	return (
		<section className='flex flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6 text-text-primary'>
			<h2 className='text-section'>
				Ваша запись
				{ singleWork && ` · ${ shortWorkTitle( singleWork.title ) }` }
			</h2>

			<div className='flex flex-wrap items-center gap-4 text-label'>
				<span
					className={ `inline-flex min-h-9 w-56 max-w-full items-center justify-center rounded-control px-3 py-1 ${ entry.status === 'called' ? 'bg-status-warning-bg text-status-warning' : 'bg-bg-page text-text-secondary' }` }
				>
					{ statusLabels[ entry.status ] }
				</span>
				{ entry.position !== null && (
					<span
						className={
							entry.is_reserve || entry.is_top3
								? 'text-action-primary'
								: 'text-status-warning'
						}
					>
						<span aria-hidden='true'>● </span>
						{ group }
					</span>
				) }
			</div>

			<p className='text-heading'>
				{ entry.is_reserve && 'Резерв · ' }
				{ entry.position === null
					? 'Место пока не назначено'
					: `Место ${ entry.position }` }
				{ entry.position !== null &&
					total >= entry.position &&
					` из ${ total }` }
			</p>

			<div className='text-small text-text-secondary'>
				<p>
					Примерное время защиты —{ ' ' }
					{ queue.avg_duration_min === null
						? 'не указано'
						: `${ queue.avg_duration_min } мин` }
				</p>
				<p>
					Примерное время ожидания —{ ' ' }
					{ queue.estimated_wait_minutes === null
						? 'не рассчитано'
						: `${ queue.estimated_wait_minutes } мин` }
				</p>
			</div>

			<QueueEntryArtifacts queue={ queue } />

			<div className='flex flex-wrap items-start gap-4'>
				<CancelQueueEntry
					queue={ queue }
					compact
				/>
				<MoveQueueEntry queue={ queue } />
				<ProposeQueueSwap queue={ queue } />
			</div>
			{ entry.is_top3 &&
				entry.status === 'waiting' &&
				queue.stage !== 'finished' && (
					<p className='text-caption text-text-secondary'>
						Вы среди первых трёх ожидающих: перенос, отмена и обмен недоступны.
					</p>
				) }
			{ ( entry.status !== 'waiting' || queue.stage === 'finished' ) && (
				<p className='text-caption text-text-secondary'>
					Перенос, отмена и обмен для этой записи недоступны.
				</p>
			) }
		</section>
	)
}

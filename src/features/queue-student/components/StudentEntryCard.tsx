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

export const StudentEntryCard = ( { queue }: { queue: QueueDetail } ) => {
	const entry = queue.my_entry

	if ( ! entry ) {
		return null
	}

	const total = queue.students.filter(
		participant => participant.position !== null
	).length
	const singleWork = entry.works.length === 1 ? entry.works[ 0 ] : undefined
	const place =
		entry.position === null
			? 'Место пока не назначено'
			: `Место ${ entry.position }${ total >= entry.position ? ` из ${ total }` : '' }`

	return (
		<section className='flex flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6 text-text-primary'>
			<h2 className='text-section'>
				Ваша запись{ singleWork && ` · ${ singleWork.title }` }
			</h2>

			<div className='flex flex-wrap items-center gap-3 text-label'>
				<span
					className={
						entry.status === 'called'
							? 'rounded-control bg-status-warning-bg px-3 py-1 text-status-warning'
							: 'rounded-control bg-bg-page px-3 py-1 text-text-secondary'
					}
				>
					{ statusLabels[ entry.status ] }
				</span>
				{ entry.position !== null && (
					<span
						className={
							entry.is_reserve ? 'text-action-primary' : 'text-status-warning'
						}
					>
						<span aria-hidden='true'>● </span>
						{ entry.is_reserve ? 'Резерв' : 'Основная группа' }
					</span>
				) }
			</div>

			<p className='text-heading'>
				{ entry.is_reserve && 'Резерв · ' }
				{ place }
			</p>

			{ entry.is_top3 && (
				<p className='text-small text-text-secondary'>Вы в топ-3 очереди.</p>
			) }

			<div className='flex flex-col gap-3'>
				{ entry.works.map( work => (
					<div
						key={ work.work_id }
						className='flex flex-col gap-1'
					>
						<p className='text-small text-text-secondary'>
							{ ! singleWork && `${ work.title } · ` }Приоритет:{ ' ' }
							{ work.priority }
						</p>
						{ work.artifact_url && (
							<p className='text-small'>
								<span className='text-label'>Артефакт: </span>
								<a
									href={ work.artifact_url }
									target='_blank'
									rel='noopener noreferrer'
									className='break-all text-action-primary underline'
								>
									{ work.artifact_url }
								</a>
							</p>
						) }
					</div>
				) ) }
			</div>

			<EditQueueEntry
				key={ entry.id }
				queue={ queue }
			/>

			<div className='flex flex-wrap items-start gap-3'>
				<CancelQueueEntry queue={ queue } />
				<MoveQueueEntry queue={ queue } />
				<ProposeQueueSwap queue={ queue } />
			</div>
		</section>
	)
}

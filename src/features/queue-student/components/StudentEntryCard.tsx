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

export const StudentEntryCard = ({ queue }: { queue: QueueDetail }) => {
	const entry = queue.my_entry

	if (!entry) {
		return null
	}

	return (
		<section className='flex flex-col gap-4 rounded-card bg-bg-surface p-6'>
			<h2 className='text-section'>Ваша запись</h2>

			<div className='flex flex-wrap gap-2 text-small'>
				<span className='rounded-control bg-bg-selected px-3 py-2'>
					{statusLabels[entry.status]}
				</span>
				<span className='rounded-control bg-bg-selected px-3 py-2'>
					{entry.is_reserve ? 'Резерв' : 'Основная группа'}
				</span>
			</div>

			<p className='text-section'>
				{entry.position === null
					? 'Место пока не назначено'
					: `Место ${entry.position}`}
			</p>

			{entry.is_top3 && (
				<p className='text-small text-text-secondary'>
					Вы в топ-3 очереди.
				</p>
			)}

			<div className='flex flex-col gap-3'>
				{entry.works.map(work => (
					<div
						key={work.work_id}
						className='flex flex-col gap-2 rounded-control border border-border-subtle p-4'
					>
						<p className='text-label'>{work.title}</p>
						<p className='text-small text-text-secondary'>
							Приоритет: {work.priority}
						</p>
						{work.artifact_url && (
							<a
								href={work.artifact_url}
								target='_blank'
								rel='noopener noreferrer'
								className='break-all text-small text-action-primary underline'
							>
								Открыть артефакт
							</a>
						)}
					</div>
				))}
			</div>
            <div className='flex flex-wrap gap-4'>
	<CancelQueueEntry queue={queue} />
	<MoveQueueEntry queue={queue} />
</div>
<ProposeQueueSwap queue={queue} />
<EditQueueEntry key={entry.id} queue={queue} />
		</section>
	)
}
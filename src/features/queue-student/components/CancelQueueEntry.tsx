import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelMyQueueEntry } from '../../../app/api/queues/queues.api'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'

export const CancelQueueEntry = ({ queue }: { queue: QueueDetail }) => {
	const queryClient = useQueryClient()
	const entry = queue.my_entry

	const cancellation = useMutation({
		mutationFn: () => cancelMyQueueEntry(queue.id),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['queue', queue.id]
			})
		}
	})

	if (!entry) {
		return null
	}

	const blocked =
		queue.stage === 'finished' ||
		entry.status !== 'waiting' ||
		entry.is_top3

	return (
		<div className='flex flex-col items-start gap-3'>
			<button
				type='button'
				disabled={blocked || cancellation.isPending}
				onClick={() => cancellation.mutate()}
				className='rounded-control bg-status-danger px-4 py-2 text-text-inverse disabled:cursor-not-allowed disabled:opacity-50'
			>
				{cancellation.isPending ? 'Отменяем…' : 'Отменить запись'}
			</button>

			{blocked && (
				<p className='text-small text-text-secondary'>
					Отмена недоступна для топ-3, после вызова
					или после завершения очереди.
				</p>
			)}

			{cancellation.isError && (
				<p role='alert' className='text-small text-status-danger'>
					Не удалось отменить запись. Состояние очереди могло
					измениться. Обновите страницу и попробуйте снова.
				</p>
			)}
		</div>
	)
}
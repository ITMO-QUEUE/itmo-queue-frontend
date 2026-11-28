import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelMyQueueEntry } from '../../../app/api/queues/queues.api'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { myQueuesQueryKey } from '../myQueuesQuery'

export const CancelQueueEntry = ( {
	queue,
	compact = false
}: {
	queue: QueueDetail
	compact?: boolean
} ) => {
	const queryClient = useQueryClient()
	const entry = queue.my_entry

	const cancellation = useMutation( {
		mutationFn: () => cancelMyQueueEntry( queue.id ),
		onSuccess: async () => {
			queryClient.setQueryData< QueueDetail[] >(
				[ ...myQueuesQueryKey, entry?.student_id ],
				queues => queues?.filter( item => item.id !== queue.id )
			)
			await Promise.all( [
				queryClient.invalidateQueries( { queryKey: [ 'queue', queue.id ] } ),
				queryClient.invalidateQueries( { queryKey: myQueuesQueryKey } )
			] )
		}
	} )

	if ( ! entry ) {
		return null
	}

	const blocked =
		queue.stage === 'finished' || entry.status !== 'waiting' || entry.is_top3

	return (
		<div className='flex flex-col items-start gap-3'>
			<UIButton
				label='Отменить запись'
				tone={ UIButtonTone.DANGER }
				disabled={ blocked }
				loading={ cancellation.isPending }
				onClick={ () => cancellation.mutate() }
			/>

			{ blocked && ! compact && (
				<p className='text-small text-text-secondary'>
					Отмена недоступна для топ-3, после вызова или после завершения
					очереди.
				</p>
			) }

			{ cancellation.isError && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					Не удалось отменить запись. Состояние очереди могло измениться.
					Обновите страницу и попробуйте снова.
				</p>
			) }
		</div>
	)
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { moveMyEntryToEnd } from '../../../app/api/queues/queues.api'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { myQueuesQueryKey } from '../myQueuesQuery'

export const MoveQueueEntry = ( { queue }: { queue: QueueDetail } ) => {
	const queryClient = useQueryClient()
	const entry = queue.my_entry

	const movement = useMutation( {
		mutationFn: () => moveMyEntryToEnd( queue.id ),
		onSuccess: async () => {
			await Promise.all( [
				queryClient.invalidateQueries( { queryKey: [ 'queue', queue.id ] } ),
				queryClient.invalidateQueries( { queryKey: myQueuesQueryKey } )
			] )
		}
	} )

	if ( ! entry ) {
		return null
	}

	const alreadyMoved = entry.self_moves_count > 0
	const blocked =
		queue.stage === 'finished' ||
		entry.status !== 'waiting' ||
		entry.is_top3 ||
		alreadyMoved

	return (
		<div className='flex flex-col items-start gap-3'>
			<UIButton
				label='Перейти в конец'
				tone={ UIButtonTone.SECONDARY }
				disabled={ blocked }
				loading={ movement.isPending }
				onClick={ () => movement.mutate() }
			/>

			{ alreadyMoved && (
				<p className='text-small text-text-secondary'>
					Перенос уже использован для этой записи.
				</p>
			) }

			{ movement.isError && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					Не удалось перенести запись. Обновите страницу: возможно, ваше
					положение в очереди изменилось.
				</p>
			) }
		</div>
	)
}

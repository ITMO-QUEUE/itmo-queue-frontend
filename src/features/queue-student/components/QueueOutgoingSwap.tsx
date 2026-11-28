import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
	cancelSwapOffer,
	getMyQueueSwaps
} from '../../../app/api/queues/queues.api'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'

export const QueueOutgoingSwap = ( { queue }: { queue: QueueDetail } ) => {
	const queryClient = useQueryClient()
	const [ notice, setNotice ] = useState( '' )
	const studentId = queue.my_entry?.student_id

	const swaps = useQuery( {
		queryKey: [ 'queue-swaps', queue.id, studentId ],
		queryFn: () => getMyQueueSwaps( queue.id ),
		enabled: Boolean( studentId ) && queue.stage !== 'finished',
		refetchInterval: 3000
	} )

	const cancellation = useMutation( {
		mutationFn: ( swapId: string ) => cancelSwapOffer( queue.id, swapId ),
		onSuccess: async result => {
			setNotice(
				result.status === 'cancelled'
					? 'Предложение обмена отменено.'
					: 'Предложение уже обработано. Состояние обновлено.'
			)
			await Promise.all( [
				queryClient.invalidateQueries( {
					queryKey: [ 'queue-swaps', queue.id ]
				} ),
				queryClient.invalidateQueries( {
					queryKey: [ 'queue', queue.id ]
				} )
			] )
		}
	} )

	const outgoing = swaps.data?.find(
		offer =>
			offer.from_student_id === studentId &&
			offer.status === 'pending' &&
			new Date( offer.expires_at ).getTime() > Date.now()
	)

	return (
		<div className='flex flex-col items-start gap-3'>
			{ outgoing && (
				<>
					<p className='text-small'>
						Предложение обмена отправлено. Ожидаем ответа.
					</p>
					<UIButton
						label='Отменить предложение'
						tone={ UIButtonTone.SECONDARY }
						loading={ cancellation.isPending }
						onClick={ () => cancellation.mutate( outgoing.swap_id ) }
						compact
					/>
				</>
			) }
			{ notice && (
				<p
					role='status'
					className='text-small'
				>
					{ notice }
				</p>
			) }
			{ cancellation.isError && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					Не удалось отменить предложение. Попробуйте снова.
				</p>
			) }
		</div>
	)
}

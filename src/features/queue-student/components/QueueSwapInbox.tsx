import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useRef, useState } from 'react'
import {
	acceptSwapOffer,
	declineSwapOffer,
	getMyQueueSwaps
} from '../../../app/api/queues/queues.api'
import type {
	QueueDetail,
	SwapRead
} from '../../../app/api/queues/queues.api.d'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'

interface SwapDialogProps {
	offer: SwapRead
	sender: string
	pending: boolean
	failed: boolean
	onAccept: () => void
	onDecline: () => void
	onDismiss: () => void
}

const SwapDialog = ( {
	offer,
	sender,
	pending,
	failed,
	onAccept,
	onDecline,
	onDismiss
}: SwapDialogProps ) => {
	const dialogRef = useRef< HTMLDialogElement >( null )
	const titleId = useId()

	useEffect( () => {
		const dialog = dialogRef.current
		dialog?.showModal()
		return () => dialog?.close()
	}, [] )

	return (
		<dialog
			ref={ dialogRef }
			aria-labelledby={ titleId }
			onCancel={ event => {
				event.preventDefault()
				if ( ! pending ) onDismiss()
			} }
			className='m-auto w-full max-w-lg rounded-card bg-bg-surface p-6 text-text-primary backdrop:bg-black/40'
		>
			<div className='flex flex-col gap-4'>
				<h2
					id={ titleId }
					className='text-section'
				>
					Предложение обмена
				</h2>
				<p>{ sender } предлагает обменяться местами.</p>
				<p className='text-small'>
					Ваше место: { offer.to_position ?? '—' }. Предлагаемое место:{ ' ' }
					{ offer.from_position ?? '—' }.
				</p>
				{ failed && (
					<p
						role='alert'
						className='text-small text-status-danger'
					>
						Не удалось отправить ответ. Попробуйте снова.
					</p>
				) }
				<div className='flex flex-wrap gap-3'>
					<UIButton
						label='Принять'
						tone={ UIButtonTone.PRIMARY }
						disabled={ pending }
						onClick={ onAccept }
						compact
					/>
					<UIButton
						label='Отклонить'
						tone={ UIButtonTone.SECONDARY }
						disabled={ pending }
						onClick={ onDecline }
						compact
					/>
					<UIButton
						label='Позже'
						tone={ UIButtonTone.GHOST }
						disabled={ pending }
						onClick={ onDismiss }
						compact
					/>
				</div>
			</div>
		</dialog>
	)
}

const responseMessages = {
	pending: 'Предложение пока ожидает ответа.',
	accepted: 'Обмен принят. Позиции обновлены.',
	declined: 'Предложение отклонено.',
	cancelled: 'Обмен отменён: состояние очереди изменилось.',
	expired: 'Срок предложения истёк.'
}

export const QueueSwapInbox = ( { queue }: { queue: QueueDetail } ) => {
	const queryClient = useQueryClient()
	const [ dismissedId, setDismissedId ] = useState< string | null >( null )
	const [ notice, setNotice ] = useState( '' )
	const studentId = queue.my_entry?.student_id

	const swaps = useQuery( {
		queryKey: [ 'queue-swaps', queue.id, studentId ],
		queryFn: () => getMyQueueSwaps( queue.id ),
		enabled: Boolean( studentId ) && queue.stage !== 'finished',
		refetchInterval: 3000
	} )

	const response = useMutation( {
		mutationFn: ( {
			swapId,
			action
		}: {
			swapId: string
			action: 'accept' | 'decline'
		} ) =>
			action === 'accept'
				? acceptSwapOffer( queue.id, swapId )
				: declineSwapOffer( queue.id, swapId ),
		onSuccess: async result => {
			setNotice( responseMessages[ result.status ] )
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

	const incoming = swaps.data?.find(
		offer =>
			offer.to_student_id === studentId &&
			offer.status === 'pending' &&
			new Date( offer.expires_at ).getTime() > Date.now()
	)

	const sender =
		queue.students.find(
			participant => participant.id === incoming?.from_entry_id
		)?.student_name ?? 'Другой студент'

	return (
		<>
			{ notice && (
				<p
					role='status'
					className='text-small'
				>
					{ notice }
				</p>
			) }
			{ studentId && swaps.isError && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					Не удалось проверить предложения обмена.
				</p>
			) }
			{ incoming && incoming.swap_id === dismissedId && (
				<UIButton
					label='Открыть предложение'
					tone={ UIButtonTone.GHOST }
					onClick={ () => {
						response.reset()
						setDismissedId( null )
					} }
					compact
				/>
			) }
			{ incoming && incoming.swap_id !== dismissedId && (
				<SwapDialog
					key={ incoming.swap_id }
					offer={ incoming }
					sender={ sender }
					pending={ response.isPending }
					failed={ response.isError }
					onAccept={ () =>
						response.mutate( { swapId: incoming.swap_id, action: 'accept' } )
					}
					onDecline={ () =>
						response.mutate( { swapId: incoming.swap_id, action: 'decline' } )
					}
					onDismiss={ () => {
						response.reset()
						setDismissedId( incoming.swap_id )
					} }
				/>
			) }
		</>
	)
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useId, useRef, useState } from 'react'
import { cancelMyQueueEntry } from '../../../app/api/queues/queues.api'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { myQueuesQueryKey } from '../myQueuesQuery'

interface ConfirmationProps {
	queue: QueueDetail
	pending: boolean
	blocked: boolean
	failed: boolean
	onConfirm: () => void
	onClose: () => void
}

const CancelConfirmation = ( {
	queue,
	pending,
	blocked,
	failed,
	onConfirm,
	onClose
}: ConfirmationProps ) => {
	const dialog = useRef< HTMLDialogElement >( null )
	const titleId = useId()
	const descriptionId = useId()

	useEffect( () => {
		const element = dialog.current
		element?.showModal()
		return () => element?.close()
	}, [] )

	return (
		<dialog
			ref={ dialog }
			aria-labelledby={ titleId }
			aria-describedby={ descriptionId }
			onCancel={ event => {
				event.preventDefault()
				if ( ! pending ) onClose()
			} }
			className='m-auto w-[560px] max-w-[calc(100vw-32px)] rounded-dialog border border-border-subtle bg-bg-surface p-6 font-nunito text-text-primary backdrop:bg-black/40'
		>
			<h2
				id={ titleId }
				className='text-section'
			>
				Отменить запись?
			</h2>
			<p
				id={ descriptionId }
				className='mt-4 text-body text-text-secondary'
			>
				Вы отмените запись на защиту по дисциплине «{ queue.discipline_name }».
				Все выбранные работы будут сняты с этой очереди.
			</p>
			{ blocked && (
				<p
					role='alert'
					className='mt-3 text-small text-text-secondary'
				>
					Состояние очереди изменилось. Отмена сейчас недоступна.
				</p>
			) }
			{ failed && (
				<p
					role='alert'
					className='mt-3 text-small text-status-danger'
				>
					Не удалось отменить запись. Попробуйте ещё раз или вернитесь к
					очереди.
				</p>
			) }
			<div className='mt-6 flex flex-col gap-3 sm:flex-row [&>button]:w-full sm:[&>button]:w-56'>
				<UIButton
					label='Да, отменить запись'
					tone={ UIButtonTone.DANGER }
					disabled={ blocked }
					loading={ pending }
					onClick={ onConfirm }
				/>
				<UIButton
					label='Оставить запись'
					tone={ UIButtonTone.SECONDARY }
					disabled={ pending }
					onClick={ onClose }
				/>
			</div>
		</dialog>
	)
}

export const CancelQueueEntry = ( {
	queue,
	compact = false
}: {
	queue: QueueDetail
	compact?: boolean
} ) => {
	const [ confirming, setConfirming ] = useState( false )
	const queryClient = useQueryClient()
	const entry = queue.my_entry

	const cancellation = useMutation( {
		mutationFn: () => cancelMyQueueEntry( queue.id ),
		onSuccess: async () => {
			setConfirming( false )
			queryClient.setQueriesData< QueueDetail[] >(
				{ queryKey: myQueuesQueryKey },
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
				onClick={ () => {
					cancellation.reset()
					setConfirming( true )
				} }
			/>

			{ blocked && ! compact && (
				<p className='text-small text-text-secondary'>
					Отмена недоступна для топ-3, после вызова или после завершения
					очереди.
				</p>
			) }

			{ cancellation.isError && ! confirming && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					Не удалось отменить запись. Состояние очереди могло измениться.
					Обновите страницу и попробуйте снова.
				</p>
			) }
			{ confirming && (
				<CancelConfirmation
					queue={ queue }
					pending={ cancellation.isPending }
					blocked={ blocked }
					failed={ cancellation.isError }
					onConfirm={ () => {
						if ( ! blocked && ! cancellation.isPending ) cancellation.mutate()
					} }
					onClose={ () => {
						cancellation.reset()
						setConfirming( false )
					} }
				/>
			) }
		</div>
	)
}

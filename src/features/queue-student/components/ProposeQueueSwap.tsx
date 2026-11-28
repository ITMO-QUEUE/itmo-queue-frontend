import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createSwapOffer } from '../../../app/api/queues/queues.api'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UISelect } from '../../../components/ui/UISelect'

export const ProposeQueueSwap = ( { queue }: { queue: QueueDetail } ) => {
	const [ targetId, setTargetId ] = useState( '' )
	const [ choosing, setChoosing ] = useState( false )
	const queryClient = useQueryClient()
	const entry = queue.my_entry

	const proposal = useMutation( {
		mutationFn: () => {
			if ( ! entry || ! targetId ) {
				throw new Error( 'Не выбран участник' )
			}
			return createSwapOffer( queue.id, entry.id, targetId )
		},
		onSuccess: async () => {
			setTargetId( '' )
			setChoosing( false )
			await queryClient.invalidateQueries( {
				queryKey: [ 'queue-swaps', queue.id ]
			} )
		}
	} )

	if ( ! entry ) {
		return null
	}

	const blocked =
		entry.status !== 'waiting' || entry.is_top3 || queue.stage === 'finished'

	const candidates = queue.students.filter(
		participant =>
			participant.id !== entry.id &&
			participant.status === 'waiting' &&
			! participant.is_top3
	)

	const options = candidates.map( participant => ( {
		value: participant.id,
		label: `${ participant.student_name } · место ${ participant.position ?? '—' }`
	} ) )

	const selectedExists = candidates.some( item => item.id === targetId )

	return (
		<section
			aria-label='Обмен местами'
			className='flex max-w-full flex-col items-start gap-2'
		>
			<div className='inline-flex w-44 max-w-full'>
				<UIButton
					label='Обменяться местами'
					fullWidth
					tone={ UIButtonTone.SECONDARY }
					disabled={ blocked || options.length === 0 || proposal.isPending }
					onClick={ () => setChoosing( value => ! value ) }
				/>
			</div>
			{ choosing && ! blocked && options.length > 0 && (
				<div className='flex flex-wrap items-end gap-2'>
					<div className='w-56 max-w-full'>
						<UISelect
							label='С кем обменяться'
							value={ selectedExists ? targetId : '' }
							options={ options }
							onChange={ value => {
								setTargetId( value )
								proposal.reset()
							} }
							placeholder='Выберите участника'
							disabled={ proposal.isPending }
							fullWidth
						/>
					</div>
					<UIButton
						label='Предложить обмен'
						tone={ UIButtonTone.SECONDARY }
						disabled={ blocked || ! selectedExists }
						loading={ proposal.isPending }
						onClick={ () => proposal.mutate() }
						compact
					/>
				</div>
			) }
			{ proposal.isSuccess && (
				<p
					role='status'
					className='text-small text-status-success'
				>
					Предложение отправлено. Ожидаем ответа студента.
				</p>
			) }
			{ proposal.isError && (
				<p
					role='alert'
					className='text-small text-status-danger'
				>
					Не удалось предложить обмен. Возможно, у участника уже есть
					предложение или его состояние изменилось.
				</p>
			) }
		</section>
	)
}

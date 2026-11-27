import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createSwapOffer } from '../../../app/api/queues/queues.api'
import type { QueueDetail } from '../../../app/api/queues/queues.api.d'
import { UISelect } from '../../../components/ui/UISelect'

export const ProposeQueueSwap = ({ queue }: { queue: QueueDetail }) => {
	const [targetId, setTargetId] = useState('')
	const queryClient = useQueryClient()
	const entry = queue.my_entry

	const proposal = useMutation({
		mutationFn: () => {
			if (!entry || !targetId) {
				throw new Error('Не выбран участник')
			}
			return createSwapOffer(queue.id, entry.id, targetId)
		},
		onSuccess: async () => {
			setTargetId('')
			await queryClient.invalidateQueries({
				queryKey: ['queue-swaps', queue.id]
			})
		}
	})

	if (
	entry?.status !== 'waiting' ||
	entry.is_top3 ||
	queue.stage === 'finished'
) {
		return null
	}

	const candidates = queue.students.filter(participant =>
		participant.id !== entry.id &&
		participant.status === 'waiting' &&
		!participant.is_top3
	)

	const options = candidates.map(participant => ({
		value: participant.id,
		label: `${participant.student_name} · место ${participant.position ?? '—'}`
	}))

	const selectedExists = candidates.some(item => item.id === targetId)

	return (
		<section className='flex flex-col items-start gap-3'>
			<h3 className='text-label'>Обмен местами</h3>
			{options.length === 0 ? (
				<p className='text-small'>Нет доступных участников для обмена.</p>
			) : (
				<>
					<UISelect
						label='С кем обменяться'
						value={selectedExists ? targetId : ''}
						options={options}
						onChange={value => {
							setTargetId(value)
							proposal.reset()
						}}
						placeholder='Выберите участника'
						disabled={proposal.isPending}
						fullWidth
					/>
					<button
						type='button'
						disabled={!selectedExists || proposal.isPending}
						onClick={() => proposal.mutate()}
						className='rounded-control border border-border-control px-4 py-2 disabled:opacity-50'
					>
						{proposal.isPending ? <span>Отправляем…</span>  : 'Предложить обмен'}
					</button>
				</>
			)}
			{proposal.isSuccess && (
				<p role='status' className='text-small text-status-success'>
					Предложение отправлено. Ожидаем ответа студента.
				</p>
			)}
			{proposal.isError && (
				<p role='alert' className='text-small text-status-danger'>
					Не удалось предложить обмен. Возможно, у участника уже
					есть предложение или его состояние изменилось.
				</p>
			)}
		</section>
	)
}
import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { UISelect } from '../../../components/ui/UISelect'
import { getQueueFilterOptions } from '../api/getQueueFilterOptions'

interface QueueReferenceFiltersProps {
	discipline: string
	stream: string
	onDisciplineChange: (value: string) => void
	onStreamChange: (value: string) => void
	children: ReactNode
}

export const QueueReferenceFilters = ({
	discipline,
	stream,
	onDisciplineChange,
	onStreamChange,
	children
}: QueueReferenceFiltersProps) => {
	const { data, isPending, isError, refetch } = useQuery({
		queryKey: ['queue-filter-options'],
		queryFn: ({ signal }) => getQueueFilterOptions(signal)
	})

	const disciplineOptions = [
		{ value: 'all', label: 'Все' },
		...(data?.disciplines ?? []).map(item => ({
			value: item.id,
			label: item.name
		}))
	]

	const streamOptions = [
		{ value: 'all', label: 'Все доступные' },
		...(data?.streams ?? []).map(item => ({
			value: item.id,
			label: item.name
		}))
	]

	return (
		<div className='flex flex-col gap-3'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<UISelect
					label='Дисциплина'
					value={discipline}
					options={disciplineOptions}
					onChange={onDisciplineChange}
					disabled={isPending || isError}
					fullWidth
				/>
				{children}
				<div className='md:col-start-1'>
					<UISelect
						label='Поток'
						value={stream}
						options={streamOptions}
						onChange={onStreamChange}
						disabled={isPending || isError}
						fullWidth
					/>
				</div>
			</div>
			{isPending && <p>Загрузка вариантов фильтров…</p>}
			{isError && (
				<button
					type='button'
					onClick={() => refetch()}
					className='cursor-pointer self-start text-action-primary'
				>
					Не удалось загрузить фильтры. Повторить
				</button>
			)}
		</div>
	)
}
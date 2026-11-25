import { useQuery } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { Outlet, useParams } from 'react-router'
import { Page } from '../../components/common/Page'
import { UISelect } from '../../components/ui/UISelect'
import {	
	getAvailableQueues,
	type QueueFilters,
	type QueueList
} from '../../features/queues/api/getQueues'
import { QueueCatalogCard } from '../../features/queues/components/QueueCatalogCard'
import { QueueReferenceFilters } from '../../features/queues/components/QueueReferenceFilters'

type StageFilter = 'all' | 'preliminary' | 'active'
type RegistrationFilter = 'all' | 'open' | 'closed'

const stageOptions = [
	{ value: 'all', label: 'Все' },
	{ value: 'preliminary', label: 'Предварительная запись' },
	{ value: 'active', label: 'Активная защита' }
]

const registrationOptions = [
	{ value: 'all', label: 'Все' },
	{ value: 'open', label: 'Запись открыта' },
	{ value: 'closed', label: 'Запись закрыта' }
]

interface QueueSearchProps {
	onSearch: (value: string) => void
	onReset: () => void
}

const QueueSearch = ({ onSearch, onReset }: QueueSearchProps) => {
	const searchId = useId()
	const [input, setInput] = useState('')

	return (
		<form
			className='flex flex-col gap-3'
			onSubmit={event => {
				event.preventDefault()
				onSearch(input.trim())
			}}
		>
			<label htmlFor={searchId} className='text-label'>
				Поиск
			</label>
			<input
				id={searchId}
				type='search'
				value={input}
				onChange={event => setInput(event.target.value)}
				placeholder='Дисциплина или преподаватель'
				className='h-11 w-full rounded-control border border-border-control bg-bg-surface px-3 text-body text-text-primary'
			/>
			<div className='flex flex-wrap gap-3'>
				<button
					type='submit'
					className='cursor-pointer rounded-control bg-action-primary px-4 py-2 text-text-inverse'
				>
					Найти
				</button>
				<button
					type='button'
					onClick={() => {
						setInput('')
						onReset()
					}}
					className='cursor-pointer rounded-control border border-border-control px-4 py-2'
				>
					Сбросить фильтры
				</button>
			</div>
		</form>
	)
}

interface QueueFilterFieldsProps {
	stage: StageFilter
	registration: RegistrationFilter
	onStageChange: (value: StageFilter) => void
	onRegistrationChange: (value: RegistrationFilter) => void
}

const QueueFilterFields = ({
	stage,
	registration,
	onStageChange,
	onRegistrationChange
}: QueueFilterFieldsProps) => (
	<div className='contents'>
		<UISelect
			label='Этап сеанса'
			value={stage}
			options={stageOptions}
			onChange={value => {
				if (
					value === 'all' ||
					value === 'preliminary' ||
					value === 'active'
				) {
					onStageChange(value)
				}
			}}
			fullWidth
		/>
		<UISelect
			label='Запись'
			value={registration}
			options={registrationOptions}
			onChange={value => {
				if (
					value === 'all' ||
					value === 'open' ||
					value === 'closed'
				) {
					onRegistrationChange(value)
				}
			}}
			fullWidth
		/>
	</div>
)

interface QueueResultsProps {
	queues: QueueList
	onReset: () => void
}

const QueueResults = ({ queues, onReset }: QueueResultsProps) => (
	<>
		<p>Получено очередей: {queues.length}</p>
		{queues.length === 0 && (
			<div className='rounded-card bg-bg-surface p-6'>
				<p className='text-section'>Очереди не найдены</p>
				<p className='mt-2 text-small text-text-secondary'>
					Измените запрос или сбросьте фильтры.
				</p>
				<button
					type='button'
					onClick={onReset}
					className='mt-4 cursor-pointer text-action-primary'
				>
					Сбросить фильтры
				</button>
			</div>
		)}
		<div className='grid gap-6'>
			{queues.map(queue => (
				<QueueCatalogCard key={queue.id} queue={queue} />
			))}
		</div>
	</>
)

const StudentQueueList = () => {
	const [search, setSearch] = useState('')
	const [stage, setStage] = useState<StageFilter>('all')
	const [registration, setRegistration] = useState<RegistrationFilter>('all')
	const [discipline, setDiscipline] = useState('all')
	const [stream, setStream] = useState('all')
	const [resetVersion, setResetVersion] = useState(0)

	const filters: QueueFilters = {
		search: search || undefined,
		discipline: discipline === 'all' ? undefined : discipline,
		stream: stream === 'all' ? undefined : stream,
		stage: stage === 'all' ? undefined : stage,
		registration_open:
			registration === 'all' ? undefined : registration === 'open'
	}

	const { data: queues, isPending, isError, refetch } = useQuery({
		queryKey: ['student-queue-search', 'available', filters],
		queryFn: ({ signal }) => getAvailableQueues(filters, signal)
	})

	const resetFilters = () => {
		setSearch('')
		setStage('all')
		setRegistration('all')
		setDiscipline('all')
		setStream('all')
		setResetVersion(version => version + 1)
	}

	return (
		<Page
			title='Найти очередь'
			subtitle='Доступные предварительные и активные сеансы'
		>
			<QueueSearch
				key={resetVersion}
				onSearch={setSearch}
				onReset={resetFilters}
			/>
			<QueueReferenceFilters
	discipline={discipline}
	stream={stream}
	onDisciplineChange={setDiscipline}
	onStreamChange={setStream}
>
	<QueueFilterFields
		stage={stage}
		registration={registration}
		onStageChange={setStage}
		onRegistrationChange={setRegistration}
	/>
</QueueReferenceFilters>
			{isPending && <p>Загрузка очередей…</p>}
			{isError && (
				<button
					type='button'
					onClick={() => refetch()}
					className='cursor-pointer self-start text-action-primary'
				>
					Не удалось загрузить очереди. Повторить
				</button>
			)}
			{queues && (
				<QueueResults queues={queues} onReset={resetFilters} />
			)}
		</Page>
	)
}
export const StudentQueuesPage = () => {
	const { queueId } = useParams()

	return queueId ? <Outlet /> : <StudentQueueList />
}
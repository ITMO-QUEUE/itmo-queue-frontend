import { ParticipantStatus, type StudentRecord } from '../../types/StudentRecord'
import { QueueRows } from '../../components/common/QueueRows'
import { useAuthStore } from '../../stores/useAuthStore'

const ARTIFACT_URL = '#queue-row-artifacts'

function exampleRecord(id: string, overrides: Partial<StudentRecord>): StudentRecord {
	return {
		id,
		student_id: `student-${id}`,
		queue_id: 'demo-queue',
		student_name: 'Алексей Смирнов',
		position: null,
		status: ParticipantStatus.WAITING,
		is_top3: false,
		is_reserve: false,
		self_moves_count: 0,
		works: [{ work_id: 'lab-3', title: 'ЛР № 3', priority: 1, artifact_url: ARTIFACT_URL }],
		...overrides
	}
}

const EXAMPLES = [
	{
		title: 'Участники очереди',
		description: 'Первые три места, основная группа и резерв.',
		rows: [
			exampleRecord('1', { position: 1, student_name: 'Анна Иванова', is_top3: true }),
			exampleRecord('2', {
				position: 2, student_name: 'Илья Соколов', is_top3: true,
				works: [
					{ work_id: 'lab-1', title: 'ЛР № 1', priority: 1, artifact_url: ARTIFACT_URL },
					{ work_id: 'lab-2', title: 'ЛР № 2', priority: 2, artifact_url: ARTIFACT_URL }
				]
			}),
			exampleRecord('3', { position: 3, student_name: 'Даниил Петров', is_top3: true }),
			exampleRecord('4', { position: 4, student_name: 'София Волкова' }),
			exampleRecord('5', { student_name: 'Максим Козвик', is_reserve: true })
		]
	},
	{
		title: 'Статусы участников',
		description: 'Все шесть статусов записи в очереди.',
		rows: Object.values(ParticipantStatus).map(status =>
			exampleRecord(`status-${status}`, { status })
		)
	},
	{
		title: 'Разное наполнение',
		description: 'Пустой список, несколько работ и длинные названия.',
		rows: [
			exampleRecord('8', { position: 8, works: [] }),
			exampleRecord('12', {
				position: 12,
				works: [1, 2, 3, 4, 5].map(number => ({
					work_id: `lab-${number}`, title: `ЛР № ${number}`, priority: number
				}))
			}),
			exampleRecord('123', {
				position: 123,
				student_name: 'Александра Константинова-Рождественская',
				works: [{
					work_id: 'lab-6', priority: 1,
					title: 'Лабораторная работа № 6 — проектирование информационной системы'
				}]
			})
		]
	}
]
export const TestQueueRowPage = () => {
	const currentUser = useAuthStore(state => state.user)
	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-6xl flex-col gap-8'>
				<header className='space-y-2'>
					<p className='text-small text-text-secondary'>
						Design System / Components
					</p>
					<h1 className='text-heading text-text-primary'>
						QueueRow Playground
					</h1>
					<p className='text-body text-text-secondary'>
						Новый элемент очереди. Все данные демонстрационные.
					</p>
				</header>

				{ EXAMPLES.map( ( { title, description, rows } ) => (
					<section
						key={ title }
						className='min-w-0 space-y-4'
					>
						<div className='space-y-1'>
							<h2 className='text-subheading text-text-primary'>{ title }</h2>
							<p className='text-small text-text-secondary'>{ description }</p>
						</div>
						<QueueRows records={rows} currentUser={currentUser} />
					</section>
				) ) }

				<section
					id='queue-row-artifacts'
					className='space-y-2 rounded-card border border-border-subtle bg-bg-surface p-6'
				>
					<h2 className='text-subheading text-text-primary'>
						Демонстрационные артефакты
					</h2>
					<p className='text-small text-text-secondary'>
						Ссылки «Открыть артефакты» ведут к этому блоку. Используйте Tab и
						Enter для проверки перехода с клавиатуры.
					</p>
				</section>
			</div>
		</main>
	)
}

import { useState } from 'react'
import { UIParticipantStatusStatus } from '../../components/ui/UIParticipantStatus'
import {
	UIQueueRow,
	type UIQueueRowProps
} from '../../components/ui/UIQueueRow'

const WAITING = {
	status: UIParticipantStatusStatus.WAITING,
	label: 'Ожидает'
}
const PARTICIPANT = {
	name: 'Алексей Смирнов',
	works: [ 'ЛР № 3' ],
	link: '#queue-row-artifacts',
	participantStatus: WAITING
} satisfies Omit< UIQueueRowProps, 'position' >

const EXAMPLES: {
	title: string
	description: string
	rows: UIQueueRowProps[]
}[] = [
	{
		title: 'Участники очереди',
		description:
			'Первые три места, основная группа и ваша запись со ссылкой на артефакты.',
		rows: [
			{ ...PARTICIPANT, position: 1, name: 'Анна Иванова' },
			{
				...PARTICIPANT,
				position: 2,
				name: 'Илья Соколов',
				works: [ 'ЛР № 1', 'ЛР № 2' ]
			},
			{ ...PARTICIPANT, position: 3, name: 'Даниил Петров' },
			{
				...PARTICIPANT,
				position: 4,
				name: 'София Волкова',
				works: [ 'ЛР № 4' ]
			},
			{
				...PARTICIPANT,
				position: 7,
				name: 'Максим Козвик',
				works: [ 'ЛР № 3', 'ЛР № 4' ],
				isMe: true
			}
		]
	},
	{
		title: 'Статусы и своя запись в топ-3',
		description:
			'Статус меняет бейдж. Подсветка строки и ссылка появляются у вашей записи.',
		rows: [
			{
				...PARTICIPANT,
				position: 1,
				isMe: true,
				participantStatus: {
					status: UIParticipantStatusStatus.DEFENDING,
					label: 'На защите'
				}
			},
			{
				...PARTICIPANT,
				position: 2,
				participantStatus: {
					status: UIParticipantStatusStatus.CALLED,
					label: 'Вызван'
				}
			},
			{ ...PARTICIPANT, position: 4 },
			{
				...PARTICIPANT,
				position: 5,
				participantStatus: {
					status: UIParticipantStatusStatus.ACCEPTED,
					label: 'Принято'
				}
			},
			{
				...PARTICIPANT,
				position: 6,
				participantStatus: {
					status: UIParticipantStatusStatus.NO_SHOW,
					label: 'Неявка'
				}
			}
		]
	},
	{
		title: 'Разное наполнение',
		description:
			'Пустой список, пять работ, длинное имя и название группы для проверки переноса текста.',
		rows: [
			{ ...PARTICIPANT, position: 8, works: [] },
			{
				...PARTICIPANT,
				position: 12,
				works: [ 'ЛР № 1', 'ЛР № 2', 'ЛР № 3', 'ЛР № 4', 'ЛР № 5' ],
				isMe: true
			},
			{
				...PARTICIPANT,
				position: 123,
				name: 'Александра Константинова-Рождественская',
				works: [
					'Лабораторная работа № 6 — проектирование информационной системы'
				],
				group: 'Дополнительная группа'
			}
		]
	}
]

export const TestQueueRowPage = () => {
	const [ previewWidth, setPreviewWidth ] = useState( 1000 )

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

				<div className='space-y-3 rounded-card border border-border-subtle bg-bg-surface p-6'>
					<label
						className='block text-label text-text-primary'
						htmlFor='queue-row-width'
					>
						Ширина примеров: { previewWidth } px
					</label>
					<input
						id='queue-row-width'
						type='range'
						min={ 640 }
						max={ 1100 }
						step={ 20 }
						value={ previewWidth }
						onChange={ event =>
							setPreviewWidth( Number( event.target.value ) )
						}
						className='w-full accent-action-primary'
					/>
					<p className='text-small text-text-secondary'>
						Меняйте ширину, чтобы проверить свободное пространство и положение
						правых колонок. На небольшом экране примеры можно прокручивать по
						горизонтали.
					</p>
				</div>

				{ EXAMPLES.map( ( { title, description, rows } ) => (
					<section
						key={ title }
						className='min-w-0 space-y-4'
					>
						<div className='space-y-1'>
							<h2 className='text-subheading text-text-primary'>{ title }</h2>
							<p className='text-small text-text-secondary'>{ description }</p>
						</div>
						<div className='overflow-x-auto pb-2'>
							<div
								className='flex flex-col gap-3'
								style={ { width: previewWidth } }
							>
								{ rows.map( row => (
									<UIQueueRow
										key={ row.position }
										{ ...row }
									/>
								) ) }
							</div>
						</div>
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

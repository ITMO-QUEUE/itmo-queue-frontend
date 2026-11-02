import { useState } from 'react'
import { UIParticipantStatusStatus } from '../../components/ui/UIParticipantStatus'
import { UIQueueRow } from '../../components/ui/UIQueueRow'

const STATUSES = [
	{
		status: UIParticipantStatusStatus.WAITING,
		label: 'Ожидает',
		title: 'Waiting'
	},
	{
		status: UIParticipantStatusStatus.CALLED,
		label: 'Вызван',
		title: 'Called'
	},
	{
		status: UIParticipantStatusStatus.DEFENDING,
		label: 'На защите',
		title: 'Defending'
	},
	{
		status: UIParticipantStatusStatus.ACCEPTED,
		label: 'Принято',
		title: 'Accepted'
	},
	{
		status: UIParticipantStatusStatus.NO_SHOW,
		label: 'Неявка',
		title: 'NoShow'
	}
] as const

const PARTICIPANT = {
	name: 'Алексей Смирнов',
	workname: 'ЛР № 3',
	priority: 1,
	link: 'https://github.com/octocat/Hello-World'
} as const

export const TestQueueRowPage = () => {
	const [ clickCount, setClickCount ] = useState( 0 )
	const [ lastClicked, setLastClicked ] = useState< string | null >( null )

	const handleMoreClick = ( label: string ) => {
		setClickCount( prev => prev + 1 )
		setLastClicked( label )
	}

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-6xl flex-col gap-8'>
				<header className='flex flex-wrap items-end justify-between gap-4'>
					<div className='space-y-2'>
						<p className='text-small text-text-secondary'>
							Design System / Components
						</p>
						<h1 className='text-heading text-text-primary'>
							QueueRow Playground
						</h1>
						<p className='text-body text-text-secondary'>
							Статусы участников очереди и вариант «Топ-3». Данные
							демонстрационные.
						</p>
					</div>
					<div
						className='rounded-card border border-border-subtle bg-bg-surface px-5 py-3'
						role='status'
					>
						<p className='text-small text-text-secondary'>
							Нажатия на многоточие
						</p>
						<p className='text-section text-text-primary'>{ clickCount }</p>
						<p className='text-caption text-text-secondary'>
							Последний статус: { lastClicked ?? 'Нет' }
						</p>
					</div>
				</header>

				<section className='overflow-hidden rounded-card border border-border-subtle bg-bg-surface'>
					<div className='border-b border-border-subtle px-6 py-5'>
						<h2 className='text-subheading text-text-primary'>
							Варианты QueueRow
						</h2>
						<p className='mt-1 text-small text-text-secondary'>
							Сравните оформление всех статусов. Вызванный участник выделен
							фоном.
						</p>
					</div>
					<div className='grid grid-cols-1 gap-6 p-6 xl'>
						{ STATUSES.map( ( { status, label, title } ) => (
							<div
								key={ status }
								className='min-w-0 space-y-3'
							>
								<h3 className='text-small text-text-secondary'>
									State={ title }
								</h3>
								<UIQueueRow
									{ ...PARTICIPANT }
									position={ 5 }
									participantStatus={ { status, label } }
									onMoreClick={ () => handleMoreClick( label ) }
								/>
							</div>
						) ) }
						<div className='min-w-0 space-y-3'>
							<h3 className='text-small text-text-secondary'>State=Top3</h3>
							<UIQueueRow
								{ ...PARTICIPANT }
								position={ 2 }
								participantStatus={ {
									status: UIParticipantStatusStatus.WAITING,
									label: 'Ожидает'
								} }
							/>
						</div>
					</div>
				</section>

				<section className='rounded-card border border-border-subtle bg-bg-surface p-6'>
					<h2 className='text-subheading text-text-primary'>
						Проверка взаимодействий
					</h2>
					<p className='mt-2 text-small text-text-secondary'>
						Нажмите на многоточие, чтобы обновить счётчик. Ссылка на код
						открывает демонстрационный репозиторий. Используйте Tab для проверки
						фокуса на ссылках и кнопках.
					</p>
				</section>
				<footer className='text-caption text-text-secondary'>
					UIQueueRow · 5 статусов · Топ-3 · Проверка взаимодействий
				</footer>
			</div>
		</main>
	)
}

import { useState } from 'react'
import {
	UIQueueCard,
	type UIQueueCardScenarioProps
} from '../../components/ui/UIQueueCard'

type QueueCardScenario = {
	key: string
	label: string
	props: UIQueueCardScenarioProps
}

const createDate = (hours: number, minutes = 0) => {
	const date = new Date()
	date.setHours(hours, minutes, 0, 0)
	return date
}

const DATE_START = createDate(14)
const DATE_END = createDate(15, 30)

// Общие свойства карточки без place и onlineLink
const COMMON_PROPS = {
	subject: 'Программирование',
	name: 'ЛР № 3',
	totalQueueNumber: 12,
	dateStart: DATE_START,
	dateEnd: DATE_END
}

// Свойства для очной защиты
const OFFLINE_PROPS = {
	...COMMON_PROPS,
	place: '305'
} satisfies UIQueueCardScenarioProps

// Свойства для онлайн-защиты
const ONLINE_PROPS = {
	...COMMON_PROPS,
	onlineLink: 'https://itmo.ktalk.ru/'
} satisfies UIQueueCardScenarioProps

const SCENARIOS: QueueCardScenario[] = [
	{
		key: 'nearest-available',
		label: 'Nearest / Available',
		props: {
			...OFFLINE_PROPS,
			isNearest: true,
			isMoveUsed: false,
			queueNumber: 5
		}
	},
	{
		key: 'nearest-top3',
		label: 'Nearest / Top3',
		props: {
			...OFFLINE_PROPS,
			isNearest: true,
			isMoveUsed: false,
			queueNumber: 2
		}
	},
	{
		key: 'nearest-move-used',
		label: 'Nearest / MoveUsed',
		props: {
			...OFFLINE_PROPS,
			isNearest: true,
			isMoveUsed: true,
			queueNumber: 5
		}
	},
	{
		key: 'following-available',
		label: 'Following / Available',
		props: {
			...OFFLINE_PROPS,
			isNearest: false,
			isMoveUsed: false,
			queueNumber: 5
		}
	},
	{
		key: 'following-top3',
		label: 'Following / Top3',
		props: {
			...OFFLINE_PROPS,
			isNearest: false,
			isMoveUsed: false,
			queueNumber: 2
		}
	},
	{
		key: 'following-move-used',
		label: 'Following / MoveUsed',
		props: {
			...OFFLINE_PROPS,
			isNearest: false,
			isMoveUsed: true,
			queueNumber: 5
		}
	}
]

export const TestQueueCardPage = () => {
	const [clickCount, setClickCount] = useState(0)
	const [lastAction, setLastAction] = useState<string | null>(null)

	const handleAction = (action: string, scenario: string) => {
		setClickCount(prev => prev + 1)
		setLastAction(`${action}: ${scenario}`)
	}

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-7xl flex-col gap-8'>
				{/* Header */}
				<header className='flex flex-wrap items-end justify-between gap-4'>
					<div className='space-y-2'>
						<p className='text-small text-text-secondary'>
							Design System / Components
						</p>

						<h1 className='text-heading text-text-primary'>
							QueueCard Playground
						</h1>

						<p className='text-body text-text-secondary'>
							Visual testing of queue card emphasis and states.
						</p>
					</div>

					<div className='min-w-52 rounded-card border border-border-subtle bg-bg-surface px-5 py-3'>
						<p className='text-small text-text-secondary'>Click events</p>

						<p className='text-section text-text-primary'>{clickCount}</p>

						<p className='text-caption text-text-secondary'>
							Last: {lastAction ?? 'None'}
						</p>
					</div>
				</header>

				{/* QueueCard variants */}
				<section className='flex flex-col gap-5'>
					<div>
						<h2 className='text-subheading text-text-primary'>Card variants</h2>

						<p className='mt-1 text-small text-text-secondary'>
							Compare all available visual states.
						</p>
					</div>

					<div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
						{SCENARIOS.map(({ key, label, props }) => (
							<article
								key={key}
								className='flex min-w-0 flex-col gap-3'
							>
								<p className='text-small text-text-secondary'>{label}</p>

								<UIQueueCard
									{...props}
									onOpenQueue={() => handleAction('Open queue', label)}
									onMoveToEnd={() => handleAction('Move to end', label)}
								/>
							</article>
						))}
					</div>
				</section>

				{/* Online mode */}
				<section className='rounded-card border border-border-subtle bg-bg-surface p-6'>
					<h2 className='text-subheading text-text-primary'>
						Online protection
					</h2>

					<p className='mt-1 text-small text-text-secondary'>
						Check the appearance of an online meeting link.
					</p>

					<div className='mt-5 max-w-2xl'>
						<UIQueueCard
							{...ONLINE_PROPS}
							isNearest
							queueNumber={5}
							onOpenQueue={() => handleAction('Open queue', 'Online')}
							onMoveToEnd={() => handleAction('Move to end', 'Online')}
						/>
					</div>
				</section>

				{/* Footer */}
				<footer className='text-caption text-text-secondary'>
					UIQueueCard · 2 emphasis variants · 3 states · 6 combinations · Online
					mode
				</footer>
			</div>
		</main>
	)
}

import {
	QueueStatus,
	UIQueueStatus,
	type UIQueueStatusProps
} from '../../components/ui/UIQueueStatus'

const STATUSES = [
	{
		status: QueueStatus.PREREGISTRATION,
		label: 'Предварительная запись'
	},
	{
		status: QueueStatus.REGISTRATION_CLOSED,
		label: 'Запись закрыта'
	},
	{
		status: QueueStatus.ACTIVE,
		label: 'Активная защита'
	},
	{
		status: QueueStatus.PAUSED,
		label: 'Пауза · резерв'
	},
	{
		status: QueueStatus.COMPLETED,
		label: 'Защита завершена'
	}
] satisfies UIQueueStatusProps[]

export const TestQueueStatus = () => (
	<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
		<div className='mx-auto flex max-w-7xl flex-col gap-8'>
			<header className='space-y-2'>
				<p className='text-small text-text-secondary'>
					Design System / Components
				</p>
				<h1 className='text-heading text-text-primary'>
					QueueStatus Playground
				</h1>
				<p className='text-body text-text-secondary'>
					Статус сессии и доступность записи — независимые данные. Активная
					защита может иметь открытую или закрытую запись. Не переключать по
					таймеру. Пауза — резерв, вне согласованного MVP.
				</p>
			</header>

			<section className='flex flex-col gap-5 rounded-card border border-border-subtle bg-bg-surface p-6'>
				<h2 className='text-subheading text-text-primary'>Status variants</h2>
				<div className='flex flex-wrap gap-6'>
					{STATUSES.map(({ status, label }) => (
						<article
							key={status}
							className='flex flex-col gap-3'
						>
							<p className='text-small text-text-secondary'>Status={status}</p>
							<UIQueueStatus
								status={status}
								label={label}
							/>
						</article>
					))}
				</div>
			</section>
		</div>
	</main>
)

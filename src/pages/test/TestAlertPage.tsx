import { UIAlert, UIAlertTone } from '../../components/ui/UIAlert'

const TONES = [
	{
		tone: UIAlertTone.ERROR,
		title: 'Не удалось войти',
		message: 'Неверный логин или пароль'
	},
	{
		tone: UIAlertTone.WARNING,
		title: 'Действие недоступно',
		message: 'Вы в топ-3 очереди: отмена записи и обмен местами недоступны'
	},
	{
		tone: UIAlertTone.SUCCESS,
		title: 'Готово',
		message: 'Вы записаны в очередь'
	},
	{
		tone: UIAlertTone.INFO,
		title: 'Нет записей',
		message: 'Вы пока не записаны ни в одну очередь'
	}
] as const

export const TestAlertPage = () => {
	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-3xl flex-col gap-8'>
				<header className='space-y-2'>
					<p className='text-small text-text-secondary'>
						Design System / Components
					</p>
					<h1 className='text-heading text-text-primary'>Alert Playground</h1>
					<p className='text-body text-text-secondary'>
						Visual testing of alert tones.
					</p>
				</header>

				<section className='flex flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'>
					<h2 className='text-subheading text-text-primary'>With title</h2>
					{TONES.map(({ tone, title, message }) => (
						<UIAlert
							key={tone}
							tone={tone}
							title={title}
							message={message}
						/>
					))}
				</section>

				<section className='flex flex-col gap-4 rounded-card border border-border-subtle bg-bg-surface p-6'>
					<h2 className='text-subheading text-text-primary'>Message only</h2>
					{TONES.map(({ tone, message }) => (
						<UIAlert
							key={tone}
							tone={tone}
							message={message}
						/>
					))}
				</section>
			</div>
		</main>
	)
}
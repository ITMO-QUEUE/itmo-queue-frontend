import { useMatch } from 'react-router'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import Logo from '@/assets/Logo.svg'
import { LoginForm } from '@/features/auth/components/LoginForm'

const BENEFITS = [
	'Одна живая очередь',
	'Все работы в одной записи',
	'Понятный статус защиты'
] as const

export const AuthPage = () => {
	const isRegister = Boolean(useMatch('/register'))
	return (
		<main className='h-full w-full overflow-auto bg-bg-page font-nunito'>
			<div className='grid min-h-full lg:grid-cols-[40%_60%]'>
				<section className='flex items-center justify-center px-4 py-10 sm:px-8 lg:order-2'>
	<div className='w-full max-w-[30rem] rounded-card bg-bg-surface p-6 sm:p-8'>
		<img
			src={Logo}
			alt='ITMO.Queue'
			className='mb-7 h-auto w-[11.6875rem]'
		/>

		{isRegister ? (
    <h1 className='text-section text-text-primary'>Регистрация</h1>
) : (
    <h1 className='text-section text-text-primary'>Вход</h1>
)}
		<p className='mt-6 text-small text-text-secondary'>
    {isRegister ? (
        <>Создайте учётную запись для работы с очередями.</>
    ) : (
        <>Войдите в учётную запись, подготовленную администратором.</>
    )}
</p>

		<div className='mt-7'>
			{isRegister ? <RegisterForm /> : <LoginForm />}
		</div>

		{!isRegister && (
    <>
        <p className='mt-6 text-center text-small font-bold text-text-primary'>
            Не получается войти?
        </p>
        <p className='mt-5 text-caption text-text-secondary'>
            Роль назначает администратор. Самостоятельная регистрация не требуется.
        </p>
    </>
)}
	</div>
</section>

				<section className='flex min-h-64 flex-col justify-center bg-action-primary px-6 py-10 text-text-inverse sm:px-10 lg:order-1 lg:min-h-full lg:justify-start lg:px-20 lg:pt-20'>
					<div className='mx-auto w-full max-w-xl lg:mx-0'>
						<p className='text-label tracking-wide text-white/90'>
							ITMO.QUEUE
						</p>

						<h1 className='mt-6 text-heading text-white sm:text-display'>
							Ваше время —
							<br />
							для защиты идей.
						</h1>

						<p className='mt-5 max-w-md text-body text-white/80'>
							Записывайтесь на защиту работ, следите за очередью и приходите
							к своему вызову.
						</p>

						<ul className='mt-7 flex flex-col gap-6'>
							{BENEFITS.map(benefit => (
								<li
									key={benefit}
									className='flex items-center gap-2 text-label text-white'
								>
									<span aria-hidden='true'>✓</span>
									{benefit}
								</li>
							))}
						</ul>
					</div>
				</section>
			</div>
		</main>
	)
}
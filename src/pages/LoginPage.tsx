import Logo from '@/assets/Logo.svg'
import { LoginForm } from '../features/auth/components/LoginForm'

export const LoginPage = () => {
	return (
		<div className='flex h-full w-full overflow-y-auto bg-bg-page font-nunito'>
			<div className='m-auto flex w-full max-w-md flex-col items-center gap-8 px-4 py-10'>
				<img
					src={Logo}
					alt='ITMO.Queue'
					className='h-10 select-none'
					draggable={false}
				/>

				<section className='flex w-full flex-col gap-6 rounded-dialog border border-border-subtle bg-bg-surface p-6 sm:p-8'>
					<div className='flex flex-col gap-1'>
						<h1 className='text-section text-text-primary'>Вход</h1>
						<p className='text-small text-text-secondary'>
							Войдите, чтобы встать в очередь на сдачу или управлять своими
							очередями
						</p>
					</div>

					<LoginForm />
				</section>
			</div>
		</div>
	)
}
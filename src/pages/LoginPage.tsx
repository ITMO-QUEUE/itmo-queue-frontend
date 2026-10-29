import Logo from '@/assets/Logo.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
export const LoginPage = () => {
	return (
		<div className='flex h-full w-full overflow-y-auto bg-c-bg-primary font-nunito'>
			<div className='m-auto flex w-full max-w-md flex-col items-center gap-8 px-4 py-10'>
				<img
					src={ Logo }
					alt='ITMO.Queue'
					className='h-10 select-none'
					draggable={ false }
				/>

				<section className='flex w-full flex-col gap-6 rounded-2xl border border-c-border bg-white p-6 shadow-sm sm:p-8'>
					<div className='flex flex-col gap-1'>
						<h1 className='text-2xl font-bold text-c-text-ink'>Вход</h1>
						<p className='text-sm text-c-text-muted'>
							Войдите, чтобы встать в очередь на сдачу или управлять своими
							очередями
						</p>
					</div>
					<Input placeholder='Номер ИСУ' />
					<Input
						type='password'
						placeholder='Пароль'
					/>
					<Button>Войти</Button>
				</section>
			</div>
		</div>
	)
}

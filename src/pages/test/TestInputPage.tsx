import { useState } from 'react'
import { UIInput } from '../../components/ui/UIInput'

export const TestInputPage = () => {
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [artifact, setArtifact] = useState('') 

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-3xl flex-col gap-8'>
				<header className='space-y-2'>
					<p className='text-small text-text-secondary'>
						Design System / Components
					</p>
					<h1 className='text-heading text-text-primary'>Input Playground</h1>
					<p className='text-body text-text-secondary'>
						Visual testing of input states.
					</p>
				</header>

				<section className='grid gap-6 rounded-card border border-border-subtle bg-bg-surface p-6 md:grid-cols-2'>
					<UIInput
						label='Default'
						value={login}
						onChange={setLogin}
						placeholder='Например, 123456'
						hint='Подпись поля остаётся видимой'
					/>
					<UIInput
						label='Password'
						type='password'
						value={password}
						onChange={setPassword}
						placeholder='Введите пароль'
					/>
										<UIInput
						label='Ссылка на код / артефакт'
						value={artifact}
						onChange={setArtifact}
						placeholder='https://...'
						hint='Ссылка обязательна для каждой выбранной работы.'
						required
					/>
					<UIInput
						label='Error'
						value=''
						onChange={() => undefined}
						placeholder='Номер ИСУ'
						error='Номер ИСУ состоит из 6 цифр'
					/>
					<UIInput
						label='Disabled'
						value='Нельзя изменить'
						onChange={() => undefined}
						disabled
					/>
				</section>

				<p className='text-caption text-text-secondary'>
					Login: «{login}» · Password length: {password.length}
				</p>
			</div>
		</main>
	)
}
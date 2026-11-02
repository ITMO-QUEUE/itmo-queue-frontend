import { useState } from 'react'
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'
import { UIButton, UIButtonTone } from '../../../components/ui/UIButton'
import { UIInput } from '../../../components/ui/UIInput'

interface LoginValues {
	login: string
	password: string
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>

const EMPTY_VALUES: LoginValues = { login: '', password: '' }

const validate = (values: LoginValues): LoginErrors => ({
	login: values.login.trim() ? undefined : 'Введите логин',
	password: values.password ? undefined : 'Введите пароль'
})

export const LoginForm = () => {
	const [values, setValues] = useState(EMPTY_VALUES)
	const [errors, setErrors] = useState<LoginErrors>({})
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (field: keyof LoginValues) => (value: string) => {
		setValues(prev => ({ ...prev, [field]: value }))
		setErrors(prev => ({ ...prev, [field]: undefined }))
		setIsSubmitted(false)
	}

	const handleSubmit = () => {
		const nextErrors = validate(values)
		const hasErrors = Boolean(nextErrors.login || nextErrors.password)
		setErrors(nextErrors)
		setIsSubmitted(!hasErrors)
	}

	return (
		<div className='flex flex-col gap-5'>
			<UIInput
				label='Логин'
				value={values.login}
				onChange={handleChange('login')}
				placeholder='Введите логин'
				error={errors.login}
			/>
			<UIInput
				label='Пароль'
				type='password'
				value={values.password}
				onChange={handleChange('password')}
				placeholder='Введите пароль'
				error={errors.password}
			/>
			{isSubmitted && (
				<UIAlert
					tone={UIAlertTone.INFO}
					message='Форма заполнена. Вход будет подключён к серверу позже.'
				/>
			)}
			<UIButton
				label='Войти'
				tone={UIButtonTone.PRIMARY}
				onClick={handleSubmit}
				fullWidth
			/>
		</div>
	)
}
import { UIAlert, UIAlertTone } from '../../../components/ui/UIAlert'

export const AlertBadCredentials = () => (
	<UIAlert
		message='Неверный логин или пароль. Проверьте данные.'
		title='Не удалось войти'
		tone={ UIAlertTone.ERROR }
	/>
)
export const AlertServiceUnavailable = () => (
	<UIAlert
		message='Попробуйте войти ещё раз через несколько минут.'
		title='Сервис временно недоступен'
		tone={ UIAlertTone.ERROR }
	/>
)
export const AlertAccountBanned = () => (
	<UIAlert
		message='Обратитесь к ответственному за доступ.'
		title='Доступ к аккаунту ограничен'
		tone={ UIAlertTone.WARNING }
	/>
)

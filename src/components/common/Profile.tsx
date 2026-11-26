import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { logout as logoutRequest } from '../../app/api/auth/auth.api.ts'
import { transcribeUserRole } from '../../libs/utils'
import { useAuthStore } from '../../stores/useAuthStore'
import { UIAlert, UIAlertTone } from '../ui/UIAlert.tsx'
import { UIButton, UIButtonTone } from '../ui/UIButton.tsx'
import { Page } from './Page.tsx'

export const Profile = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const user = useAuthStore( state => state.user )
	const logoutFromStore = useAuthStore( state => state.logout )

	const { mutate: handleLogout, isPending } = useMutation( {
		mutationFn: logoutRequest,
		onSettled: () => {
			queryClient.removeQueries( { queryKey: [ 'me' ] } )
			logoutFromStore()
			navigate( '/auth', { replace: true } )
		}
	} )

	if ( ! user ) {
		return null
	}

	const profileFields: [ string, string ][] = [
		[ 'Назначенная роль', transcribeUserRole( user.role ) ],
		[ 'Логин', user.login ],
		[ 'Табельный номер', user.isu ?? 'Не указан' ]
	]

	return (
		<Page
			title='Профиль'
			subtitle='Данные вашей учётной записи'
		>
			<div className='w-full rounded-card border border-border-subtle bg-bg-surface p-6 font-nunito text-text-primary'>
				<div className='mb-4 text-section'>{ user.name }</div>
				<div className='flex flex-col gap-3'>
					{ profileFields.map( ( [ label, value ] ) => (
						<div
							key={ label }
							className='grid grid-cols-[15em_minmax(0,1fr)] items-start'
						>
							<div className='min-w-0 pr-4 text-small text-text-secondary wrap-anywhere'>
								{ label }
							</div>
							<div className='min-w-0 text-label wrap-anywhere'>{ value }</div>
						</div>
					) ) }
				</div>
			</div>
			<div>
				<UIAlert
					tone={ UIAlertTone.INFO }
					message='Для изменения идентификационных данных или решения проблем со входом обратитесь к ответственному за доступ.'
					title='Данные аккаунта задаёт администратор'
				/>
			</div>
			<div>
				<UIButton
					label='Выйти из аккаунта'
					onClick={ () => handleLogout() }
					tone={ UIButtonTone.SECONDARY }
					loading={ isPending }
				/>
			</div>
			<p className='text-small text-text-secondary'>
				Выход не отменяет ваши записи и не закрывает сеансы.
			</p>
		</Page>
	)
}

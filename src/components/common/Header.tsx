import { Bell, UserRound } from 'lucide-react'
import { Link, useMatch } from 'react-router'
import { useAuthStore } from '../../stores/useAuthStore'
import { UIButton, UIButtonTone } from '../ui/UIButton'
import { MyBreadcrumb } from './MyBreadcrumb'

const roleLabels = {
	student: 'Студент',
	teacher: 'Преподаватель',
	admin: 'Администратор'
}

export const Header = () => {
	const user = useAuthStore( state => state.user )
	const isQueuePage = useMatch( '/student/queues/:queueId' )
	const isMyQueuesPage = useMatch( '/student/me/*' )

	if ( isQueuePage || isMyQueuesPage ) {
		return (
			<div className='flex w-full items-center justify-between gap-4 bg-bg-surface px-6 py-4 text-text-primary'>
				<span className='text-subheading'>
					{ isQueuePage ? 'Очередь на защиту' : 'Мои записи' }
				</span>

				<div className='flex shrink-0 items-center gap-6'>
					<UIButton
						label='Уведомления'
						tone={ UIButtonTone.GHOST }
						icon={
							<Bell
								size={ 20 }
								aria-hidden='true'
							/>
						}
						iconOnly
					/>

					<Link
						to='/student/profile'
						className='flex items-center gap-2 text-label'
					>
						<UserRound
							size={ 20 }
							aria-hidden='true'
						/>
						Профиль
					</Link>
				</div>
			</div>
		)
	}

	const name = user?.name ?? 'Джон Дое'
	const shownType = roleLabels[ user?.role ?? 'student' ]
	const initials = name
		.split( ' ' )
		.map( part => part[ 0 ] )
		.join( '' )
		.toUpperCase()

	return (
		<div className='grid w-full grid-cols-2 p-6'>
			<div className='flex justify-start'>
				<MyBreadcrumb />
			</div>

			<div className='flex items-center justify-end gap-6 text-sm text-text-primary'>
				<UIButton
					label='Уведомления'
					tone={ UIButtonTone.GHOST }
					compact
				/>
				<div className='flex items-center justify-center rounded-full bg-bg-selected p-2 font-bold'>
					{ initials }
				</div>
				<span>
					{ name } · { shownType }
				</span>
			</div>
		</div>
	)
}

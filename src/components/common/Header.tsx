import { Bell, UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useAuthStore } from '../../stores/useAuthStore'
import { MyBreadcrumb } from './MyBreadcrumb'
const TRAILING_SLASHES = /\/+$/
export const Header = () => {
	const user = useAuthStore(state => state.user)
	const profilePath = user ? `/${user.role}/profile` : '/auth'
	const { pathname } = useLocation()

	return (
		<div className='flex w-full items-center justify-between gap-4 p-6'>
			{pathname.replace(TRAILING_SLASHES, '') === '/student/queues' ? (
	<span className='text-label text-text-primary'>
		Найти очередь
	</span>
) : (
	<MyBreadcrumb />
)}

			<div className='flex shrink-0 items-center gap-6 text-small text-text-primary'>
				<button
					type='button'
					className='flex cursor-pointer items-center gap-2'
				>
					<Bell size={20} aria-hidden='true' />
					<span>Уведомления</span>
				</button>

				<Link
					to={profilePath}
					className='flex items-center gap-2'
				>
					<UserRound size={20} aria-hidden='true' />
					<span>Профиль</span>
				</Link>
			</div>
		</div>
	)
}
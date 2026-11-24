import { Outlet } from 'react-router'

import HistoryIcon from '@/assets/icons/History.svg'
import HomeIcon from '@/assets/icons/Home.svg'
import ProfileIcon from '@/assets/icons/Profile.svg'
import QueueIcon from '@/assets/icons/Queue.svg'

import { type UserRole, useAuthStore } from '../../stores/useAuthStore'
import { Header } from '../common/Header'
import { Sidebar } from '../common/Sidebar'
import { UINavigationItem } from '../ui/UINavigationItem'

interface NavItemConfig {
	label: string
	path: string
	icon: string
}

const NAVIGATION_BY_ROLE: Record< UserRole, NavItemConfig[] > = {
	student: [
		{
			label: 'Мои записи',
			path: '/student/me/queues',
			icon: HomeIcon
		},
		{
			label: 'Найти очередь',
			path: '/student/queues',
			icon: QueueIcon
		},
		{
			label: 'История',
			path: '/student/history',
			icon: HistoryIcon
		},
		{
			label: 'Профиль',
			path: '/student/profile',
			icon: ProfileIcon
		}
	],
	teacher: [
		{
			label: 'Мои очереди',
			path: '/teacher/queues',
			icon: QueueIcon
		},
		{
			label: 'Профиль',
			path: '/teacher/profile',
			icon: ProfileIcon
		}
	],
	admin: [
		{
			label: 'Пользователи',
			path: '/admin/users',
			icon: ProfileIcon
		},
		{
			label: 'Профиль',
			path: '/admin/profile',
			icon: ProfileIcon
		}
	]
}

export const CommonLayout = () => {
	const me = useAuthStore( state => state.user )
	const navItems = me ? NAVIGATION_BY_ROLE[ me.role ] : []

	return (
		<div className='flex h-screen w-full overflow-hidden'>
			<aside className='h-screen w-60 shrink-0 overflow-hidden'>
				<Sidebar>
					{ navItems.map( item => (
						<UINavigationItem
							key={ item.path }
							label={ item.label }
							path={ item.path }
							icon={ item.icon }
						/>
					) ) }
				</Sidebar>
			</aside>

			<div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
				<header className='shrink-0 overflow-hidden'>
					<Header />
				</header>

				<main className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

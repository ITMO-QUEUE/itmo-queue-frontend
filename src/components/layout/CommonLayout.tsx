import { Outlet } from 'react-router'

import { StudentSidebar } from '../../features/queue-student/components/StudentSidebar'
import { Header } from '../common/Header'

export const CommonLayout = () => {
	return (
		<div className='flex h-screen w-full overflow-hidden'>
			<aside className='h-screen w-60 shrink-0 overflow-hidden'>
				<StudentSidebar />
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

import { Outlet, useLocation } from 'react-router'

import { StudentSidebar } from '../../features/queue-student/components/StudentSidebar'
import { TeacherSidebar } from '../../features/queue-teacher/components/TeacherSidebar'

import { Header } from '../common/Header'

export const CommonLayout = () => {
	const location = useLocation()
	const isStudentRoute = location.pathname.startsWith('/student')

	return (
		<div className='flex h-screen w-full overflow-hidden'>
			<aside className='h-screen w-60 shrink-0 overflow-hidden'>
				{isStudentRoute ?
					<StudentSidebar />
				:	<TeacherSidebar />}
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

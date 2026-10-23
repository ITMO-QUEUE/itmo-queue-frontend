import { createBrowserRouter } from 'react-router'
import { CommonLayout } from '../../components/layout/CommonLayout'
import { LoginPage } from '../../pages/LoginPage'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { StudentDashboard } from '../../pages/student/StudentDashboard'
import { StudentHistoryPage } from '../../pages/student/StudentHistoryPage'
import { StudentProfilePage } from '../../pages/student/StudentProfilePage'
import { StudentQueuesPage } from '../../pages/student/StudentQueuesPage'
import { TeacherDashboard } from '../../pages/teacher/TeacherDashboard'
import { TeacherHistoryPage } from '../../pages/teacher/TeacherHistoryPage'
import { TeacherProfilePage } from '../../pages/teacher/TeacherProfilePage'
import { TeacherQueuesPage } from '../../pages/teacher/TeacherQueuesPage'
import { TeacherSubjectsPage } from '../../pages/teacher/TeacherSubjectsPage'

export const router = createBrowserRouter([
	{
		path: '/',
		Component: LoginPage
	},
	{
		path: 'login',
		Component: LoginPage
	},
	{
		path: 'student',
		Component: CommonLayout,
		children: [
			{
				index: true,
				Component: StudentDashboard
			},
			{
				path: 'queues',
				Component: StudentQueuesPage
			},
			{
				path: 'profile',
				Component: StudentProfilePage
			},
			{
				path: 'history',
				Component: StudentHistoryPage
			}
		]
	},
	{
		path: 'teacher',
		Component: CommonLayout,
		children: [
			{
				index: true,
				Component: TeacherDashboard
			},
			{
				path: 'queues',
				Component: TeacherQueuesPage
			},
			{
				path: 'profile',
				Component: TeacherProfilePage
			},
			{
				path: 'history',
				Component: TeacherHistoryPage
			},
			{
				path: 'subjects',
				Component: TeacherSubjectsPage
			}
		]
	},
	{
		path: '*',
		Component: NotFoundPage
	}
])

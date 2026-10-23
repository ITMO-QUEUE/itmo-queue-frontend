import { createBrowserRouter } from 'react-router'
import { CommonLayout } from '../../components/layout/CommonLayout'
import { LoginPage } from '../../pages/LoginPage'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { StudentDashboard } from '../../pages/student/StudentDashboard'
import { StudentHistoryPage } from '../../pages/student/StudentHistoryPage'
import { StudentProfilePage } from '../../pages/student/StudentProfilePage'
import { StudentQueuesPage } from '../../pages/student/StudentQueuesPage'
import { TeacherDashboard } from '../../pages/teacher/TeacherDashboard'

export const router = createBrowserRouter( [
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
			}
		]
	},
	{
		path: '*',
		Component: NotFoundPage
	}
] )

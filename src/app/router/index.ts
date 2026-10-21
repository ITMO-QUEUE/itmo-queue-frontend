import { createBrowserRouter } from 'react-router'
import { CommonLayout } from '../../components/layout/CommonLayout'
import { LoginPage } from '../../pages/LoginPage'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { StudentDashboard } from '../../pages/student/StudentDashboard'
import { TeacherDashboard } from '../../pages/teacher/TeacherDashboard'

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
])

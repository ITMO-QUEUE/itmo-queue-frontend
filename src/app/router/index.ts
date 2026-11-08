import { createBrowserRouter, type RouteObject } from 'react-router'

import { AuthPage } from '@/pages/AuthPage'
import { CommonLayout } from '../../components/layout/CommonLayout'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { StudentDashboard } from '../../pages/student/StudentDashboard'
import { StudentHistoryPage } from '../../pages/student/StudentHistoryPage'
import { StudentProfilePage } from '../../pages/student/StudentProfilePage'
import { StudentQueuePage } from '../../pages/student/StudentQueuePage'
import { StudentQueuesPage } from '../../pages/student/StudentQueuesPage'
import { TeacherDashboard } from '../../pages/teacher/TeacherDashboard'
import { TeacherProfilePage } from '../../pages/teacher/TeacherProfilePage'
import { TeacherQueuePage } from '../../pages/teacher/TeacherQueuePage'
import { TeacherQueuesPage } from '../../pages/teacher/TeacherQueuesPage'
import { TeacherSubjectsPage } from '../../pages/teacher/TeacherSubjectsPage'
import { TestAlertPage } from '../../pages/test/TestAlertPage'
import { TestButtonPage } from '../../pages/test/TestButtonPage'
import { TestCheckboxPage } from '../../pages/test/TestCheckboxPage'
import { TestDialogPage } from '../../pages/test/TestDialogPage'
import { TestInputPage } from '../../pages/test/TestInputPage'
import { TestNumberfieldPage } from '../../pages/test/TestNumberfieldPage'
import { TestQueueCardPage } from '../../pages/test/TestQueueCardPage'
import { TestQueueRowPage } from '../../pages/test/TestQueueRowPage'
import { TestQueueStatus } from '../../pages/test/TestQueueStatus'
import { TestSelectPage } from '../../pages/test/TestSelectPage'
import { TestTeacherParametersPage } from '../../pages/test/TestTeacherParametersPage'

const routes: RouteObject[] = [
	{
		path: '/',
		Component: AuthPage
	},
	{
		path: 'auth',
		Component: AuthPage
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
				Component: StudentQueuesPage,
				children: [
					{
						path: ':queueId',
						Component: StudentQueuePage
					}
				]
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
				Component: TeacherQueuesPage,
				children: [
					{
						path: ':queueId',
						Component: TeacherQueuePage
					}
				]
			},
			{
				path: 'profile',
				Component: TeacherProfilePage
			},
			{
				path: 'subjects',
				Component: TeacherSubjectsPage
			}
		]
	}
]

const testRoutes: RouteObject[] | null =
	import.meta.env.DEV ?
		[	
			{
				path: 'test',
				children: [
					{
						path: 'button',
						Component: TestButtonPage
					},
					{
						path: 'queue-row',
						Component: TestQueueRowPage
					},
					{
						path: 'checkbox',
						Component: TestCheckboxPage
					},
					{
						path: 'input',
						Component: TestInputPage
					},
					{
						path: 'select',
						Component: TestSelectPage
					},
					{
						path: 'alert',
						Component: TestAlertPage
					},
					{
						path: 'numberfield',
						Component: TestNumberfieldPage
					},
					{
						path: 'dialog',
						Component: TestDialogPage
					},
					{
						path: 'parameters',
						Component: TestTeacherParametersPage
					},
					{
						path: 'queue-card',
						Component: TestQueueCardPage
					},
					{
						path: 'queue-status',
						Component: TestQueueStatus
					}
				]
			}
		]
	:	null

if (testRoutes) {
	routes.push(...testRoutes)
}

routes.push({
	path: '*',
	Component: NotFoundPage
})

export const router = createBrowserRouter(routes)

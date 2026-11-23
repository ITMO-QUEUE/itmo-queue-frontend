import { createBrowserRouter, type RouteObject } from 'react-router'

import { AuthPage } from '@/pages/AuthPage'
import { Profile } from '../../components/common/Profile'
import { CommonLayout } from '../../components/layout/CommonLayout'
import { AdminUsersPage } from '../../pages/admin/AdminUsersPage'
import { NotFoundPage } from '../../pages/NotFoundPage'
import { StudentActiveQueuesPage } from '../../pages/student/StudentActiveQueuesPage'
import { StudentHistoryPage } from '../../pages/student/StudentHistoryPage'
import { StudentQueuePage } from '../../pages/student/StudentQueuePage'
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
import { TestTabPage } from '../../pages/test/TestTabPage'
import { TestTeacherParametersPage } from '../../pages/test/TestTeacherParametersPage'
import { GuestOnlyRoute, ProtectedRoute } from './ProtectedRoute'
import { AdminCreateUserPage } from '../../pages/admin/AdminCreateUserPage' 
import { StudentQueuesPage } from '../../pages/student/StudentQueuesPage'

const routes: RouteObject[] = [
		{
		element: <GuestOnlyRoute />,
		children: [
			{
				path: '/',
				Component: AuthPage
			},
			{
				path: 'auth',
				Component: AuthPage
			}
		]
	},
		{
		element: <ProtectedRoute allowedRoles={ [ 'student' ] } />,
		children: [
			{
				path: 'student',
				Component: CommonLayout,
				children: [
					{
						path: 'me',
						children: [
							{
								path: 'queues',
								index: true,
								Component: StudentActiveQueuesPage
							},
							{
								path: '*',
								Component: StudentActiveQueuesPage
							}
						]
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
						Component: Profile
					},
					{
						path: 'history',
						Component: StudentHistoryPage
					},
					{
						path: '*',
						Component: StudentActiveQueuesPage
					}
				]
			}
		]
	},

	{
		element: <ProtectedRoute allowedRoles={ [ 'teacher' ] } />,
		children: [
			{
				path: 'teacher',
				Component: CommonLayout,
				children: [
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
						Component: Profile
					},
					{
						path: 'subjects',
						Component: TeacherSubjectsPage
					},
					{
						path: '*',
						Component: TeacherQueuesPage
					}
				]
			}
		]
	},
	{
		element: <ProtectedRoute allowedRoles={ [ 'admin' ] } />,
		children: [
			{
				path: 'admin',
				Component: CommonLayout,
				children: [
					{
						path: 'users',
						Component: AdminUsersPage,
						index: true
					},
					{
						path: 'profile',
						Component: Profile
					},
					{
						path: 'users/create',
						Component: AdminCreateUserPage
					},
					{
						path: '*',
						Component: AdminUsersPage
					}
				]
			}
		]
	}
]

const testRoutes: RouteObject[] | null = import.meta.env.DEV
	? [
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
					},
					{
						path: 'tab',
						Component: TestTabPage
					}
				]
			}
		]
	: null

if ( testRoutes ) {
	routes.push( ...testRoutes )
}

routes.push( {
	path: '*',
	Component: NotFoundPage
} )

export const router = createBrowserRouter( routes )

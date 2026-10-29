import ProfileIcon from '@/assets/icons/Profile.svg'

import { Sidebar } from '../../../components/common/Sidebar'
import { SidebarOption } from '../../../components/common/SidebarOption'

// TODO: добавить иконки для каждой страницы
// TODO: добавить страницы для каждой ссылки в сайдбаре
export const TeacherSidebar = () => {
	return (
		<Sidebar>
			<SidebarOption
				icon={ProfileIcon}
				to='/teacher/queues'
				text='Очереди'
			/>
			<SidebarOption
				icon={ProfileIcon}
				to='/teacher/subjects'
				text='Мои занятия'
			/>
			<SidebarOption
				icon={ProfileIcon}
				to='/teacher/history'
				text='История'
			/>
			<SidebarOption
				icon={ProfileIcon}
				to='/teacher/profile'
				text='Настройки'
			/>
		</Sidebar>
	)
}

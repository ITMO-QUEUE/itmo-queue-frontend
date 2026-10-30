import ProfileIcon from '@/assets/icons/Profile.svg'
import QueueIcon from '@/assets/icons/Queue.svg'
import { Sidebar } from '../../../components/common/Sidebar'
import { UINavigationItem } from '../../../components/ui/UINavigationItem'

// TODO: добавить страницы для каждой ссылки в сайдбаре
export const TeacherSidebar = () => {
	return (
		<Sidebar>
			<UINavigationItem
				icon={QueueIcon}
				path='/teacher/queues'
				label='Мои очереди'
			/>
			<UINavigationItem
				icon={ProfileIcon}
				path='/teacher/profile'
				label='Профиль'
			/>
		</Sidebar>
	)
}

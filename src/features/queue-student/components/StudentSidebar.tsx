import HistoryIcon from '@/assets/icons/History.svg'
import HomeIcon from '@/assets/icons/Home.svg'
import ProfileIcon from '@/assets/icons/Profile.svg'
import QueueIcon from '@/assets/icons/Queue.svg'

import { Sidebar } from '../../../components/common/Sidebar'
import { UINavigationItem } from '../../../components/ui/UINavigationItem'

export const StudentSidebar = () => {
	return (
		<Sidebar>
			<UINavigationItem
				label='Мои записи'
				path='/student'
				icon={HomeIcon}
			/>
			<UINavigationItem
				label='Найти очередь'
				path='/student/queues'
				icon={QueueIcon}
			/>
			<UINavigationItem
				label='История'
				path='/student/history'
				icon={HistoryIcon}
			/>
			<UINavigationItem
				label='Профиль'
				path='/student/profile'
				icon={ProfileIcon}
			/>
		</Sidebar>
	)
}

import HistoryIcon from '@/assets/icons/History.svg'
import HomeIcon from '@/assets/icons/Home.svg'
import ProfileIcon from '@/assets/icons/Profile.svg'
import QueueIcon from '@/assets/icons/Queue.svg'

import { Sidebar } from '../../../components/common/Sidebar'
import { SidebarOption } from '../../../components/common/SidebarOption'

export const StudentSidebar = () => {
	return (
		<Sidebar>
			<SidebarOption
				icon={HomeIcon}
				to='/student'
				text='Главная'
			/>
			<SidebarOption
				icon={QueueIcon}
				to='/student/queues'
				text='Мои очереди'
			/>
			<SidebarOption
				icon={HistoryIcon}
				to='/student/history'
				text='История'
			/>
			<SidebarOption
				icon={ProfileIcon}
				to='/student/profile'
				text='Личный кабинет'
			/>
		</Sidebar>
	)
}

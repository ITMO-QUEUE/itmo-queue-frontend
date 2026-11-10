import { useState } from 'react'
import { Page } from '../../components/common/Page.tsx'
import { UITab } from '../../components/ui/UITab'

const TABS = [
		{ id: 'current', label: 'Текущие', subtitle: 'Все сеансы, в которых вы назначены преподавателем' },
		{ id: 'archive', label: 'Завершенные', subtitle: 'Завершённые доступные вам сеансы' }
	] as const

const SerachParams = [
	{ id: 'discipline', label: 'Дисциплина' },
	{ id: 'date', label: 'Дата' }
	{ id: 'stage', label: 'Этап сеанс' }
] as const

export const TeacherQueuesPage = () => {

	const [activeTab, setActiveTab] = useState<string>('current')
	
	const handleClick = (id: string) => {
		setActiveTab(id)
	}

	return (
		<Page
			title='Мои очереди'
			subtitle={TABS.find(tab => tab.id === activeTab)?.subtitle}
			sidebutton='create-queue'
		>	
			<div className='flex flex-wrap gap-2'>
				{TABS.map(tab => (
					<UITab
						key={tab.id}
						label={tab.label}
						active={activeTab === tab.id}
						onClick={() => handleClick(tab.id)}
					/>
				))}
			</div>
		</Page>

		

	)
	
}

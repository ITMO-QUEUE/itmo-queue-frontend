import { useState } from 'react'
import { Page } from '../../components/common/Page.tsx'
import { UITab } from '../../components/ui/UITab'
import { UISelect, type UISelectOption } from '../../components/ui/UISelect'

const TABS = [
		{ id: 'current', label: 'Текущие', subtitle: 'Все сеансы, в которых вы назначены преподавателем' },
		{ id: 'archive', label: 'Завершенные', subtitle: 'Завершённые доступные вам сеансы' }
	]

const SUBJECTS: UISelectOption[] = [
	{ value: 'math', label: 'Математический анализ' },
	{ value: 'algebra', label: 'Алгебра и структуры данных' },
	{ value: 'programming', label: 'Программирование' },
	{ value: '', label: 'Очистить фильтр' }
]

const STAGES: UISelectOption[] = [
	{ value: 'pre', label: 'Предварительная запись' },
	{ value: 'active', label: 'Активная защита' },
	{ value: 'done', label: 'Завершён' },
	{ value: '', label: 'Очистить фильтр' }
]

const TIME: UISelectOption[] = [
	{ value: '14:00', label: '14:00' },
	{ value: '15:30', label: '15:30' },
	{ value: '', label: 'Очистить фильтр' }

]

export const TeacherQueuesPage = () => {

	const [activeTab, setActiveTab] = useState<string>('current')
	const [subject, setSubject] = useState<string>('')
	const [stage, setStage] = useState<string>('')
	const [time, setTime] = useState<string>('')

	const searchParams = [
		{
			id: 'discipline',
			label: 'Дисциплина',
			placeholder: 'Выберите дисциплину',
			options: SUBJECTS,
			value: subject,
			onChange: setSubject
		},
		{
			id: 'time',
			label: 'Время',
			placeholder: 'Выберите время',
			options: TIME,
			value: time,
			onChange: setTime
		},
		{
			id: 'stage',
			label: 'Этап сеанса',
			placeholder: 'Выберите этап',
			options: STAGES,
			value: stage,
			onChange: setStage
		}
	]
	
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

			{activeTab === 'current' && <div>

				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{searchParams.map(searchParam => (
						<UISelect
							key={searchParam.id}
							label={searchParam.label}
							value={searchParam.value}
							options={searchParam.options}
							placeholder={searchParam.placeholder}
							onChange={searchParam.onChange}
						/>
					))} 
				</div>
			</div>	
			}

			{activeTab === 'archive' && <div>
				<p>
					Тестовая штука для archive
				</p>
			</div>	
			}
				
			
		</Page>

		

	)
	
}

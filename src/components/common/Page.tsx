import { useNavigate } from 'react-router'
import { openCreateQueueDialog } from '../../libs/utils'
import { UIButton, UIButtonTone } from '../ui/UIButton'

export interface PageProps {
	children: React.ReactNode
	title: string
	subtitle?: string
	sidebutton?: 'find-queue' | 'create-queue'
}

export const Page = ({ children, title, subtitle, sidebutton }: PageProps) => {
	const navigate = useNavigate()

	return (
		<div className='bg-bg-page flex flex-col w-full h-auto min-h-full p-content gap-6'>
			<div className='flex items-center justify-between'>
				<div className='flex flex-col gap-4'>
					<h1 className='text-heading '>{title}</h1>
					{subtitle && (
						<p className='text-small text-text-secondary'>{subtitle}</p>
					)}
				</div>
				{sidebutton === 'find-queue' && (
					<UIButton
						label='Найти очередь'
						onClick={() => navigate('/student/queues')}
						tone={UIButtonTone.PRIMARY}
					/>
				)}
				{sidebutton === 'create-queue' && (
					<UIButton
						label='Создать очередь'
						onClick={openCreateQueueDialog}
						tone={UIButtonTone.PRIMARY}
					/>
				)}
			</div>
			{children}
		</div>
	)
}

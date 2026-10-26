import { Link, useLocation } from 'react-router'

interface SidebarOptionProps {
	icon: string
	text: string
	to: string
	alt?: string
}

export const SidebarOption = ({ icon, text, alt, to }: SidebarOptionProps) => {
	const location = useLocation()
	const isActive = location.pathname === to

	return (
		<Link
			to={to}
			draggable={false}
			className={`flex gap-2 items-center w-full h-auto  justify-start   p-3 cursor-pointer ${
				isActive ?
					'bg-bg-selected rounded-lg text-action-primary'
				:	'text-text-secondary'
			}`}
		>
			<img
				src={icon}
				alt={alt ?? text}
				className='size-icon shrink-0 select-none'
				draggable={false}
			/>
			<span className='font-bold font-nunito text-sm whitespace-nowrap'>
				{text}
			</span>
		</Link>
	)
}

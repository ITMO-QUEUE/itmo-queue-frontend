import { Link, useLocation } from 'react-router'

interface SidebarOptionProps {
	icon: string
	text: string
	to: string
	alt?: string
}

export const SidebarOption = ( {
	icon,
	text,
	alt,
	to
}: SidebarOptionProps ) => {
	const location = useLocation()
	const isActive = location.pathname === to

	return (
		<Link
			to={ to }
			className={ `flex gap-2 items-center w-full h-auto  justify-start   p-3 cursor-pointer ${
				isActive ? 'bg-c-bg-foam rounded-lg text-c-accent' : 'text-c-text-muted'
			}` }
		>
			<img
				src={ icon }
				alt={ alt ?? text }
				className='w-4 h-4 shrink-0'
			/>
			<span className='font-bold font-nunito text-sm whitespace-nowrap'>
				{ text }
			</span>
		</Link>
	)
}

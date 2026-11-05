import { Link, useLocation } from 'react-router'
import { tw } from '../../libs/utils'

interface UINavigationItemProps {
	label: string
	path: string
	icon: string
}

const BASE_CLASSES = tw(
	'flex gap-3 items-center justify-start',
	'w-full h-auto p-3',
	'cursor-pointer',
	'rounded-control',
	'text-label',
	'hover:bg-bg-selected'
)
const ICON_CLASSES = tw('size-icon shrink-0 select-none')
const ACTIVE_CLASSES = tw('bg-bg-selected text-action-primary')

export const UINavigationItem = ({
	label,
	path,
	icon
}: UINavigationItemProps) => {
	const location = useLocation()
	const isActive = location.pathname === path

	return (
		<Link
			to={path}
			draggable={false}
			className={`${BASE_CLASSES} ${isActive ? ACTIVE_CLASSES : 'bg-transparent'}`}
		>
			<img
				src={icon}
				alt={label}
				className={ICON_CLASSES}
				draggable={false}
			/>
			<span>{label}</span>
		</Link>
	)
}

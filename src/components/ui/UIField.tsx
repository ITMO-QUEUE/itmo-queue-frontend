import { tw } from '../../libs/utils'

interface UIFieldLabelProps {
	htmlFor: string
	label: string
	required?: boolean
}

export const UIFieldLabel = ({
	htmlFor,
	label,
	required = false
}: UIFieldLabelProps) => (
	<label
		htmlFor={htmlFor}
		className='text-label text-text-primary'
	>
		{label}
		{required && <span aria-hidden='true'> *</span>}
	</label>
)

interface UIFieldHelperProps {
	id: string
	error?: string
	hint?: string
}

export const UIFieldHelper = ({ id, error, hint }: UIFieldHelperProps) => {
	const text = error ?? hint

	if (!text) {
		return null
	}

	return (
		<p
			id={id}
			className={tw(
				'text-caption',
				error ? 'text-status-danger' : 'text-text-secondary'
			)}
		>
			{text}
		</p>
	)
}

export const getHelperId = (id: string, error?: string, hint?: string) =>
	error || hint ? `${id}-helper` : undefined
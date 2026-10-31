import { useState } from 'react'
import { UISelect, type UISelectOption } from '../../components/ui/UISelect'

const SUBJECTS: UISelectOption[] = [
	{ value: 'math', label: 'Математический анализ' },
	{ value: 'algebra', label: 'Алгебра и структуры данных' },
	{ value: 'programming', label: 'Программирование' }
]

const STAGES: UISelectOption[] = [
	{ value: 'pre', label: 'Предварительная запись' },
	{ value: 'active', label: 'Активная защита' },
	{ value: 'done', label: 'Завершён' }
]

export const TestSelectPage = () => {
	const [subject, setSubject] = useState('')
	const [stage, setStage] = useState('active')

	return (
		<main className='h-full w-full overflow-auto bg-bg-page p-6 md:p-10'>
			<div className='mx-auto flex max-w-3xl flex-col gap-8'>
				<header className='space-y-2'>
					<p className='text-small text-text-secondary'>
						Design System / Components
					</p>
					<h1 className='text-heading text-text-primary'>Select Playground</h1>
					<p className='text-body text-text-secondary'>
						Visual testing of select states.
					</p>
				</header>

				<section className='grid gap-6 rounded-card border border-border-subtle bg-bg-surface p-6 md:grid-cols-2'>
					<UISelect
						label='Default (empty)'
						value={subject}
						onChange={setSubject}
						options={SUBJECTS}
						placeholder='Выберите дисциплину'
					/>
					<UISelect
						label='With value'
						value={stage}
						onChange={setStage}
						options={STAGES}
					/>
					<UISelect
						label='Error'
						value=''
						onChange={() => undefined}
						options={SUBJECTS}
						placeholder='Выберите дисциплину'
						error='Выберите дисциплину'
					/>
					<UISelect
						label='Disabled'
						value='done'
						onChange={() => undefined}
						options={STAGES}
						disabled
					/>
				</section>

				<p className='text-caption text-text-secondary'>
					Subject: «{subject}» · Stage: «{stage}»
				</p>
			</div>
		</main>
	)
}
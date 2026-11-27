import { isAxiosError } from 'axios'

const queueErrorMessages: Record< string, string > = {
	'Start the session before calling students':
		'Сначала начните активную защиту, затем вызывайте студентов.',
	'Finish your current attempt first':
		'Сначала завершите текущую защиту. Она может быть открыта в другом сеансе.',
	'No available waiting students': 'Нет доступных студентов в ожидании.',
	'Student is already assigned': 'Студент уже вызван к преподавателю.',
	'Student has a current attempt in another session; retry next call':
		'Студент уже защищается в другом сеансе. Вызовите следующего.',
	'Not assigned to this session':
		'Вы не назначены преподавателем этого сеанса.',
	'Teacher access required': 'Для этого действия нужны права преподавателя.',
	'Session not found': 'Сеанс не найден.',
	'Session is finished': 'Сеанс уже завершён.',
	'Only preliminary sessions can be activated':
		'Начать защиту можно только для сеанса с предварительной записью.',
	'Only the receiving teacher can start this defense':
		'Начать защиту может только преподаватель, вызвавший студента.',
	'Only the receiving teacher can evaluate this attempt':
		'Оценить работу может только принимающий преподаватель.',
	'Attempt is already closed': 'Эта попытка защиты уже завершена.',
	'Start the defense before recording results':
		'Перед сохранением результатов начните защиту студента.',
	'Results must refer to enrolled works':
		'Оценки можно выставлять только за работы из записи студента.'
}

export const getQueueErrorMessage = (
	error: unknown,
	fallback = 'Не удалось выполнить действие. Попробуйте ещё раз.'
): string => {
	if ( ! isAxiosError< { detail?: unknown } >( error ) ) {
		return error instanceof Error ? error.message : fallback
	}
	if ( ! error.response ) {
		return 'Не удалось связаться с сервером. Проверьте соединение и повторите попытку.'
	}
	if ( error.response.status === 401 ) return 'Сессия истекла. Войдите снова.'
	const detail = error.response.data?.detail
	if ( typeof detail === 'string' && detail.trim() ) {
		return queueErrorMessages[ detail ] ?? detail
	}
	if ( Array.isArray( detail ) ) {
		const messages = detail.flatMap( item =>
			item && typeof item.msg === 'string' ? [ item.msg ] : []
		)
		if ( messages.length ) return `Проверьте данные: ${ messages.join( '; ' ) }`
	}
	return `${ fallback } (HTTP ${ error.response.status })`
}

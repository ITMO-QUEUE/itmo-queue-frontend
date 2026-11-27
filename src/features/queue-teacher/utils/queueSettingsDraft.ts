import type {
	SessionRead,
	SessionUpdate
} from '../../../app/api/queues/queues.api.d'

export interface QueueSettingsDraft {
	minutesPerStudent: string
	quota: string
	endTime: string
	plannedEnd: string
	works: { id: string; work_id: string; title?: string; priority: string }[]
}

const formatTime = ( value: string ) => {
	const date = new Date( value )
	return `${ String( date.getHours() ).padStart( 2, '0' ) }:${ String( date.getMinutes() ).padStart( 2, '0' ) }`
}

export const createQueueSettingsDraft = (
	queue: SessionRead
): QueueSettingsDraft => ( {
	minutesPerStudent:
		queue.avg_duration_min === null ? '' : String( queue.avg_duration_min ),
	quota: queue.quota === null ? '' : String( queue.quota ),
	endTime: formatTime( queue.planned_end ),
	plannedEnd: queue.planned_end,
	works: [ ...queue.works ]
		.sort( ( a, b ) => a.priority - b.priority )
		.map( work => ( {
			id: work.work_id,
			work_id: work.work_id,
			priority: String( work.priority )
		} ) )
} )

const INTEGER_PATTERN = /^\d+$/
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

const positiveInteger = ( value: string, label: string ): number => {
	if (
		! INTEGER_PATTERN.test( value ) ||
		! Number.isSafeInteger( Number( value ) ) ||
		Number( value ) <= 0
	) {
		throw new Error( `${ label }: укажите положительное целое число.` )
	}
	return Number( value )
}

export const toQueueSettingsPayload = (
	draft: QueueSettingsDraft,
	plannedStart: string,
	workTitles: ReadonlyMap< string, string >
): SessionUpdate => {
	if ( ! TIME_PATTERN.test( draft.endTime ) ) {
		throw new Error( 'Укажите плановое окончание в формате ЧЧ:ММ.' )
	}
	const end = new Date( draft.plannedEnd )
	const [ hours, minutes ] = draft.endTime.split( ':' ).map( Number )
	if ( draft.endTime !== formatTime( draft.plannedEnd ) )
		end.setHours( hours, minutes, 0, 0 )
	if ( ! Number.isFinite( end.getTime() ) || end <= new Date( plannedStart ) ) {
		throw new Error( 'Окончание сеанса должно быть позже его начала.' )
	}
	return {
		avg_duration_min:
			draft.minutesPerStudent === ''
				? null
				: positiveInteger( draft.minutesPerStudent, 'Время на студента' ),
		quota:
			draft.quota === ''
				? null
				: positiveInteger( draft.quota, 'Квота сеанса' ),
		planned_end: end.toISOString(),
		works: draft.works.map( work => {
			if ( ! ( work.title ?? workTitles.get( work.work_id ) )?.trim() ) {
				throw new Error(
					'Название каждой работы обязательно. Заполните название или дождитесь загрузки списка работ.'
				)
			}
			return {
				work_id: work.work_id,
				priority: positiveInteger( work.priority, 'Приоритет работы' )
			}
		} )
	}
}

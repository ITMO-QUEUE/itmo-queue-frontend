export { cn } from 'cn'

/*
Add the following to your VSCode settings.json to enable tailwindCSS class name autocompletion for the tw() function:

"tailwindCSS.classFunctions": ["tw"]
*/
export const tw = (
	...classes: ( string | undefined | null | false )[]
): string => classes.filter( Boolean ).join( ' ' )

export const openCreateQueueDialog = () => {
	// TODO: открыть модалку с формой создания очереди для преподавателя
	return
}

export const openCreateUserDialog = () => {
	// TODO: открыть модалку с формой создания преподавателя
	return
}

export const transcribeUserRole = ( role: string ) => {
	switch ( role ) {
		case 'teacher':
			return 'Преподаватель'
		case 'admin':
			return 'Администратор'
		case 'student':
			return 'Студент'
		default:
			throw new Error( 'User role unknown' )
	}
}

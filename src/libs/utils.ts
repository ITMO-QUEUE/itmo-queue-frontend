export { cn } from 'cn'

/*
Add the following to your VSCode settings.json to enable tailwindCSS class name autocompletion for the tw() function:

"tailwindCSS.classFunctions": ["tw"]
*/
export const tw = (...classes: string[]): string =>
	classes.filter(Boolean).join(' ')

export const openCreateQueueDialog = () => {
	// TODO: открыть модалку с формой создания очереди для преподавателя
	return
}

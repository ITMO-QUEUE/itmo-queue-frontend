export { cn } from 'cn'

/*
Add the following to your VSCode settings.json to enable tailwindCSS class name autocompletion for the tw() function:

"tailwindCSS.experimental.classRegex": [
		["tw\\(([^)]*)\\)", "'([^']*)'|\"([^\"]*)\"|`([^`]*)`"]
	]
*/
export const tw = (classes: string): string =>
	classes.split(' ').filter(Boolean).join(' ')

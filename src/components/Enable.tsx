import { createMemo, createContext, useContext, JSX } from 'solid-js'

const EnabledContext = createContext<() => boolean>(() => true)

/**
 * Use `<Enable>` to provide containers.
 * Inject as `const enabled = useEnabled()` for templates and scripts.
 * In CSS, use `&:disabled` for form controls and `:disabled &` for others.
 */
export const useEnabled = () => useContext(EnabledContext)

export function Enable(props: {
	children?: JSX.Element,
	if?: boolean,
}) {
	const parentEnabled = useEnabled()
	const enabled = createMemo(() => parentEnabled() && (props.if ?? true))
	return <EnabledContext.Provider value={enabled}>
		<fieldset class="pass-through" disabled={!enabled()}>
			{props.children}
		</fieldset>
	</EnabledContext.Provider>
}

// https://www.rfc-editor.org/rfc/rfc6901

export function tilde(x: string) {
  return x.replaceAll('~', '~0').replaceAll('/', '~1')
}

export function untilde(x: string) {
  return x.replace(/~[01]/g, x => x == '~1' ? '/' : '~')
}

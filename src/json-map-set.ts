export function replacer(_key: string, value: any) {
  if (value instanceof Map) return {
    $type: 'map',
    value: Object.fromEntries(value),
  }
  if (value instanceof Set) return {
    $type: 'set',
    value: [...value],
  }
  return value
}

export function reviver(_key: string, value: any) {
  if (typeof value === 'object' && value && value.$type) {
    if (value.$type === 'map') return new Map(Object.entries(value.value))
    if (value.$type === 'set') return new Set(value.value)
    throw new Error('invalid $type encountered in JSON input')
  } else {
    return value
  }
}

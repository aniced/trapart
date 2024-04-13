// SchemaType is modelled loosely after JSON Schema.
// However, we do not support union types ("anyOf").
interface SchemaTypeCommonProperties {
  type: string,
  title?: string,
  description?: string,
  control?: string,
}

type SchemaSomeType = SchemaTypeCommonProperties & ({
  type: "boolean" | "any" | "never",
} | {
  type: "string",
  minLength: number,
  maxLength: number,
  multiline: boolean,
  format?: "url" | "regex" | "date" | "uuid",
  examples: string[],
} | {
  // TODO: add type "enum"
} & never | {
  type: "number",
  minimum: number,
  maximum: number,
  decimalPlaces: number,
} | {
  type: "array",
  items: Schema,
} | {
  type: "map",
  items: Schema,
  propertyNames: string[],
} | {
  type: "object",
  properties: { [key: string]: Schema },
})

// For the #1 common use case of union types, (T | null), a dedicated optional<T> type (where T is not an optional type) is provided.
// Consequently, the null type is represented as optional<never>.
// undefined and null are not distinguished from each other.
export type Schema = SchemaSomeType | SchemaTypeCommonProperties & {
  type: "optional",
  items: SchemaSomeType,
}

export function optional(type: Schema): Schema {
  return type.type === "optional" ? type : { type: "optional", items: type }
}

export function unifyType(a: Schema, b: Schema): Schema {
  if (a.type === b.type) {
    if (a.type === "boolean" || a.type === "any" || a.type == "never") {
      return a
    } else if (a.type === "string") {
      // TypeScript can't narrow types with an equality assumption (a.type === b.type).
      if (b.type !== "string") throw new Error("impossible")
      return {
        type: "string",
        minLength: Math.min(a.minLength, b.minLength),
        maxLength: Math.max(a.maxLength, b.maxLength),
        multiline: a.multiline || b.multiline,
        format: a.format === b.format ? a.format : undefined,
        examples: a.examples.concat(b.examples),
      }
    } else if (a.type === "number") {
      if (b.type !== "number") throw new Error("impossible")
      return {
        type: "number",
        minimum: Math.min(a.minimum, b.minimum),
        maximum: Math.max(a.maximum, b.maximum),
        decimalPlaces: Math.max(a.decimalPlaces, b.decimalPlaces),
      }
    } else if (a.type === "array") {
      if (b.type !== "array") throw new Error("impossible")
      return {
        type: "array",
        items: unifyType(a.items, b.items),
      }
    } else if (a.type === "map") {
      if (b.type !== "map") throw new Error("impossible")
      return {
        type: "map",
        items: unifyType(a.items, b.items),
        propertyNames: [...a.propertyNames, ...b.propertyNames],
      }
    } else if (a.type === "optional") {
      if (b.type !== "optional") throw new Error("impossible")
      return optional(unifyType(a.items, b.items))
    } else if (a.type === "object") {
      if (b.type !== "object") throw new Error("impossible")
      const properties: { [key: string]: Schema } = Object.create(null)
      let numberOfCommonProperties = 0
      for (const [key, aType] of Object.entries(a.properties)) {
        const bType = b.properties[key]
        if (bType) {
          const unifiedType = unifyType(aType, bType)
          properties[key] = unifiedType
          if (unifiedType.type !== "any") numberOfCommonProperties++
        } else {
          properties[key] = optional(aType)
        }
      }
      for (const [key, type] of Object.entries(b.properties)) {
        if (!Object.hasOwn(properties, key)) {
          properties[key] = optional(type)
        }
      }
      if (numberOfCommonProperties / Object.keys(properties).length < 3 / 4) {
        return { type: "any" }
      }
      return {
        type: "object",
        properties,
      }
    }
    // TypeScript can't conclude that we have exhausted every possible type for `a` here.
    throw new Error("impossible")
  } else {
    // Beware: the order of the following conditionals is important.
    // For example, (any | never) is any, not never.
    if (a.type === "any") return a
    if (b.type === "any") return b
    if (a.type === "never") return b
    if (b.type === "never") return a
    if (a.type === "optional") return optional(unifyType(a.items, b))
    if (b.type === "optional") return optional(unifyType(a, b.items))
    if (a.type === "map" && b.type === "object") {
      const tmp = a
      a = b
      b = tmp
    }
    if (a.type === "object" && b.type === "map") {
      if (!a.properties.size) return b
      // TODO: unify into map if the object and the map have the same value type
    }
    return { type: "any" }
  }
}

function inferTypeInternal(x: unknown, path: (string | number)[]): Schema {
  if (x === undefined || x === null) {
    return { type: "optional", items: { type: "never" } }
  } else if (typeof x === "boolean") {
    return { type: "boolean" }
  } else if (typeof x === "string") {
    const type: Schema = {
      type: "string",
      minLength: x.length,
      maxLength: x.length,
      multiline: x.includes("\n"),
      examples: [x],
    }
    if (/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(x)) {
      type.format = "uuid"
    } else if (/^(?:https?|ftp):\/\//i.test(x)) {
      let isURL = true
      try { new URL(x) } catch { isURL = false }
      if (isURL) type.format = "url"
    }
    return type
  } else if (typeof x === "number") {
    let decimalPlaces = 0
    if (!Number.isInteger(x)) {
      decimalPlaces = x.toString().length - x.toString().indexOf(".") - 1
    }
    return {
      type: "number",
      minimum: x,
      maximum: x,
      decimalPlaces,
    }
  } else if (Array.isArray(x)) {
    return {
      type: 'array',
      items: x.reduce(
        (type, x) => unifyType(type, inferTypeInternal(x, [...path, 0])),
        { type: 'never' }
      ),
    }
  } else {
    const properties: { [key: string]: Schema } = Object.create(null)
    for (const [key, value] of Object.entries(x)) {
      properties[key] = inferTypeInternal(value, [...path, key])
    }
    const unifiedType = Object.values(properties).reduce(unifyType, { type: "never" })
    // See if the JSON object looks like a homogeneous dictionary with string keys (type: "map").
    // http://blog.quicktype.io/markov/
    if ((() => {
      const propertyKeys = Object.keys(properties)
      // If any of the keys isn't an identifier, the object must be a map.
      if (propertyKeys.some(key => /\W|^\d/.test(key))) return true
      // If values are of different types, the object is most likely an object.
      if (unifiedType.type === "any") return false
      // “Some classes have relatively many string properties, but it's less common to find classes with lots of array, class, or map properties.”
      if (unifiedType.type === "array" || unifiedType.type === "object" || unifiedType.type === "map") {
        // There can be better heuristics. For now, stay simple.
        return propertyKeys.length >= 3
      }
      // “If all values in a JSON object have the same type and it has at least 20 properties, consider it a map.”
      return propertyKeys.length >= 20
    })()) {
      return {
        type: "map",
        items: unifiedType,
        propertyNames: Object.keys(properties),
      }
    } else {
      return {
        type: "object",
        properties,
      }
    }
  }
}

function cleanupSchema(type: Schema): void {
  if (type.type === 'string') {
    type.examples = [...new Set(type.examples)]
  } else if (type.type === 'array' || type.type === 'map' || type.type === 'optional') {
    cleanupSchema(type.items)
    if (type.type === 'map') {
      type.propertyNames = [...new Set(type.propertyNames)]
    }
  } else if (type.type === 'object') {
    for (const x of Object.values(type.properties)) {
      cleanupSchema(x)
    }
  }
}

/**
 * Infer schemas from JSON data.
 * 
 * Since we're given only the data — not any of the intended types — it's more like guesses rather than type inference in the traditional sense.
 * 
 * @param x - The input to this function. Must not have any circular reference.
 */
export function inferSchema(x: unknown, path: (string | number)[] = []): Schema {
  const type = inferTypeInternal(x, path)
  cleanupSchema(type)
  return type
}

export function nullPrototypeReviver(_key: string, value: any) {
  if (typeof value === 'object' && value && !Array.isArray(value)) {
    Object.setPrototypeOf(value, null)
  }
  return value;
}

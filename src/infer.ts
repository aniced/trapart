// Infer types from JSON data.
// Since we're given only the data — not any of the intended types — it's more like guesses rather than type inference in the traditional sense.

// SchemaType is modelled loosely after JSON Schema.
type SchemaSomeType = {
  // Maybe it's more elegant to treat null as optional<unknown>?
  type: "null" | "boolean" | "any" | "unknown",
} | {
  type: "string",
  minimumLength: number,
  maximumLength: number,
  format?: "url" | "regex" | "date" | "uuid",
} | {
  type: "number",
  minimum: number,
  maximum: number,
  decimalPlaces: number,
} | {
  type: "array" | "map",
  items: SchemaType,
} | {
  type: "object",
  properties: Map<string, SchemaType>,
}

export type SchemaType = SchemaSomeType | {
  // undefined and null are not distinguished from each other.
  type: "optional",
  items: SchemaSomeType,
}

export function optional(type: SchemaType): SchemaType {
  return type.type === "optional" ? type : { type: "optional", items: type }
}

export function unifyType(a: SchemaType, b: SchemaType): SchemaType {
  if (a.type === b.type) {
    if (a.type === "null" || a.type === "boolean" || a.type === "any" || a.type == "unknown") {
      return a
    } else if (a.type === "string") {
      // TypeScript can't narrow types with an equality assumption (a.type === b.type).
      if (b.type !== "string") throw new Error("impossible")
      return {
        type: "string",
        minimumLength: Math.min(a.minimumLength, b.minimumLength),
        maximumLength: Math.max(a.maximumLength, b.maximumLength),
        format: a.format === b.format ? a.format : undefined,
      }
    } else if (a.type === "number") {
      if (b.type !== "number") throw new Error("impossible")
      return {
        type: "number",
        minimum: Math.min(a.minimum, b.minimum),
        maximum: Math.max(a.maximum, b.maximum),
        decimalPlaces: Math.max(a.decimalPlaces, b.decimalPlaces),
      }
    } else if (a.type === "array" || a.type === "map") {
      if (b.type !== "array" && b.type !== "map") throw new Error("impossible")
      return {
        type: a.type,
        items: unifyType(a.items, b.items),
      }
    } else if (a.type === "optional") {
      if (b.type !== "optional") throw new Error("impossible")
      return optional(unifyType(a.items, b.items))
    } else if (a.type === "object") {
      if (b.type !== "object") throw new Error("impossible")
      const properties = new Map<string, SchemaType>()
      let numberOfCommonProperties = 0
      for (const [key, aType] of a.properties.entries()) {
        const bType = b.properties.get(key)
        if (bType) {
          const unifiedType = unifyType(aType, bType)
          properties.set(key, unifiedType)
          if (unifiedType.type !== "any") numberOfCommonProperties++
        } else {
          properties.set(key, optional(aType))
        }
      }
      for (const [key, type] of b.properties.entries()) {
        if (!properties.has(key)) {
          properties.set(key, optional(type))
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
    // For example, (any | unknown) is any, not unknown.
    if (a.type === "any") return a
    if (b.type === "any") return b
    if (a.type === "unknown") return b
    if (b.type === "unknown") return a
    if (a.type === "optional") return optional(unifyType(a.items, b))
    if (b.type === "optional") return optional(unifyType(a, b.items))
    if (a.type === "null") return { type: "optional", items: b }
    if (b.type === "null") return { type: "optional", items: a }
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

export function inferType(x: any): SchemaType {
  if (x === undefined || x === null) {
    return { type: "null" }
  } else if (typeof x === "boolean") {
    return { type: "boolean" }
  } else if (typeof x === "string") {
    const type: SchemaType = {
      type: "string",
      minimumLength: x.length,
      maximumLength: x.length,
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
      type: "array",
      items: x.reduce((type, x) => unifyType(type, inferType(x)), { type: "unknown" }),
    }
  } else {
    const properties = new Map<string, SchemaType>()
    for (const key in x) properties.set(key, inferType(x[key]))
    const unifiedType = [...properties.values()].reduce(unifyType, { type: "unknown" })
    // See if the JSON object looks like a homogeneous dictionary with string keys (type: "map").
    // http://blog.quicktype.io/markov/
    if ((() => {
      // If any of the keys isn't an identifier, the object must be a map.
      if ([...properties.keys()].some(key => /\W|^\d/.test(key))) return true
      // If values are of different types, the object is most likely an object.
      if (unifiedType.type === "any") return false
      // “Some classes have relatively many string properties, but it's less common to find classes with lots of array, class, or map properties.”
      if (unifiedType.type === "array" || unifiedType.type === "object" || unifiedType.type === "map") {
        // There can be better heuristics. For now, stay simple.
        return properties.size >= 3
      }
      // “If all values in a JSON object have the same type and it has at least 20 properties, consider it a map.”
      return properties.size >= 20
    })()) {
      return {
        type: "map",
        items: unifiedType,
      }
    } else {
      return {
        type: "object",
        properties,
      }
    }
  }
}

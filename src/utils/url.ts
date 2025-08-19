export type QueryValue = string | string[]
export type QueryParams = Record<string, QueryValue>

export interface ParseQueryOptions {
  decode?: boolean
  plusAsSpace?: boolean
}

export interface StringifyQueryOptions {
  encode?: boolean
  addPrefix?: boolean
}

export interface ParsedUrl {
  baseUrl: string
  path: string
  query: QueryParams
  hash: string
}

const defaultParseOpts: Required<ParseQueryOptions> = {
  decode: true,
  plusAsSpace: true
}

const defaultStringifyOpts: Required<StringifyQueryOptions> = {
  encode: true,
  addPrefix: true
}

function decode(str: string, opts: Required<ParseQueryOptions>): string {
  const value = opts.plusAsSpace ? str.replace(/\+/g, ' ') : str
  return opts.decode ? safeDecodeURIComponent(value) : value
}

function encode(str: string, shouldEncode: boolean): string {
  return shouldEncode ? encodeURIComponent(str) : str
}

function safeDecodeURIComponent(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

export function parseQuery(query: string, options?: ParseQueryOptions): QueryParams {
  const opts = { ...defaultParseOpts, ...(options || {}) }
  const result: QueryParams = {}
  if (!query) return result

  const trimmed = query.startsWith('?') ? query.slice(1) : query
  if (!trimmed) return result

  for (const pair of trimmed.split('&')) {
    if (!pair) continue
    const eqIndex = pair.indexOf('=')
    const rawKey = eqIndex >= 0 ? pair.slice(0, eqIndex) : pair
    const rawValue = eqIndex >= 0 ? pair.slice(eqIndex + 1) : ''

    const key = decode(rawKey, opts)
    const value = decode(rawValue, opts)

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const existing = result[key]
      if (Array.isArray(existing)) {
        existing.push(value)
      } else {
        result[key] = [existing as string, value]
      }
    } else {
      result[key] = value
    }
  }

  return result
}

export function stringifyQuery(params: QueryParams, options?: StringifyQueryOptions): string {
  const opts = { ...defaultStringifyOpts, ...(options || {}) }
  const parts: string[] = []

  for (const key of Object.keys(params)) {
    const value = params[key]
    if (value === undefined) continue

    if (Array.isArray(value)) {
      for (const v of value) {
        parts.push(`${encode(key, opts.encode)}=${encode(String(v ?? ''), opts.encode)}`)
      }
    } else {
      parts.push(`${encode(key, opts.encode)}=${encode(String(value ?? ''), opts.encode)}`)
    }
  }

  const queryString = parts.join('&')
  if (!queryString) return opts.addPrefix ? '' : ''
  return opts.addPrefix ? `?${queryString}` : queryString
}

export function parseUrl(input: string, options?: ParseQueryOptions): ParsedUrl {
  if (!input) {
    return { baseUrl: '', path: '', query: {}, hash: '' }
  }

  let urlObj: URL | null = null
  let baseUrl = ''
  let path = ''
  let queryString = ''
  let hash = ''

  try {
    urlObj = new URL(input)
    baseUrl = `${urlObj.protocol}//${urlObj.host}`
    path = urlObj.pathname
    queryString = urlObj.search.startsWith('?') ? urlObj.search.slice(1) : urlObj.search
    hash = urlObj.hash.startsWith('#') ? urlObj.hash.slice(1) : urlObj.hash
  } catch {
    // Fallback for relative URLs or pure query strings
    const hashIndex = input.indexOf('#')
    if (hashIndex >= 0) {
      hash = input.slice(hashIndex + 1)
      input = input.slice(0, hashIndex)
    }

    const qIndex = input.indexOf('?')
    if (qIndex >= 0) {
      queryString = input.slice(qIndex + 1)
      path = input.slice(0, qIndex)
    } else if (input.includes('=')) {
      // Likely a pure query string
      queryString = input
    } else {
      path = input
    }
  }

  return {
    baseUrl,
    path,
    query: parseQuery(queryString, options),
    hash
  }
}

export function getParam(params: QueryParams, key: string): QueryValue | undefined {
  return params[key]
}

export function setParam(params: QueryParams, key: string, value: QueryValue): QueryParams {
  return { ...params, [key]: value }
}

export function removeParam(params: QueryParams, key: string): QueryParams {
  const next = { ...params }
  delete next[key]
  return next
}

export function mergeParams(base: QueryParams, updates: QueryParams): QueryParams {
  const next: QueryParams = { ...base }
  for (const key of Object.keys(updates)) {
    next[key] = updates[key]
  }
  return next
}

export function buildUrl(parts: { baseUrl?: string; path?: string; params?: QueryParams; hash?: string }, options?: StringifyQueryOptions): string {
  const baseUrl = parts.baseUrl ?? ''
  const path = parts.path ?? ''
  const query = parts.params ? stringifyQuery(parts.params, options) : ''
  const hash = parts.hash ? `#${parts.hash}` : ''
  return `${baseUrl}${path}${query}${hash}`
}

export function updateUrlParams(url: string, updates: QueryParams, parseOptions?: ParseQueryOptions, stringifyOptions?: StringifyQueryOptions): string {
  const parsed = parseUrl(url, parseOptions)
  const merged = mergeParams(parsed.query, updates)
  return buildUrl({ baseUrl: parsed.baseUrl, path: parsed.path, params: merged, hash: parsed.hash }, stringifyOptions)
} 
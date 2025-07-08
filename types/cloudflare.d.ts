// Cloudflare Workers Types
interface D1Database {
  prepare(query: string): D1PreparedStatement
  exec(query: string): Promise<D1ExecResult>
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
  dump(): Promise<ArrayBuffer>
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement
  first<T = unknown>(colName?: string): Promise<T | null>
  run(): Promise<D1Result>
  all<T = unknown>(): Promise<D1Result<T>>
  raw<T = unknown>(): Promise<T[]>
}

interface D1Result<T = unknown> {
  results: T[]
  duration: number
  count?: number
  changes?: number
  success: boolean
  served_by?: string
  meta: {
    duration: number
    size_after: number
    rows_read: number
    rows_written: number
    last_row_id?: number
  }
}

interface D1ExecResult {
  duration: number
  count: number
  success: boolean
} 
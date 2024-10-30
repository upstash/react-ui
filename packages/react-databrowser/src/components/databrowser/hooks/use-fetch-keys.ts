import { useCallback, useRef } from "react"
import { useDatabrowser, type SearchFilter } from "@/store"
import { DATA_TYPES, type DataType } from "@/types"
import type { Redis } from "@upstash/redis"

const PAGE_SIZE = 30

// Fetch 100 keys every single time
const INITIAL_FETCH_COUNT = 100
const MAX_FETCH_COUNT = 1000

export type RedisKey = [string, DataType]

export const useFetchKeys = (search: SearchFilter) => {
  const { redis } = useDatabrowser()

  const cache = useRef<PaginationCache | undefined>()
  const lastKey = useRef<string | undefined>()

  const getPage = useCallback(
    (page: number) => {
      const newKey = JSON.stringify(search)

      if (!cache.current || lastKey.current !== newKey) {
        cache.current = new PaginationCache(redis, search.key, search.type)
        lastKey.current = newKey
      }

      return cache.current.getPage(page)
    },
    [search]
  )

  const resetCache = useCallback(() => {
    cache.current = undefined
    lastKey.current = undefined
  }, [])

  return {
    getPage,
    resetCache,
  }
}

function slicePage(keys: RedisKey[], page: number) {
  return keys.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
}

class PaginationCache {
  // Cursor is 0 initially, then it is set to -1 when we reach the end
  cache: Record<string, { cursor: string; keys: string[] }> = Object.fromEntries(
    DATA_TYPES.map((type) => [type, { cursor: "0", keys: [] }])
  )
  targetCount = 0
  isFetching = false

  constructor(
    private readonly redis: Redis,
    private readonly searchTerm: string,
    private readonly typeFilter: string | undefined
  ) {
    if (typeFilter && !DATA_TYPES.includes(typeFilter as DataType)) {
      throw new Error(`Invalid type filter: ${typeFilter}`)
    }
  }

  async getPage(page: number) {
    // The number of keys we need to have in the cache to satisfy this function call
    // +1 here to fetch one more than needed to check if there is a next page
    this.targetCount = (page + 1) * PAGE_SIZE + 1

    // Starts the fetching loop if it's not already started
    void this.startFetch()

    // Wait until we have enough
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.getLength() >= this.targetCount || this.isAllEnded()) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })

    const hasEnoughForNextPage = this.getLength() > (page + 1) * PAGE_SIZE

    const hasNextPage = !this.isAllEnded() || hasEnoughForNextPage

    return {
      keys: slicePage(this.getKeys(), page),
      hasNextPage,
    }
  }

  private getLength() {
    return Object.values(this.cache).reduce((acc, curr) => acc + curr.keys.length, 0)
  }

  private getKeys() {
    const keys = Object.entries(this.cache).flatMap(([type, { keys }]) => {
      return keys.map((key) => [key, type] as RedisKey)
    })

    const sorted = keys.sort((a, b) => a[0].localeCompare(b[0]))

    return sorted
  }

  private async startFetch() {
    if (this.isFetching) {
      return
    }
    this.isFetching = true
    try {
      await this.fetch()
    } finally {
      this.isFetching = false
    }
  }

  private fetchForType = async (type: string) => {
    let fetchCount = INITIAL_FETCH_COUNT

    while (true) {
      const cursor = this.cache[type].cursor
      if (cursor === "-1" || this.getLength() >= this.targetCount) {
        break
      }

      const [nextCursor, newKeys] = await this.redis.scan(cursor, {
        count: fetchCount,
        match: this.searchTerm,
        type: type,
      })

      fetchCount = Math.min(fetchCount * 2, MAX_FETCH_COUNT)

      // Dedupe here because redis can and will return duplicates for example when
      // a key is deleted because of ttl etc.
      const dedupedSet = new Set([...this.cache[type].keys, ...newKeys])

      this.cache[type].keys = [...dedupedSet]
      this.cache[type].cursor = nextCursor === "0" ? "-1" : nextCursor
    }
  }

  private async fetch() {
    // Fetch pages of each type until they are enough
    const types = this.typeFilter ? [this.typeFilter] : DATA_TYPES
    await Promise.all(types.map(this.fetchForType))
  }

  // TODO: Yusuf, implement this function
  private isAllEnded(): boolean {
    const types = this.typeFilter ? [this.typeFilter] : DATA_TYPES

    if (!Array.isArray(types)) {
      throw new TypeError("types is not an array")
    }

    return types.every((type) => this.cache[type] && this.cache[type].cursor === "-1")
  }
}

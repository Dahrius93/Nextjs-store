'use client'
import { Input } from '../ui/input'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect } from 'react'

function NavSearch() {
  // useSearchParams legge i query params dell'URL (?search=...) — funziona solo lato client
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || '',
  )
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.delete('page')
    replace(`/products?${params.toString()}`)
  }, 300)

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('')
    }
  }, [searchParams.get('search')])
  return (
    <Input
      type="search"
      placeholder="search product..."
      className="max-w-xs dark:bg-muted "
      onChange={(e) => {
        setSearch(e.target.value)
        handleSearch(e.target.value)
      }}
      value={search}
    />
  )
}
export default NavSearch

'use client'

import { Search, X } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Input } from './input'
import { Button } from './button'

interface DebouncedSearchProps {
  placeholder?: string
  className?: string
  debounce?: number
  onChange: (value: string) => void
}

export interface DebouncedSearchRef {
  clear: () => void
}

export const DebouncedSearch = forwardRef<
  DebouncedSearchRef,
  DebouncedSearchProps
>(
  (
    { placeholder = 'Search...', className = '', debounce = 500, onChange },
    ref,
  ) => {
    const [value, setValue] = useState('')

    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)

      return () => clearTimeout(timeout)
    }, [value, debounce, onChange])

    const handleClear = () => {
      setValue('')
      onChange('')
    }

    useImperativeHandle(ref, () => ({
      clear: () => {
        handleClear()
      },
    }))

    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          className="pl-9 pr-9"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 h-5 w-5 p-0 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    )
  },
)

DebouncedSearch.displayName = 'DebouncedSearch'

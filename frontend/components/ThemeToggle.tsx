'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
        <div className="w-5 h-5" />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center
                 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-600"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun size={20} className="text-amber-500" />
      ) : (
        <Moon size={20} className="text-slate-600" />
      )}
    </button>
  )
}

export default ThemeToggle

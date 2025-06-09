"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggleSlide() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center rounded-full bg-gray-100 dark:bg-black p-1 w-fit">
        <div className="flex items-center space-x-1">
          <div className="p-1.5 rounded-full">
            <Monitor className="h-4 w-4" />
          </div>
          <div className="p-1.5 rounded-full">
            <Sun className="h-4 w-4" />
          </div>
          <div className="p-1.5 rounded-full">
            <Moon className="h-4 w-4" />
          </div>
        </div>
      </div>
    )
  }

  const themes = [
    { key: "system", icon: Monitor, label: "System" },
    { key: "light", icon: Sun, label: "Light" },
    { key: "dark", icon: Moon, label: "Dark" },
  ]

  return (
    <div className="flex items-center rounded-full bg-gray-100 dark:bg-black p-1 w-fit">
      <div className="flex items-center space-x-1">
        {themes.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={cn(
              "p-1.5 rounded-full transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700",
              theme === key
                ? "bg-white dark:bg-gray-900 shadow-sm text-gray-900 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-400"
            )}
            aria-label={`Switch to ${label} theme`}
            title={`Switch to ${label} theme`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    </div>
  )
}

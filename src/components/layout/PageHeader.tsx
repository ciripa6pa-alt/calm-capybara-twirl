'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  rightAction?: ReactNode
  showBackButton?: boolean
  onBackClick?: () => void
  showProfile?: boolean
  profileComponent?: ReactNode
}

export function PageHeader({ 
  title, 
  subtitle, 
  rightAction, 
  showBackButton = false, 
  onBackClick,
  showProfile = false,
  profileComponent
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackClick}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          {rightAction}
          {showProfile && profileComponent}
        </div>
      </div>
    </div>
  )
}
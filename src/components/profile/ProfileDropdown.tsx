'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Download,
  CheckCircle 
} from 'lucide-react'

interface ProfileDropdownProps {
  userName?: string
  userAvatar?: string
  unreadCount?: number
  hasPWAUpdate?: boolean
  onLogout?: () => void
  onEditProfile?: () => void
  onMarkAllRead?: () => void
  onUpdatePWA?: () => void
}

export function ProfileDropdown({
  userName = "User",
  userAvatar,
  unreadCount = 0,
  hasPWAUpdate = false,
  onLogout,
  onEditProfile,
  onMarkAllRead,
  onUpdatePWA
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    onLogout?.()
    setIsOpen(false)
  }

  const handleEditProfile = () => {
    onEditProfile?.()
    setIsOpen(false)
  }

  const handleMarkAllRead = () => {
    onMarkAllRead?.()
    setIsOpen(false)
  }

  const handleUpdatePWA = () => {
    onUpdatePWA?.()
    setIsOpen(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar || ''} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            
            {/* Notification Badge */}
            {(unreadCount > 0 || hasPWAUpdate) && (
              <div className="absolute -top-1 -right-1 flex items-center justify-center">
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
                {hasPWAUpdate && unreadCount === 0 && (
                  <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-56" 
          align="end" 
          sideOffset={8}
        >
          <DropdownMenuLabel className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar || ''} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{userName}</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Notifications Section */}
          {(unreadCount > 0 || hasPWAUpdate) && (
            <>
              <div className="px-2 py-1.5">
                <p className="text-xs font-medium text-muted-foreground">Notifikasi</p>
              </div>
              
              {unreadCount > 0 && (
                <DropdownMenuItem onClick={handleMarkAllRead} className="cursor-pointer">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="flex-1">Tandai Semua Dibaca</span>
                  <Badge variant="secondary" className="ml-auto">
                    {unreadCount}
                  </Badge>
                </DropdownMenuItem>
              )}
              
              {hasPWAUpdate && (
                <DropdownMenuItem onClick={handleUpdatePWA} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="flex-1">Perbarui Aplikasi</span>
                  <div className="ml-auto">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  </div>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
            </>
          )}
          
          {/* Account Actions */}
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-muted-foreground">Akun</p>
          </div>
          
          <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Edit Nama</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
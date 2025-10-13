'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash2, AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  messageCount?: number
  contactName?: string
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  messageCount = 0,
  contactName = ''
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    await onConfirm()
    setIsDeleting(false)
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Hapus Semua Pesan
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {contactName && (
              <span className="font-medium">Chat dengan {contactName}</span>
            )}
            <p className="mt-2">
              Apakah Anda yakin ingin menghapus{' '}
              <span className="font-bold text-red-600">
                {messageCount} pesan
              </span>{' '}
              dalam percakapan ini?
            </p>
            <p className="mt-2 text-sm text-gray-600">
              ⚠️ Tindakan ini tidak dapat dibatalkan. Semua pesan akan dihapus permanen.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel asChild disabled={isDeleting}>
            <Button variant="outline" className="w-full sm:w-auto">
              Batal
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild disabled={isDeleting}>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Semua
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
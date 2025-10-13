'use client'

import { useState, useRef, useCallback } from 'react'

interface UseTapHoldOptions {
  onTap?: () => void
  onHold?: () => void
  holdDuration?: number
  threshold?: number
}

export function useTapHold({
  onTap,
  onHold,
  holdDuration = 500,
  threshold = 10
}: UseTapHoldOptions = {}) {
  const [isHolding, setIsHolding] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startPosRef = useRef<{ x: number; y: number } | null>(null)

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startPosRef.current = { x: clientX, y: clientY }
    setIsHolding(false)

    timerRef.current = setTimeout(() => {
      setIsHolding(true)
      onHold?.()
    }, holdDuration)
  }, [onHold, holdDuration])

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!startPosRef.current) return

    const deltaX = Math.abs(clientX - startPosRef.current.x)
    const deltaY = Math.abs(clientY - startPosRef.current.y)

    if (deltaX > threshold || deltaY > threshold) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setIsHolding(false)
    }
  }, [threshold])

  const handleEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!isHolding) {
      onTap?.()
    }

    setIsHolding(false)
    startPosRef.current = null
  }, [isHolding, onTap])

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setIsHolding(false)
    startPosRef.current = null
  }, [])

  // Cleanup on unmount
  useState(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  })

  return {
    isHolding,
    handleStart,
    handleMove,
    handleEnd,
    cancel
  }
}
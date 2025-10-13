import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Deployment test successful!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}
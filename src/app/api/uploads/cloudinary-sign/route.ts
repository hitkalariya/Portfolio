/**
 * SETUP GUIDE (4 steps)
 * STEP 1: Create Cloudinary account and get credentials
 * STEP 2: Set CLOUDINARY_* variables in .env.local
 * STEP 3: Configure upload presets in Cloudinary dashboard
 * STEP 4: Test upload signature generation
 * NOTE: Generates secure upload signatures for client-side uploads
 * TODO: Add folder-based organization and transformations
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateUploadSignature } from '@/lib/cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// BEGINNER: Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local

export async function POST(request: NextRequest) {
  try {
    // Check authentication for admin uploads
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { folder } = await request.json()
    
    const signature = generateUploadSignature(folder)
    
    return NextResponse.json(signature)
  } catch (error) {
    console.error('Cloudinary signature error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}
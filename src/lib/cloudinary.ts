/**
 * SETUP GUIDE (4 steps)
 * STEP 1: Create Cloudinary account
 * STEP 2: Set CLOUDINARY_* variables in .env.local
 * STEP 3: Configure upload presets in Cloudinary dashboard
 * STEP 4: Test upload functionality in admin panel
 * NOTE: Server-side upload signature generation
 * TODO: Add image transformation and optimization
 */

import { v2 as cloudinary } from 'cloudinary'

// BEGINNER: Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinarySignature {
  signature: string
  timestamp: number
  api_key: string
  cloud_name: string
}

// Generate upload signature for secure client-side uploads
export function generateUploadSignature(folder?: string): CloudinarySignature {
  const timestamp = Math.round(new Date().getTime() / 1000)
  
  const params: Record<string, any> = {
    timestamp,
    upload_preset: 'portfolio_uploads', // Configure this in Cloudinary
  }
  
  if (folder) {
    params.folder = folder
  }
  
  // Generate signature
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  )
  
  return {
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY!,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  }
}

// Upload image from server (for admin operations)
export async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    folder?: string
    public_id?: string
    transformation?: object
  } = {}
): Promise<any> {
  try {
    const result = await cloudinary.uploader.upload(file.toString('base64'), {
      folder: options.folder || 'portfolio',
      public_id: options.public_id,
      transformation: options.transformation,
      resource_type: 'auto',
    })
    
    return result
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload to Cloudinary')
  }
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === 'ok'
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  transformations: {
    width?: number
    height?: number
    quality?: number
    format?: string
    crop?: string
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = transformations
  
  let transformation = `q_${quality},f_${format}`
  
  if (width && height) {
    transformation += `,w_${width},h_${height},c_${crop}`
  } else if (width) {
    transformation += `,w_${width}`
  } else if (height) {
    transformation += `,h_${height}`
  }
  
  return cloudinary.url(publicId, {
    transformation,
    secure: true,
  })
}

export default cloudinary
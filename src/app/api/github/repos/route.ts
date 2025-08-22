/**
 * SETUP GUIDE (3 steps)
 * STEP 1: Create GitHub personal access token
 * STEP 2: Set GITHUB_TOKEN and GITHUB_USERNAME in .env.local
 * STEP 3: Test API endpoint functionality
 * NOTE: Fetches public repositories with 6-hour caching
 * TODO: Add repository statistics and contribution data
 */

import { NextResponse } from 'next/server'
import { fetchGitHubRepos } from '@/lib/github'

// BEGINNER: Set GITHUB_TOKEN="github_pat_your_token" and GITHUB_USERNAME="hitkalariya" in .env.local

export async function GET() {
  try {
    const repos = await fetchGitHubRepos()
    
    return NextResponse.json(
      { repos },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600', // 6 hours
        },
      }
    )
  } catch (error) {
    console.error('GitHub API error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch repositories', repos: [] },
      { status: 500 }
    )
  }
}
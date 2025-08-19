/**
 * SETUP GUIDE (3 steps)
 * STEP 1: Create GitHub personal access token
 * STEP 2: Set GITHUB_TOKEN and GITHUB_USERNAME in .env.local
 * STEP 3: Test API endpoint at /api/github/repos
 * NOTE: Fetches public repositories with caching
 * TODO: Add repository statistics and contribution data
 */

// BEGINNER: Set GITHUB_TOKEN="github_pat_your_token" and GITHUB_USERNAME="hitkalariya" in .env.local

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  created_at: string
  size: number
  default_branch: string
}

const GITHUB_API_BASE = 'https://api.github.com'

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_TOKEN
  
  if (!username || !token) {
    console.warn('GitHub credentials not configured')
    return []
  }
  
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-App',
      },
      // PERF: Cache for 6 hours to reduce API calls
      next: { revalidate: 21600 },
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const repos: GitHubRepo[] = await response.json()
    
    // Filter out forks and private repos, sort by stars and last updated
    return repos
      .filter(repo => !repo.full_name.includes(`${username}/${username}`) && repo.description)
      .sort((a, b) => {
        // Prioritize by stars, then by update date
        const starDiff = b.stargazers_count - a.stargazers_count
        if (starDiff !== 0) return starDiff
        
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      })
      .slice(0, 12) // Limit to top 12 repositories
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return []
  }
}

export async function fetchGitHubUser(): Promise<any> {
  const username = process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_TOKEN
  
  if (!username || !token) {
    return null
  }
  
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-App',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    return null
  }
}

// Get repository languages
export async function fetchRepoLanguages(repoName: string): Promise<Record<string, number>> {
  const username = process.env.GITHUB_USERNAME
  const token = process.env.GITHUB_TOKEN
  
  if (!username || !token) {
    return {}
  }
  
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repoName}/languages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-App',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    })
    
    if (!response.ok) {
      return {}
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching repo languages:', error)
    return {}
  }
}
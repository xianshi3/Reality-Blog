import { GITHUB_USERNAME, FEATURED_REPOS } from "@/config/github";

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

const GITHUB_API = "https://api.github.com";

async function fetchRepo(fullName: string): Promise<GitHubRepo | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "reality-blog",
    };

    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${GITHUB_API}/repos/${fullName}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return (await res.json()) as GitHubRepo;
  } catch {
    return null;
  }
}

export async function getFeaturedRepos(): Promise<GitHubRepo[]> {
  const repos = await Promise.all(
    FEATURED_REPOS.map((name) => fetchRepo(`${GITHUB_USERNAME}/${name}`))
  );
  return repos.filter((repo): repo is GitHubRepo => repo !== null);
}

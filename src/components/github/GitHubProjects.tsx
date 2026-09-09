import { FaGithub, FaStar, FaCodeBranch, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { getFeaturedRepos } from "@/lib/github";
import { GITHUB_USERNAME } from "@/config/github";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Vue: "#41b883",
  "C#": "#512bd4",
  Python: "#3572A5",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Rust: "#dea584",
};

export default async function GitHubProjects() {
  const repos = await getFeaturedRepos();

  if (repos.length === 0) return null;

  return (
    <section className="github-projects">
      <div className="github-projects-header">
        <div className="flex items-center gap-2.5">
          <FaGithub className="github-projects-icon" />
          <h2 className="github-projects-title">开源项目</h2>
        </div>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`查看 GitHub 主页（${GITHUB_USERNAME}）`}
          className="github-projects-more"
        >
          查看全部 <FaArrowUpRightFromSquare className="w-3 h-3" />
        </a>
      </div>

      <div className="github-projects-grid">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${repo.name} GitHub 仓库`}
            className="github-project-card group"
          >
            <div className="github-project-top">
              <FaGithub className="w-5 h-5 shrink-0 text-gray-700 dark:text-gray-200" />
              <h3 className="github-project-name">{repo.name}</h3>
            </div>

            <p className="github-project-desc">
              {repo.description || "暂无简介"}
            </p>

            {repo.topics.length > 0 && (
              <div className="github-project-topics">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="github-project-topic">
                    {topic}
                  </span>
                ))}
              </div>
            )}

            <div className="github-project-bottom">
              <span className="github-project-stat">
                <span
                  className="github-language-dot"
                  style={{
                    backgroundColor: LANGUAGE_COLORS[repo.language ?? ""] ?? "#9ca3af",
                  }}
                />
                {repo.language || "Other"}
              </span>
              <span className="github-project-stat">
                <FaStar className="w-3.5 h-3.5" /> {repo.stargazers_count}
              </span>
              <span className="github-project-stat">
                <FaCodeBranch className="w-3.5 h-3.5" /> {repo.forks_count}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

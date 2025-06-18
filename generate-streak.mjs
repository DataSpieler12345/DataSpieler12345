import { Octokit } from "@octokit/rest";
import fs from "fs";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const username = "dataspieler12345";

async function fetchStreakData() {
  const events = await octokit.activity.listPublicEventsForUser({
    username,
    per_page: 100,
  });

  const today = new Date().toISOString().split("T")[0];
  const hasContributionToday = events.data.some((event) =>
    event.created_at.startsWith(today)
  );

  const color = hasContributionToday ? "#39FF14" : "#FF6347";
  const message = hasContributionToday
    ? "🔥 Keep the Streak!"
    : "💤 No contributions today";

  const svg = `
  <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="100" fill="${color}"/>
    <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" fill="#000" font-size="20">${message}</text>
  </svg>`;

  fs.mkdirSync("output", { recursive: true });
  fs.writeFileSync("output/streak-stats.svg", svg);
}

fetchStreakData();

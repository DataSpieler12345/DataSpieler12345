import { Octokit } from "@octokit/rest";
import fs from "fs";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const username = "dataspieler12345";

async function generateSVG() {
  const events = await octokit.activity.listPublicEventsForUser({
    username,
    per_page: 100,
  });

  const today = new Date().toISOString().split("T")[0];
  const hasContributionToday = events.data.some((e) =>
    e.created_at.startsWith(today)
  );

  const color = hasContributionToday ? "#39FF14" : "#FF6347";
  const message = hasContributionToday
    ? "🔥 Keep the Streak!"
    : "💤 No contributions today";

  const svg = `
  <svg width="400" height="110" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="110" fill="${color}"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="18" fill="#000">${message}</text>
  </svg>`;

  // 👇 Aquí está la parte importante
  fs.mkdirSync("output/streak-stats", { recursive: true });
  fs.writeFileSync("output/streak-stats/streak-stats.svg", svg);
}

generateSVG();

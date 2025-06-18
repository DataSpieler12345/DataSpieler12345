// generate-streak.js
const fs = require('fs');
const Octokit = require('@octokit/rest').Octokit;

async function main() {
  const octokit = new Octokit();
  const user = 'dataspieler12345';
  const { data: events } = await octokit.activity.listEventsForAuthenticatedUser({ username: user, per_page: 100 });

  const streak = countStreak(events);
  const longest = streak.longest;
  const current = streak.current;
  const total = events.length;

  const svg = `
    <svg width="500" height="120" xmlns="http://www.w3.org/2000/svg">
      <style>
        .label { font: bold 14px sans-serif; fill: #5bf4ae; }
        .value { font: bold 24px sans-serif; fill: #ffffff; }
      </style>
      <text x="10" y="30" class="label">Current Streak:</text>
      <text x="200" y="30" class="value">${current}d</text>
      <text x="10" y="60" class="label">Longest Streak:</text>
      <text x="200" y="60" class="value">${longest}d</text>
      <text x="10" y="90" class="label">Total Events:</text>
      <text x="200" y="90" class="value">${total}</text>
    </svg>
  `;

  fs.mkdirSync('output/streak-stats', { recursive: true });
  fs.writeFileSync('output/streak-stats/streak-stats.svg', svg);
}

function countStreak(events) {
  const dates = [...new Set(events.map(e => e.created_at.split('T')[0]))].sort();
  let longest = 0, current = 0, prev = null;
  dates.forEach(date => {
    const today = new Date(date);
    if (prev && ((today - prev) / 86400000) === 1) current++;
    else current = 1;
    if (current > longest) longest = current;
    prev = today;
  });
  return { longest, current };
}

main();

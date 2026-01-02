export const features = [
  {
    title: "PR summaries that save time",
    desc: "Instantly understand what changed, risk level, and review focus areas.",
  },
  {
    title: "Line-by-line review comments",
    desc: "Actionable suggestions for bugs, edge cases, and maintainability.",
  },
  {
    title: "Works where you already review",
    desc: "Feedback lands directly in pull requests, not in another dashboard.",
  },
  {
    title: "Team-friendly, low-noise",
    desc: "Prioritizes high-signal issues and avoids bikeshedding style nits.",
  },
  {
    title: "Security & quality checks",
    desc: "Flags risky patterns and suggests safer alternatives.",
  },
  {
    title: "Fast setup",
    desc: "Connect, open a PR, get review fits your existing GitHub workflow.",
  },
];

export const faqs = [
  {
    q: "Does PRizm replace human code review?",
    a: "No. It reduces review load and catches issues early, while humans focus on architecture and product decisions.",
  },
  {
    q: "Where will the feedback appear?",
    a: "In your pull request as comments/suggestions so it stays in the normal review flow.",
  },
  {
    q: "How do we set it up?",
    a: "Typically as a GitHub-native integration (like an Action or App) that runs on PR events.",
  },
  {
    q: "Is it suitable for businesses?",
    a: "Yes designed for teams who need faster review cycles and consistent quality across repos.",
  },
];

export const howtouse = [
  {
    step: "01",
    title: "Connect your repo",
    desc: "PRizm for your org/repo and choose when it should review.",
  },
  {
    step: "02",
    title: "Open a PR",
    desc: "PRizm analyzes the diff and adds a summary + prioritized feedback.",
  },
  {
    step: "03",
    title: "Merge with confidence",
    desc: "Apply suggestions, add tests, and keep humans focused on bigger decisions.",
  },
];

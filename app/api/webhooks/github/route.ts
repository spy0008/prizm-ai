import { reviewPullRequest } from "@/module/ai/actions/index";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");
    console.log(`🌐 Webhook: ${event}, action: ${body.action}, repo: ${body.repository?.full_name}, pr: ${body.pull_request?.number}`);

    if (event === "ping") {
      console.log("🏓 Ping received");
      return NextResponse.json({ message: "Got it Dude!!!" }, { status: 200 });
    }

    if (event === "pull_request") {
      const action = body.action;
      const repo = body.repository.full_name;
      const prNumber = body.pull_request?.number;

      console.log(`📋 PR: ${action} ${repo}#${prNumber}`);

      if (!prNumber) {
        console.log("❌ No PR number");
        return NextResponse.json({ message: 'No PR number' }, { status: 200 });
      }

      const [owner, repoName] = repo.split("/");
      console.log(`🔄 Calling reviewPullRequest: ${owner}/${repoName}#${prNumber}`);

      await reviewPullRequest({ owner, repo: repoName, prNumber });

      console.log(`✅ reviewPullRequest completed for ${repo}#${prNumber}`);
    }

    return NextResponse.json({ message: "Event Processed" }, { status: 200 });
  } catch (error) {
    console.error("💥 Webhook ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

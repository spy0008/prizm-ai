import { reviewPullRequest } from "@/module/ai/actions/index";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");

    if (event === "ping") {
      return NextResponse.json(
        {
          message: "Got it Dude!!!",
        },
        {
          status: 200,
        }
      );
    }

    if (event === "pull_request") {
      const action = body.action;
      const repo = body.repository.full_name;
      const prNumber = body.pull_request?.number;

      const [owner, repoName] = repo.split("/");

      if (action === "opened" || action === "synchronize") {
        reviewPullRequest({
          owner,
          repo: repoName,
          prNumber: prNumber,
        })
          .then(() => console.log(`review completed for ${repo} #${prNumber}`))
          .catch((error) =>
            console.log(`review failed for ${repo} #${prNumber}: `, error)
          );
      }
    }

    //tod: HANDLE LATER

    return NextResponse.json(
      {
        message: "Event Processes",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error while processing webhook: ", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

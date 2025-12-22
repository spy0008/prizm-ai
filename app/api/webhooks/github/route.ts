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
};

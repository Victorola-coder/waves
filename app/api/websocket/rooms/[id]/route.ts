import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id;

    // This will be handled by Socket.IO middleware
    // The actual WebSocket connection is established in the Socket.IO server

    return new Response("WebSocket endpoint", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("WebSocket error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

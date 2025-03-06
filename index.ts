import { Sapling, serveStatic, type Context } from "@sapling/sapling";
import NotFoundLayout from "./layouts/NotFoundLayout.ts";
import { Home } from "./pages/Home.ts";
import { geminiFlashTranscribe } from "./api/transcribe.ts";
import { Settings } from "./pages/Settings.ts";

const site = new Sapling({
  // this will disable caching for static files in development
  // it is automatically passed in when you run deno task dev
  dev: Deno.env.get("ENV") === "development",
});

// Home page
site.get("/", async (c: Context) => c.html(await Home()));
site.get("/settings", async (c: Context) => c.html(await Settings()));
// Enter additional routes here

site.post("/api/transcribe", (c: Context) => geminiFlashTranscribe(c));
// Serve static files
// The location of this is important. It should be the last route you define.
site.get("*", serveStatic({ root: "./static" }));

// 404 Handler
site.notFound(async (c) => c.html(await NotFoundLayout()));

Deno.serve({
  port: 8000,
  onListen: () =>
    console.log(
      `\nSapling Server is running on %chttp://localhost:8000\n`,
      "color: green; font-weight: bold"
    ),
  handler: site.fetch,
});

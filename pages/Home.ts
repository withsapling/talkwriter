import { html } from "@sapling/sapling";
import Layout from "../layouts/Layout.ts";
import { Talkwriter } from "../components/Talkwriter.ts";
import { GeminiApiKeyForm } from "../components/GeminiApiKeyForm.ts";

export async function Home() {
  return await Layout({
    title: "Talkwriter",
    description:
      "Talkwriter is a tool that allows you to write text using your voice.",
    children: await html`
      <main
        class="max-w-screen-lg min-h-screen mx-auto px-4 py-8 flex flex-col items-center justify-center font-sans"
      >
        <div class="w-full max-w-md flex flex-col items-center">
          <div class="w-full">${GeminiApiKeyForm()} ${Talkwriter()}</div>
        </div>
      </main>
    `,
  });
}

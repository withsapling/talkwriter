import { html } from "@sapling/sapling";
import Layout from "../layouts/Layout.ts";
import { GeminiApiKeyForm } from "../components/GeminiApiKeyForm.ts";
import { MicrophoneSelector } from "../components/MicrophoneSelector.ts";

export async function Settings() {
  return await Layout({
    title: "Settings - Talkwriter",
    description: "Configure your Talkwriter settings",
    children: await html`
      <main
        class="max-w-screen-lg min-h-screen mx-auto px-4 py-8 flex flex-col items-center justify-start font-sans"
      >
        <div class="w-full max-w-2xl">
          <h1 class="text-3xl font-bold mb-8">Settings</h1>

          <div class="space-y-8">
            <section class="p-6 rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4">Recording Settings</h2>
              <div class="space-y-4">${MicrophoneSelector()}</div>
            </section>

            <section class="p-6 rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4">API Configuration</h2>
              <div class="space-y-4">${GeminiApiKeyForm()}</div>
            </section>

            <section class="p-6 rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4">About</h2>
              <p class="text-gray-600 mb-4">
                Talkwriter is an open-source tool that allows you to write text
                using your voice.
              </p>
              <div class="flex space-x-4">
                <a
                  href="https://github.com/yourusername/talkwriter"
                  target="_blank"
                  class="text-primary hover:underline"
                >
                  GitHub Repository
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    `,
  });
}

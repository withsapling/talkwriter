import { html } from "@sapling/sapling";
import Layout from "../layouts/Layout.ts";
import { Talkwriter } from "../components/Talkwriter.ts";

export async function Home() {
  return await Layout({
    children: await html`
      <main
        class="max-w-screen-lg min-h-screen mx-auto px-4 py-16 flex flex-col items-center justify-center font-sans"
      >
        <div class="w-full max-w-md flex flex-col items-center">
          ${Talkwriter()}
        </div>
      </main>
    `,
  });
}

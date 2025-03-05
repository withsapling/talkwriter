import {
  Layout as SaplingLayout,
  html,
  type LayoutProps,
} from "@sapling/sapling";
import { BaseHead } from "../components/BaseHead.ts";
import { config } from "../uno.config.ts";
import { SettingsPopover } from "../components/SettingsPopover.ts";

export type BaseLayoutProps = LayoutProps & {
  title?: string;
  description?: string;
};

function Nav() {
  return html`
    <nav
      class="w-full absolute top-0 left-0 flex justify-end items-center p-4 bg-background"
    >
      <div class="relative" id="settings-menu-container">
        <button
          id="settings-menu-button"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors text-on-background"
          aria-label="Settings menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-more-vertical"
          >
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>
        ${SettingsPopover()}
      </div>
    </nav>
  `;
}

export default async function Layout(props: BaseLayoutProps) {
  return await SaplingLayout({
    stream: true,
    enableIslands: true,
    unoConfig: config,
    head: html`${await BaseHead({
      title: props.title,
      description: props.description,
    })}
    ${await props.head}`,
    bodyClass: `font-sans bg-background text-on-background relative ${
      props.bodyClass ?? ``
    }`,
    children: html`
      ${Nav()}
      <div class="container mx-auto">${props.children}</div>
    `,
  });
}

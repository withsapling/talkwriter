import { html } from "@sapling/sapling";

export function SettingsPopover() {
  return html`
    <div
      id="settings-popover"
      class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background text-on-background ring-1 ring-black ring-opacity-5 hidden"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="settings-menu-button"
    >
      <div class="py-1" role="none">
        <a
          href="/settings"
          class="block px-4 py-2 text-sm text-on-background hover:bg-gray-100"
          role="menuitem"
        >
          Settings
        </a>
        <a
          href="#"
          class="block px-4 py-2 text-sm text-on-background hover:bg-gray-100"
          role="menuitem"
          id="clear-api-key"
        >
          Clear API Key
        </a>
        <a
          href="https://github.com/yourusername/talkwriter"
          target="_blank"
          class="block px-4 py-2 text-sm text-on-background hover:bg-gray-100"
          role="menuitem"
        >
          GitHub Repository
        </a>
      </div>
    </div>

    <sapling-island>
      <script type="module">
        // Get DOM elements
        const settingsMenuButton = document.getElementById(
          "settings-menu-button"
        );
        const settingsPopover = document.getElementById("settings-popover");
        const clearApiKey = document.getElementById("clear-api-key");

        // Toggle popover visibility when menu button is clicked
        settingsMenuButton.addEventListener("click", () => {
          settingsPopover.classList.toggle("hidden");
        });

        // Close popover when clicking outside
        document.addEventListener("click", (event) => {
          if (
            !settingsMenuButton.contains(event.target) &&
            !settingsPopover.contains(event.target)
          ) {
            settingsPopover.classList.add("hidden");
          }
        });

        // Clear API key functionality
        clearApiKey.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("gemini-api-key");
          settingsPopover.classList.add("hidden");
          // Reload the page to show the API key form
          window.location.reload();
        });
      </script>
    </sapling-island>
  `;
}

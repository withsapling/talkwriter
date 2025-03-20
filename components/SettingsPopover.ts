import { html } from "@sapling/sapling";

export function SettingsPopover() {
  return html`
    <div
      id="settings-popover"
      class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background text-on-background ring-1 ring-black ring-opacity-5 hidden z-50"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="settings-menu-button"
    >
      <div class="py-1" role="none">
        <a
          href="/settings"
          class="block px-4 py-2 text-sm text-on-background hover:bg-gray-700 transition-colors duration-150"
          role="menuitem"
        >
          Settings
        </a>
        <sapling-island>
          <button
            id="clear-api-key"
            class="w-full text-left px-4 py-2 text-sm text-on-background hover:bg-gray-700 transition-colors duration-150"
            role="menuitem"
          >
            Clear API Key
          </button>
          <script type="module">
            const clearButton = document.getElementById("clear-api-key");

            if (clearButton) {
              clearButton.addEventListener("click", () => {
                if (confirm("Are you sure you want to clear your API key?")) {
                  localStorage.removeItem("geminiApiKey");
                  // Reload the page to reset the application state
                  window.location.reload();
                }
              });
            }
          </script>
        </sapling-island>
        <a
          href="https://github.com/yourusername/talkwriter"
          target="_blank"
          class="block px-4 py-2 text-sm text-on-background hover:bg-gray-700 transition-colors duration-150"
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
      </script>
    </sapling-island>
  `;
}

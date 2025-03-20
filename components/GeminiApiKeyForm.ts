import { html } from "@sapling/sapling";

export function GeminiApiKeyForm({
  isSettingsPage = false,
}: {
  isSettingsPage?: boolean;
} = {}) {
  const settingsStyle = html`
    <div class="w-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">Google API Key</h2>
      </div>
      <p class="text-gray-500 mb-4">
        You can put in your Google AI Studio key to use Google models at-cost.
      </p>
      <div class="flex gap-4">
        <input
          type="password"
          id="gemini-api-key"
          class="flex-1 p-3 bg-[#1e2127] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your API key"
        />
        <button
          id="save-api-key"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Verify
        </button>
      </div>
      <div class="mt-4 flex justify-end">
        <button
          id="clear-api-key"
          class="text-sm text-red-500 hover:text-red-600 transition-colors duration-200"
        >
          Clear API Key
        </button>
      </div>
    </div>

    <sapling-island>
      <template>
        <script type="module">
          const clearButton = document.getElementById("clear-api-key");
          const apiKeyInput = document.getElementById("gemini-api-key");

          if (clearButton) {
            clearButton.addEventListener("click", () => {
              if (confirm("Are you sure you want to clear your API key?")) {
                localStorage.removeItem("geminiApiKey");
                if (apiKeyInput) {
                  apiKeyInput.value = "";
                }
                // Reload the page to reset the application state
                window.location.reload();
              }
            });
          }
        </script>
      </template>
    </sapling-island>
  `;

  const homeStyle = html`
    <div
      class="w-full max-w-md mx-auto p-6 bg-background rounded-lg shadow-md border border-gray-200"
    >
      <h2 class="text-2xl font-bold mb-4 text-center">Welcome to Talkwriter</h2>
      <p class="mb-6 text-gray-600">
        To use this application, you'll need a Gemini API key from Google AI
        Studio.
      </p>

      <div id="api-key-form">
        <div class="mb-4">
          <label
            for="gemini-api-key"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Gemini API Key
          </label>
          <input
            type="password"
            id="gemini-api-key"
            class="w-full bg-background p-3 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Gemini API key"
          />
          <p class="mt-2 text-sm text-gray-500">
            Your API key is stored locally on your device and never sent to our
            servers.
          </p>
        </div>

        <div class="flex flex-col space-y-3">
          <button
            id="save-api-key"
            class="w-full px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-sm font-medium"
          >
            Save API Key
          </button>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            class="text-center text-sm text-blue-500 hover:text-blue-700"
          >
            Get a Gemini API key
          </a>
        </div>
      </div>
    </div>
  `;

  return html`
    ${isSettingsPage ? settingsStyle : homeStyle}
    <sapling-island>
      <template>
        <script type="module">
          // Wrap in IIFE to allow return statements
          (function () {
            const apiKeyForm = document.getElementById("api-key-form");
            const apiKeyInput = document.getElementById("gemini-api-key");
            const saveButton = document.getElementById("save-api-key");
            const talkwriterContainer = document.querySelector(
              ".talkwriter-container"
            );
            const formContainer = apiKeyForm?.parentElement;

            // Check if API key exists in localStorage and populate input if it does
            const storedApiKey = localStorage.getItem("geminiApiKey");
            if (storedApiKey && apiKeyInput) {
              apiKeyInput.value = storedApiKey;
            }

            // Only handle visibility on the home page
            if (window.location.pathname === "/") {
              if (storedApiKey) {
                // If API key exists, hide the form and show the Talkwriter
                if (formContainer && talkwriterContainer) {
                  formContainer.style.display = "none";
                  talkwriterContainer.style.display = "block";
                }
              } else {
                // If no API key, show the form and hide the Talkwriter
                if (formContainer && talkwriterContainer) {
                  formContainer.style.display = "block";
                  talkwriterContainer.style.display = "none";
                }
              }
            }

            // Handle save button click
            if (saveButton && apiKeyInput) {
              saveButton.addEventListener("click", () => {
                const apiKey = apiKeyInput.value.trim();

                if (!apiKey) {
                  alert("Please enter a valid API key");
                  return;
                }

                // Save API key to localStorage
                localStorage.setItem("geminiApiKey", apiKey);

                // Only handle visibility on the home page
                if (window.location.pathname === "/") {
                  // Hide the form and show the Talkwriter
                  if (formContainer && talkwriterContainer) {
                    formContainer.style.display = "none";
                    talkwriterContainer.style.display = "block";
                  }
                }
              });
            }
          })();
        </script>
      </template>
    </sapling-island>
  `;
}

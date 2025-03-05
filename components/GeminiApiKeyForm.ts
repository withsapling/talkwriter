import { html } from "@sapling/sapling";

export function GeminiApiKeyForm() {
  return html`
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

              // Check if API key exists in localStorage
              const storedApiKey = localStorage.getItem("geminiApiKey");

              if (storedApiKey) {
                // If API key exists, hide the form and show the Talkwriter
                if (
                  apiKeyForm &&
                  apiKeyForm.parentElement &&
                  talkwriterContainer
                ) {
                  apiKeyForm.parentElement.style.display = "none";
                  talkwriterContainer.style.display = "block";
                }
              } else {
                // If no API key, hide the Talkwriter and show the form
                if (talkwriterContainer) {
                  talkwriterContainer.style.display = "none";
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

                  // Hide the form and show the Talkwriter
                  if (
                    apiKeyForm &&
                    apiKeyForm.parentElement &&
                    talkwriterContainer
                  ) {
                    apiKeyForm.parentElement.style.display = "none";
                    talkwriterContainer.style.display = "block";
                  }
                });
              }
            })();
          </script>
        </template>
      </sapling-island>
    </div>
  `;
}

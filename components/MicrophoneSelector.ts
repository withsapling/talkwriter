import { html } from "@sapling/sapling";

export function MicrophoneSelector() {
  return html`
    <div class="microphone-selector">
      <label
        for="microphone-select"
        class="block text-sm font-medium text-on-background mb-2"
      >
        Select Microphone
      </label>
      <select
        id="microphone-select"
        class="w-full p-2 border border-gray-600 rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary bg-background text-on-background"
      >
        <option value="">Loading microphones...</option>
      </select>
      <p class="mt-2 text-sm text-gray-400">
        Choose your preferred microphone for voice recording
      </p>
    </div>

    <template id="option-template">
      <option></option>
    </template>

    <sapling-island>
      <script type="module">
        const microphoneSelect = document.getElementById("microphone-select");
        const optionTemplate = document.getElementById("option-template");

        // Load saved microphone from localStorage
        const savedMicrophoneId = localStorage.getItem(
          "preferred-microphone-id"
        );

        function createOption(value, text, selected = false) {
          const option = optionTemplate.content
            .cloneNode(true)
            .querySelector("option");
          option.value = value;
          option.textContent = text;
          option.selected = selected;
          return option;
        }

        async function loadMicrophones() {
          try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = devices.filter(
              (device) => device.kind === "audioinput"
            );

            // Clear existing options
            while (microphoneSelect.firstChild) {
              microphoneSelect.removeChild(microphoneSelect.firstChild);
            }

            // Add default option
            microphoneSelect.appendChild(
              createOption(
                "default",
                "Default Microphone",
                !savedMicrophoneId || savedMicrophoneId === "default"
              )
            );

            // Add available microphones
            audioInputs.forEach((device) => {
              const label =
                device.label ||
                "Microphone (" + device.deviceId.slice(0, 8) + "...)";
              const isSelected = savedMicrophoneId === device.deviceId;
              microphoneSelect.appendChild(
                createOption(device.deviceId, label, isSelected)
              );
            });
          } catch (error) {
            console.error("Error loading microphones:", error);
            microphoneSelect.appendChild(
              createOption("", "Error loading microphones")
            );
          }
        }

        // Request microphone permission and load devices
        async function initializeMicrophones() {
          try {
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
            stream.getTracks().forEach((track) => track.stop()); // Stop the test stream
            await loadMicrophones();
          } catch (error) {
            console.error("Error initializing microphones:", error);
            microphoneSelect.appendChild(
              createOption("", "Please allow microphone access")
            );
          }
        }

        // Save selected microphone to localStorage
        microphoneSelect.addEventListener("change", (event) => {
          const selectedMicrophoneId = event.target.value;
          if (selectedMicrophoneId === "default") {
            localStorage.removeItem("preferred-microphone-id");
          } else {
            localStorage.setItem(
              "preferred-microphone-id",
              selectedMicrophoneId
            );
          }
        });

        // Initialize on load
        initializeMicrophones();

        // Update microphone list when devices change
        navigator.mediaDevices.addEventListener(
          "devicechange",
          loadMicrophones
        );
      </script>
    </sapling-island>
  `;
}

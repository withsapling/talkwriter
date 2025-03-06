import { html } from "@sapling/sapling";

export function Talkwriter() {
  return html`
    <div class="w-full talkwriter-container" style="display: none;">
      <div id="textarea-container" class="hidden">
        <div class="w-full">
          <textarea
            id="message-input"
            class="w-full h-48 p-4 mb-4 rounded-[16px] border shadow-sm focus:outline-none transition-all duration-200 font-medium resize-none"
            placeholder="Your transcription will appear here..."
          ></textarea>
        </div>

        <div class="flex flex-col space-y-3 w-full">
          <button
            id="new-recording-button"
            class="px-4 py-3 text-white rounded-[16px] transition-all duration-200 font-medium w-full"
          >
            New Recording
          </button>

          <button
            id="copy-button"
            class="px-4 py-3 rounded-[16px] transition-all duration-200 font-medium w-full text-center"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>

      <div id="microphone-container" class="flex justify-center">
        <sapling-island>
          <template>
            <style>
              .border-gradient {
                border-radius: 24px;
              }

              .border-gradient::before {
                content: "";
                position: absolute;
                inset: 0;
                border-radius: 24px;
                padding: 2px;
                background: linear-gradient(
                  180deg,
                  #383838 0%,
                  #141414 7%,
                  #000000 93%,
                  #212121 100%
                );
                -webkit-mask: linear-gradient(#fff 0 0) content-box,
                  linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
              }

              #voice-record-button {
                position: relative;
                background: linear-gradient(180deg, #1a1a1a 0%, #131313 100%);
                transform: translateY(0) translateX(0) rotate(0deg);
                transform-origin: center bottom;
                box-shadow: -1px 4px 10px rgba(0, 0, 0, 0.25);
                transition: all 0.08s ease-in-out;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              }

              /* Button press effect */
              #voice-record-button:active,
              #voice-record-button.pressed {
                transform: translateY(2px) translateX(1px) rotate(0.5deg);
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
                border-top-color: transparent;
              }

              #voice-record-button.recording ~ .border-gradient::before {
                background: linear-gradient(
                  180deg,
                  #383838 0%,
                  #141414 7%,
                  #000000 93%,
                  #212121 100%
                );
                opacity: 1;
                padding: 2.5px;
              }

              #voice-record-button.animate-pulse {
                animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              }

              @keyframes pulse {
                0%,
                100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.5;
                }
              }

              /* Additional styles for consistency */
              #new-recording-button,
              #copy-button {
                border: none;
                font-weight: 500;
                box-shadow: -1px 2px 4px rgba(0, 0, 0, 0.1);
                transform: translateY(0) translateX(0) rotate(0deg);
                transform-origin: center bottom;
                transition: all 0.08s ease-in-out;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              }

              #new-recording-button:active,
              #copy-button:active,
              #new-recording-button.pressed,
              #copy-button.pressed {
                transform: translateY(2px) translateX(1px) rotate(0.5deg);
                box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
                border-top-color: transparent;
              }

              #new-recording-button {
                background: #4285f4;
              }

              #new-recording-button:hover {
                background: #3367d6;
              }

              #copy-button {
                background: #f5f5f5;
                color: #333333;
              }

              #copy-button:hover {
                background: #e8e8e8;
              }

              #message-input {
                background: #f5f5f5;
                color: #333333;
                border-color: #e0e0e0;
              }

              #message-input:focus {
                border-color: #4285f4;
                box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
              }
            </style>
            <script type="module">
              // Wrap in IIFE to allow return statements
              (function () {
                const recordButton = document.getElementById(
                  "voice-record-button"
                );
                const textareaContainer =
                  document.getElementById("textarea-container");
                const microphoneContainer = document.getElementById(
                  "microphone-container"
                );
                const messageInput = document.getElementById("message-input");
                const newRecordingButton = document.getElementById(
                  "new-recording-button"
                );
                const copyButton = document.getElementById("copy-button");
                const microphoneIcon =
                  document.getElementById("microphone-icon");
                const stopIcon = document.getElementById("stop-icon");

                // Exit if required elements don't exist
                if (
                  !recordButton ||
                  !textareaContainer ||
                  !microphoneContainer
                ) {
                  console.error("Required elements not found");
                  return;
                }

                let mediaRecorder = null;
                let audioChunks = [];
                let isRecording = false;
                let recordingTimeout = null;
                let audioStream = null;

                // Function to reset UI state for a new recording
                function resetForNewRecording() {
                  // Hide textarea, show microphone
                  textareaContainer.classList.add("hidden");
                  microphoneContainer.classList.remove("hidden");
                  microphoneContainer.classList.add("flex");
                  // Clear the textarea
                  if (messageInput) {
                    messageInput.value = "";
                  }
                }

                // Handle new recording button click
                if (newRecordingButton) {
                  newRecordingButton.addEventListener(
                    "click",
                    resetForNewRecording
                  );

                  // Add press effect
                  newRecordingButton.addEventListener("mousedown", () => {
                    newRecordingButton.classList.add("pressed");
                  });

                  newRecordingButton.addEventListener("mouseup", () => {
                    newRecordingButton.classList.remove("pressed");
                  });

                  newRecordingButton.addEventListener("mouseleave", () => {
                    newRecordingButton.classList.remove("pressed");
                  });
                }

                // Handle copy button click
                if (copyButton) {
                  copyButton.addEventListener("click", () => {
                    if (messageInput && messageInput.value) {
                      navigator.clipboard
                        .writeText(messageInput.value)
                        .catch((err) => {
                          console.error("Failed to copy to clipboard:", err);
                        });
                    }
                  });

                  // Add press effect
                  copyButton.addEventListener("mousedown", () => {
                    copyButton.classList.add("pressed");
                  });

                  copyButton.addEventListener("mouseup", () => {
                    copyButton.classList.remove("pressed");
                  });

                  copyButton.addEventListener("mouseleave", () => {
                    copyButton.classList.remove("pressed");
                  });
                }

                async function startRecording() {
                  try {
                    // Clean up any existing stream first
                    if (audioStream) {
                      audioStream.getTracks().forEach((track) => track.stop());
                    }

                    // Get preferred microphone from localStorage
                    const preferredMicrophoneId = localStorage.getItem(
                      "preferred-microphone-id"
                    );
                    console.log(
                      "Using preferred microphone ID:",
                      preferredMicrophoneId
                    );

                    const constraints = {
                      audio: preferredMicrophoneId
                        ? { deviceId: { exact: preferredMicrophoneId } }
                        : true,
                    };
                    console.log("Using constraints:", constraints);

                    audioStream = await navigator.mediaDevices.getUserMedia(
                      constraints
                    );
                    console.log(
                      "Got audio stream with tracks:",
                      audioStream.getAudioTracks().map((track) => ({
                        label: track.label,
                        id: track.id,
                      }))
                    );

                    mediaRecorder = new MediaRecorder(audioStream);
                    audioChunks = [];

                    mediaRecorder.ondataavailable = (event) => {
                      if (event.data.size > 0) {
                        audioChunks.push(event.data);
                      }
                    };

                    mediaRecorder.onstart = () => {
                      isRecording = true;
                      recordButton.classList.add("recording");
                      // Show stop icon, hide microphone icon
                      if (microphoneIcon && stopIcon) {
                        microphoneIcon.style.display = "none";
                        stopIcon.style.display = "block";
                      }
                      console.log("Recording started");
                    };

                    mediaRecorder.onstop = async () => {
                      isRecording = false;
                      recordButton.classList.remove("recording");
                      console.log("Recording stopped");

                      // Clean up the stream
                      if (audioStream) {
                        audioStream
                          .getTracks()
                          .forEach((track) => track.stop());
                      }

                      const audioBlob = new Blob(audioChunks, {
                        type: "audio/webm",
                      });
                      const formData = new FormData();
                      formData.append("audio", audioBlob);

                      // Get API key from local storage
                      const apiKey = localStorage.getItem("geminiApiKey");
                      if (!apiKey) {
                        console.error("No API key found in local storage");
                        return;
                      }

                      // Add the API key to the form data
                      formData.append("apiKey", apiKey);

                      try {
                        recordButton.classList.add("animate-pulse");
                        const response = await fetch("/api/transcribe", {
                          method: "POST",
                          body: formData,
                        });

                        const data = await response.json();
                        if (data.error) {
                          console.error("Transcription error:", data.error);
                        } else if (data.transcription) {
                          // Copy to clipboard
                          navigator.clipboard
                            .writeText(data.transcription)
                            .catch((err) => {
                              console.error(
                                "Failed to copy to clipboard:",
                                err
                              );
                            });

                          // Get a fresh reference to the message input element
                          const currentMessageInput =
                            document.getElementById("message-input");

                          console.log(
                            "Trying to set transcription. Element found:",
                            currentMessageInput !== null
                          );

                          // Set in textarea if it exists
                          if (currentMessageInput) {
                            currentMessageInput.value = data.transcription;
                            // Trigger input event to adjust textarea height
                            currentMessageInput.dispatchEvent(
                              new Event("input")
                            );
                            console.log("Transcription set successfully");

                            // Show textarea, hide microphone
                            textareaContainer.classList.remove("hidden");
                            microphoneContainer.classList.remove("flex");
                            microphoneContainer.classList.add("hidden");
                          } else {
                            console.error(
                              "Message input element not found when trying to set transcription"
                            );
                          }
                        }
                      } catch (error) {
                        console.error("Error sending audio:", error);
                      } finally {
                        recordButton.classList.remove("animate-pulse");
                      }
                    };

                    mediaRecorder.start();

                    // Set 15-second timeout
                    recordingTimeout = setTimeout(() => {
                      if (isRecording) {
                        stopRecording();
                      }
                    }, 15000);
                  } catch (err) {
                    console.error("Error accessing microphone:", err);
                  }
                }

                function stopRecording() {
                  if (mediaRecorder && mediaRecorder.state === "recording") {
                    console.log("Stopping recording...");
                    clearTimeout(recordingTimeout);
                    try {
                      mediaRecorder.stop();
                    } catch (error) {
                      console.error("Error stopping recorder:", error);
                    }

                    // Ensure state is reset even if stop() fails
                    isRecording = false;
                    recordButton.classList.remove("recording");

                    // Show microphone icon, hide stop icon
                    if (microphoneIcon && stopIcon) {
                      microphoneIcon.style.display = "block";
                      stopIcon.style.display = "none";
                    }

                    // Clean up the stream regardless
                    if (audioStream) {
                      audioStream.getTracks().forEach((track) => track.stop());
                      audioStream = null;
                    }
                  }
                }

                function toggleRecording() {
                  console.log("Toggle recording. Current state:", isRecording);
                  if (!isRecording) {
                    startRecording();
                  } else {
                    stopRecording();
                  }
                }

                // Add keyboard shortcut listener
                document.addEventListener("keydown", (e) => {
                  if ((e.metaKey && e.key === "m") || e.code === "Space") {
                    // Only use keyboard shortcuts when microphone is visible
                    if (!microphoneContainer.classList.contains("hidden")) {
                      e.preventDefault();
                      recordButton.classList.add("pressed");
                      toggleRecording();
                    }
                  }
                });

                document.addEventListener("keyup", (e) => {
                  if ((e.metaKey && e.key === "m") || e.code === "Space") {
                    recordButton.classList.remove("pressed");
                  }
                });

                recordButton.addEventListener("click", toggleRecording);

                // Add mousedown/mouseup effects for the press animation
                recordButton.addEventListener("mousedown", () => {
                  recordButton.classList.add("pressed");
                });

                recordButton.addEventListener("mouseup", () => {
                  recordButton.classList.remove("pressed");
                });

                recordButton.addEventListener("mouseleave", () => {
                  recordButton.classList.remove("pressed");
                });
              })();
            </script>
          </template>
          <div class="relative inline-block">
            <button
              id="voice-record-button"
              type="button"
              class="p-6 rounded-[24px] flex items-center justify-center transition-all duration-200 relative z-10"
              style="background: linear-gradient(180deg, #1A1A1A 0%, #131313 100%); box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);"
              title="Record Voice Message (⌘M or Space)"
            >
              <iconify-icon
                id="microphone-icon"
                icon="lucide:mic"
                width="64"
                height="64"
                class="text-white"
              ></iconify-icon>
              <iconify-icon
                id="stop-icon"
                icon="mdi:stop-circle"
                width="64"
                height="64"
                class="text-white"
                style="display: none;"
              ></iconify-icon>
            </button>
            <div
              class="absolute inset-0 rounded-[24px] border-gradient pointer-events-none"
            ></div>
          </div>
        </sapling-island>
      </div>
    </div>
  `;
}

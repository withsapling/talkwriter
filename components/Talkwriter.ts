import { html } from "@sapling/sapling";

export function Talkwriter() {
  return html`
    <div class="talkwriter-container">
      <div id="textarea-container" class="hidden">
        <textarea
          id="message-input"
          class="w-full h-48 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        ></textarea>

        <div class="flex justify-between">
          <button
            id="new-recording-button"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            New Recording
          </button>

          <button
            id="copy-button"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>

      <div id="microphone-container">
        <sapling-island>
          <template>
            <script>
              document.addEventListener("DOMContentLoaded", () => {
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
                }

                // Handle copy button click
                if (copyButton) {
                  copyButton.addEventListener("click", () => {
                    if (messageInput && messageInput.value) {
                      navigator.clipboard
                        .writeText(messageInput.value)
                        .then(() => {
                          copyButton.textContent = "Copied!";
                          setTimeout(() => {
                            copyButton.textContent = "Copy to Clipboard";
                          }, 2000);
                        })
                        .catch((err) => {
                          console.error("Failed to copy to clipboard:", err);
                        });
                    }
                  });
                }

                async function startRecording() {
                  try {
                    // Clean up any existing stream first
                    if (audioStream) {
                      audioStream.getTracks().forEach((track) => track.stop());
                    }

                    audioStream = await navigator.mediaDevices.getUserMedia({
                      audio: true,
                    });

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
                      const apiKey = localStorage.getItem("gemini_api_key");
                      if (!apiKey) {
                        console.error("No API key found in local storage");
                        return;
                      }

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
                      toggleRecording();
                    }
                  }
                });

                recordButton.addEventListener("click", toggleRecording);
              });
            </script>
          </template>
          <button
            id="voice-record-button"
            type="button"
            class="p-2 rounded-full flex items-center justify-center transition-colors duration-200"
            title="Record Voice Message (⌘M or Space)"
          >
            <iconify-icon
              icon="mdi:microphone"
              width="64"
              height="64"
            ></iconify-icon>
          </button>
        </sapling-island>
      </div>
    </div>
  `;
}

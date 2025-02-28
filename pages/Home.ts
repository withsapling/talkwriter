import { html } from "@sapling/sapling";
import Layout from "../layouts/Layout.ts";

export async function Home() {
  return await Layout({
    children: await html`
      <main
        class="max-w-screen-lg min-h-screen mx-auto px-4 py-16 flex flex-col items-center justify-center font-sans"
      >
        <div class="w-full max-w-md rounded-lg shadow-md p-6">
          <sapling-island>
            <template>
              <script>
                document.addEventListener("DOMContentLoaded", () => {
                  // DOM Elements
                  const recordingInfo =
                    document.getElementById("recording-info");
                  const startButton =
                    document.getElementById("start-recording");
                  const stopButton = document.getElementById("stop-recording");
                  const errorMessage = document.getElementById("error-message");
                  const loadingIndicator =
                    document.getElementById("loading-indicator");
                  const transcriptionResult = document.getElementById(
                    "transcription-result"
                  );
                  const transcriptionText =
                    document.getElementById("transcription-text");
                  const resetButton = document.getElementById("reset-button");
                  const recordingTimeDisplay =
                    document.getElementById("recording-time");

                  // State variables
                  let isRecording = false;
                  let recordingTime = 0;
                  let timer = null;
                  let mediaRecorder = null;
                  let audioChunks = [];

                  // Helper Functions
                  function formatTime(seconds) {
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    return (
                      minutes +
                      ":" +
                      remainingSeconds.toString().padStart(2, "0")
                    );
                  }

                  function updateUI() {
                    // Update visibility based on state
                    recordingInfo.style.display = isRecording
                      ? "block"
                      : "none";
                    startButton.style.display = isRecording
                      ? "none"
                      : "inline-flex";
                    stopButton.style.display = isRecording
                      ? "inline-flex"
                      : "none";

                    // Update recording time if recording
                    if (isRecording) {
                      recordingTimeDisplay.textContent =
                        formatTime(recordingTime);
                    }
                  }

                  function showLoading(show) {
                    loadingIndicator.style.display = show ? "flex" : "none";
                    document.getElementById("recording-ui").style.display = show
                      ? "none"
                      : "flex";
                  }

                  function showTranscription(text) {
                    transcriptionResult.style.display = "block";
                    transcriptionText.textContent = text;
                    document.getElementById("recording-ui").style.display =
                      "none";
                  }

                  function showError(message) {
                    errorMessage.textContent = message;
                    errorMessage.style.display = message ? "block" : "none";
                  }

                  // Event handlers
                  async function startRecording() {
                    try {
                      audioChunks = [];
                      showError("");
                      transcriptionResult.style.display = "none";

                      const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                      });
                      mediaRecorder = new MediaRecorder(stream);

                      mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                          audioChunks.push(event.data);
                        }
                      };

                      mediaRecorder.onstop = async () => {
                        await sendAudioToAPI();
                      };

                      mediaRecorder.start();
                      isRecording = true;
                      recordingTime = 0;

                      timer = setInterval(() => {
                        recordingTime++;
                        recordingTimeDisplay.textContent =
                          formatTime(recordingTime);
                      }, 1000);

                      updateUI();
                    } catch (err) {
                      showError(
                        "Could not access microphone. Please make sure it's connected and permissions are granted."
                      );
                      console.error("Error accessing media devices:", err);
                    }
                  }

                  function stopRecording() {
                    if (mediaRecorder && isRecording) {
                      mediaRecorder.stop();
                      mediaRecorder.stream
                        .getTracks()
                        .forEach((track) => track.stop());
                      clearInterval(timer);
                      isRecording = false;
                      updateUI();
                    }
                  }

                  async function sendAudioToAPI() {
                    try {
                      showLoading(true);
                      const audioBlob = new Blob(audioChunks, {
                        type: "audio/webm",
                      });

                      const formData = new FormData();
                      formData.append("audio", audioBlob);

                      const response = await fetch("/api/transcribe", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await response.json();

                      if (data.error) {
                        showError(data.error);
                        showLoading(false);
                      } else {
                        showTranscription(data.transcription);
                        showLoading(false);
                      }
                    } catch (err) {
                      showError(
                        "Failed to transcribe audio. Please try again."
                      );
                      showLoading(false);
                      console.error("Error sending audio:", err);
                    }
                  }

                  function reset() {
                    isRecording = false;
                    recordingTime = 0;
                    audioChunks = [];
                    showError("");

                    if (timer) {
                      clearInterval(timer);
                      timer = null;
                    }

                    if (mediaRecorder && mediaRecorder.state !== "inactive") {
                      mediaRecorder.stop();
                      mediaRecorder.stream
                        .getTracks()
                        .forEach((track) => track.stop());
                    }

                    transcriptionResult.style.display = "none";
                    document.getElementById("recording-ui").style.display =
                      "flex";
                    updateUI();
                  }

                  // Event Listeners
                  startButton.addEventListener("click", startRecording);
                  stopButton.addEventListener("click", stopRecording);
                  resetButton.addEventListener("click", reset);

                  // Initialize UI
                  updateUI();
                });
              </script>
            </template>

            <div class="flex flex-col items-center">
              <!-- Recording UI -->
              <div id="recording-ui" class="flex flex-col items-center w-full">
                <div
                  id="recording-info"
                  class="text-lg mb-4 font-medium"
                  style="display: none"
                >
                  Recording:
                  <span id="recording-time" class="font-mono text-red-600 ml-1"
                    >0:00</span
                  >
                </div>

                <button
                  id="start-recording"
                  class="max-w-xs w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center mb-4 shadow-md transition-all duration-200 text-lg font-medium"
                  style="display: inline-flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style="flex-shrink: 0"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Start Recording
                </button>

                <button
                  id="stop-recording"
                  class="max-w-xs w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center mb-4 shadow-md transition-all duration-200 text-lg font-medium"
                  style="display: none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Stop Recording
                </button>

                <p
                  id="error-message"
                  class="text-red-500 mt-4 text-center"
                  style="display: none"
                ></p>
              </div>

              <!-- Loading indicator -->
              <div
                id="loading-indicator"
                class="flex flex-col items-center"
                style="display: none"
              >
                <div
                  class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-4 border-t-blue-600 mb-4"
                ></div>
                <p class="text-gray-600 font-medium">
                  Transcribing your audio...
                </p>
              </div>

              <!-- Transcription result -->
              <div
                id="transcription-result"
                class="w-full flex flex-col items-center"
                style="display: none"
              >
                <div class="rounded-lg p-4 mb-4 text-center max-w-xs">
                  <h3 class="font-bold mb-2">Transcription:</h3>
                  <p id="transcription-text" class="whitespace-pre-wrap"></p>
                </div>

                <button
                  id="reset-button"
                  class="max-w-xs w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg inline-flex items-center justify-center shadow-md transition-all duration-200 text-lg font-medium"
                  style="display: inline-flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style="flex-shrink: 0"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Record Again
                </button>
              </div>
            </div>
          </sapling-island>
        </div>
      </main>
    `,
  });
}

<script setup>
import { scan } from '@/scan';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

const showModal = ref(false);
const canvas = document.createElement("canvas");
const video = ref();
const stream = ref();
const error = ref();
let cameraDir = false;

async function openModal() {
  error.value = null;
  showModal.value = true;
  try {
    // Find the input with the best resolution
    stream.value = await navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoInput = devices.find(device => device.kind === 'videoinput');
        if (!videoInput) throw new Error('No video input devices found.');
        return navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: cameraDir ? 'user' : 'environment' },
            deviceId: videoInput.deviceId,
            width: { ideal: 1280 }
          }
        });
      });
    if (video.value)
      video.value.srcObject = stream.value;
  } catch (err) {
    if (err instanceof OverconstrainedError) {
      error.value = "Invalid camera";
    } else {
      error.value = err;
      console.error("Camera error:", err);
    }
  }
}

function takePhoto() {
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;
  canvas.getContext('2d').drawImage(video.value, 0, 0);
  scan(canvas);
  closeModal();
}

function swapCamera() {
  closeModal();
  cameraDir = !cameraDir;
  openModal();
}

function closeModal() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
  }
  showModal.value = false;
}
</script>

<template>
  <button @click="openModal">Take picture</button>
  <div v-if="showModal" class="modal-container">
    <div class="modal">
      <button @click="closeModal" class="modal-close">Close</button>
      <h2>Camera feed</h2>
      <video v-if="!error" ref="video" autoplay></video>
      <div class="buttons">
        <button @click="swapCamera">
          <FontAwesomeIcon :icon="fas.faCameraRotate" />
        </button>
        <button v-if="!error" @click="takePhoto">Take photo</button>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
video {
  display: block;
  max-width: 50vw;
  max-height: 50vh;
  border: solid 1px black;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 5px;
}

button {
  display: inline-block;
  margin: auto;
}

.buttons {
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div v-show="isConfigured" ref="buttonContainer" class="flex justify-center"></div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: "continue_with",
  },
});

const emit = defineEmits(["credential"]);
const buttonContainer = ref(null);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const isConfigured = computed(() => Boolean(googleClientId));

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector("script[data-google-identity]");

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });
};

const renderButton = async () => {
  if (!googleClientId || !buttonContainer.value) return;

  await loadGoogleScript();
  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: (response) => emit("credential", response.credential),
  });
  window.google.accounts.id.renderButton(buttonContainer.value, {
    theme: "outline",
    size: "large",
    text: props.text,
    shape: "rectangular",
    width: buttonContainer.value.clientWidth || 360,
  });
};

onMounted(renderButton);
</script>

<template>
  <div class="relative mt-2">
    <input
      v-bind="$attrs"
      :value="modelValue"
      :type="visible ? 'text' : 'password'"
      class="w-full rounded-md border border-emerald-900/15 px-3 py-3 pr-24 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1 text-xs font-semibold text-brand hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-brand/20"
      type="button"
      :aria-label="visible ? 'Sembunyikan password' : 'Lihat password'"
      @click="visible = !visible"
    >
      {{ visible ? "Sembunyikan" : "Lihat" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  inheritAttrs: false,
});

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);

const visible = ref(false);
</script>

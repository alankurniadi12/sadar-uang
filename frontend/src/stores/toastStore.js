import { defineStore } from "pinia";

const DEFAULT_DURATION = 3200;

export const useToastStore = defineStore("toast", {
  state: () => ({
    items: [],
  }),
  actions: {
    show({ message, type = "success", duration = DEFAULT_DURATION }) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      this.items.push({
        id,
        message,
        type,
      });

      window.setTimeout(() => {
        this.dismiss(id);
      }, duration);
    },
    success(message) {
      this.show({ message, type: "success" });
    },
    error(message) {
      this.show({ message, type: "error" });
    },
    dismiss(id) {
      this.items = this.items.filter((item) => item.id !== id);
    },
  },
});

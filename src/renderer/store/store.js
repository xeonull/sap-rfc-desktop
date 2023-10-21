import { reactive } from "vue";

function getStoredItem(s) {
  if (!s) {
    throw new Error("Undefined stored string");
  }
  return localStorage.getItem(s);
}

function setStoredItem(s, v) {
  if (!s) {
    throw new Error("Undefined stored string");
  }
  return localStorage.setItem(s, v);
}

export const store = reactive({
  systemHost: "no-sys",
  systemHostList: [],

  updateSystemHostList(list) {
    if (list && list.length > 0) {
      this.systemHostList = list;
      this.systemHost = this.systemHostList[0];
    }
  },

  get tableMaxRows() {
    const res = getStoredItem("tableMaxRows");
    if (!res) {
      return 1000;
    }
    const n = parseInt(res);
    if (isNaN(n)) {
      return 1000;
    }
    return n;
  },
  set tableMaxRows(value) {
    setStoredItem("tableMaxRows", value);
  },

  get isDarkTheme() {
    const res = getStoredItem("isDarkTheme");
    if (!res) {
      return false;
    }
    return res === "true";
  },
  set isDarkTheme(value) {
    setStoredItem("isDarkTheme", value);
  },
});

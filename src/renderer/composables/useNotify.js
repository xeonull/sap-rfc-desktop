import { ref } from 'vue'

const snackbarShow = ref(false);
const snackbarText = ref("");

export function useNotify() {

    return { snackbarShow, snackbarText }
}
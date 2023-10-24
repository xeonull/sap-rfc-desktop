<template>
  <v-layout>
    <v-app-bar class="app-bar" :elevation="1" density="compact">
      <v-app-bar-title class="app-bar__title">SAP_RFC</v-app-bar-title>
      <template v-slot:image>
        <v-img class="app-bar__img"></v-img>
      </template>

      <v-tabs class="app-bar__tabs" density="compact" v-model="currentView">
        <v-tab v-for="c in components" :key="c.title" :value="c.component">
          {{ c.title }}
        </v-tab>
      </v-tabs>

      <AppSettings />
      <v-select class="app-bar__system-select" variant="solo" label="System" density="compact" v-model="store.systemHost" :items="store.systemHostList" />
    </v-app-bar>

    <v-main v-if="appIsInit" class="main">
      <KeepAlive>
        <component :is="currentView" />
      </KeepAlive>
    </v-main>

    <v-snackbar content-class="snackbar" v-model="snackbarShow" timeout="-1">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="tonal" @click="snackbarShow = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue';

import AppSettings from '@/components/AppSettings.vue';
import PageTable from '@/views/PageTable.vue';
import PagePackage from '@/views/PagePackage.vue';
import PageSchedule from '@/views/PageSchedule.vue';

import PageDocument from '@/views/PageDocument.vue';

import rfc from '@/ipc-api/RFC';
import { store } from '@/store/store.js';
import { useNotify } from '@/composables/useNotify.js';

const { snackbarShow, snackbarText } = useNotify();

const currentView = shallowRef(PageTable);
const appIsInit = ref(false);

const components = [
  { component: PageTable, title: 'Table' },
  { component: PagePackage, title: 'Package' },
  { component: PageSchedule, title: 'Schedule' },
  { component: PageDocument, title: 'Document' },
];

const loadSystems = async () => {
  try {
    const res = await rfc.getSystemCodes();
    store.updateSystemHostList(res);
    appIsInit.value = true;
  } catch (err) {
    snackbarText.value = err.message;
    snackbarShow.value = true;
    console.log('err:', err);
  }
};

onMounted(loadSystems);
</script>

<style lang="scss"></style>

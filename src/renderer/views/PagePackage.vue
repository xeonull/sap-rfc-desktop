<template>
  <div class="page">
    <v-overlay class="align-center justify-center" persistent v-model="loadingList">
      <v-progress-circular :size="50" color="blue" indeterminate></v-progress-circular>
    </v-overlay>

    <v-expansion-panels v-model="expansionPanel" class="page__block">
      <v-expansion-panel class="tool-pane" value="tools">
        <v-expansion-panel-title class="tool-pane__title">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters>
              <v-col cols="3"> Package Options </v-col>
              <v-col cols="9">
                <v-fade-transition leave-absolute>
                  <span v-if="!expanded" class="text-tip">
                    <span class="text-tip__item"><span class="text-tip__label">Environment:</span> {{ environmentValue }}</span>
                    <span class="text-tip__item"><span class="text-tip__label">Model:</span> {{ modelValue }}</span>
                    <span class="text-tip__item"><span class="text-tip__label">Package:</span> {{ package_name }}</span>
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="tool-pane__content general-box">
            <div class="general-box__left">
              <v-label>{{ `Choose Environment, Model and Package name` }}</v-label>
              <v-select
                class="option-input"
                label="Environment"
                variant="solo"
                density="compact"
                :items="environmentList"
                v-model="environmentValue"></v-select>

              <v-select class="option-input" label="Model" variant="solo" density="compact" :items="modelList" v-model="modelValue"></v-select>

              <div class="input-with-button-box">
                <v-autocomplete
                  class="option-input"
                  label="Package"
                  variant="solo"
                  density="compact"
                  persistent-hint
                  :hint="normTable.length ? `Rows: ${normTable.length}` : ``"
                  v-model="package_name"
                  v-model:search="package_search"
                  :items="packagesListApplShort"
                  :loading="loadingFilter"></v-autocomplete>
                <v-btn
                  class="input-with-button-box__button primary-button"
                  cstm-height
                  :disabled="!package_name"
                  @click="loadPackageTable"
                  :loading="loadingTab">
                  Load package info
                </v-btn>
              </div>
            </div>

            <div class="general-box__right"></div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="page__block">
      <DataTable :table="normTable" :fileds="normFields" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

import DataTable from '@/components/DataTable.vue';

import rfc from '@/ipc-api/RFC';
import { store } from '@/store/store.js';
import { useNotify } from '@/composables/useNotify.js';

const expansionPanel = ref(['tools']);

const loadingList = ref(false);
const loadingTab = ref(false);
const loadingFilter = ref(false);
const normTable = ref([]);
const normFields = ref([]);

const packagesList = ref([]); // Список пакетов для всех сред и моделей
const packagesListAppl = ref([]); // Список пакетов для выбранной среды и модели
const packagesListApplShort = ref([]); // Список отфильтрованных пакетов выбранной среды и модели

const environmentList = ref([]);
const environmentValue = ref(null);

const modelList = ref([]);
const modelValue = ref(null);

const package_name = ref('');
const package_search = ref(null);

const { snackbarShow, snackbarText } = useNotify();

const updateModelList = () => {
  modelList.value = packagesList.value
    ? [
        ...packagesList.value.reduce((a, v) => {
          if (v.APPSET_ID === environmentValue.value) a.add(v.APP_ID);
          return a;
        }, new Set()),
      ]
    : null;
};

const updatePackageList = () => {
  packagesListAppl.value = packagesList.value
    ? [
        ...packagesList.value.reduce((a, v) => {
          if (v.APPSET_ID === environmentValue.value && v.APP_ID === modelValue.value) a.add(v.PACKAGE_ID);
          return a;
        }, new Set()),
      ]
    : null;
  packagesListAppl.value.sort();
  packagesListApplShort.value = packagesListAppl.value.slice();
};

/* Следим за изменением среды - меняем список моделей */
watch(environmentValue, () => {
  updateModelList();
  modelValue.value = modelList.value?.length ? modelList.value[0] : null;
});

/* Следим за изменением модели - меняем список пакетов */
watch(modelValue, () => {
  updatePackageList();
  package_name.value = packagesListAppl.value?.length ? packagesListAppl.value[0] : null;
});

/* Следим за изменением sap системы */
watch(
  () => store.systemHost,
  () => {
    loadPackageList();
    normTable.value.length = 0;
    normFields.value.length = 0;
    expansionPanel.value = ['tools']; // Expand tools expansion panel
  }
);

/* Следим за изменением названия таблицы */
watch(package_search, (val) => {
  val !== package_name.value && updateListView(val);
});

const updateListView = (value) => {
  loadingFilter.value = true;
  try {
    packagesListApplShort.value = packagesListAppl.value.filter((e) => {
      return (e || '').toUpperCase().indexOf((value || '').toUpperCase()) > -1;
    });
  } finally {
    loadingFilter.value = false;
  }
};

const loadPackageTable = async () => {
  loadingTab.value = true;
  try {
    const content = await rfc.getPackage(store.systemHost, environmentValue.value, modelValue.value, package_name.value);
    if (content.table && content.fields) {
      normTable.value = content.table;
      normFields.value = content.fields;
    } else {
      normTable.value.length = 0;
    }
    expansionPanel.value = []; // Hide tools expansion panel
  } catch (err) {
    snackbarText.value = err.message;
    snackbarShow.value = true;
  } finally {
    loadingTab.value = false;
  }
};

const loadPackageList = async () => {
  snackbarShow.value = false;
  loadingList.value = true;
  try {
    const content = await rfc.getPackageList(store.systemHost);
    if (content.table) {
      packagesList.value = content.table;
      environmentList.value = [...new Set(packagesList.value.map((e) => e.APPSET_ID))];
      // Оставляем предыдущее значение Среды, если оно уже было выбрано ранее и также есть в обновленном списке, иначе берем первое
      if (!environmentValue.value || environmentList.value.indexOf(environmentValue.value) === -1) {
        // При изменении Среды список пакетов обновиться через watch
        environmentValue.value = environmentList.value?.length ? environmentList.value[0] : null;
      } else updateModelList();

      // Оставляем предыдущее значение Модели, если оно уже было выбрано ранее и есть в обновленном списке, иначе берем первое
      if (!modelValue.value || modelList.value.indexOf(modelValue.value) === -1) {
        // При изменении Модели список пакетов обновиться через watch
        modelValue.value = modelList.value?.length ? modelList.value[0] : null;
      } else updatePackageList();

      // Оставляем предыдущее значение Пакета, если оно уже было выбрано ранее и есть в обновленном списке, иначе берем первое
      if (!package_name.value || packagesListAppl.value.indexOf(package_name.value) === -1) {
        package_name.value = packagesListAppl.value?.length ? packagesListAppl.value[0] : null;
      }
    } else {
      packagesList.value.length = 0;
    }
  } catch (err) {
    snackbarText.value = err.message;
    snackbarShow.value = true;
  } finally {
    loadingList.value = false;
  }
};

onMounted(loadPackageList);
</script>

<style lang="scss"></style>

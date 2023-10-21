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
              <v-col cols="4"> Document Options </v-col>
              <v-col cols="8">
                <v-fade-transition leave-absolute>
                  <span v-if="!expanded" class="text-tip">
                    <span class="text-tip__item"><span class="text-tip__label">Environment:</span> {{ environmentValue }} </span>
                    <span class="text-tip__item"><span class="text-tip__label">Types:</span> {{ docTypesSelect_text }}</span>
                    <span class="text-tip__item" v-if="!!search"><span class="text-tip__label">Filter:</span> "{{ search }}"</span>
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div class="tool-pane__content general-box">
            <div class="general-box__left">
              <v-select
                class="option-input"
                label="Environment"
                variant="solo"
                density="compact"
                :items="environmentList"
                v-model="environmentValue"></v-select>
              <div class="input-with-button-box">
                <v-select
                  class="pinput-with-button-box__input option-input"
                  label="Document types"
                  variant="solo"
                  density="compact"
                  multiple
                  chips
                  :items="docTypes"
                  item-value="id"
                  item-text="title"
                  v-model="docTypesSelect">
                  <template v-slot:prepend-item>
                    <v-list-item title="Select All" @click="docTypesToggle">
                      <template v-slot:prepend>
                        <v-checkbox-btn
                          :indeterminate="docTypesSelect.length > 0 && docTypesSelect.length < docTypes.length"
                          :model-value="docTypesSelect.length === docTypes.length"></v-checkbox-btn>
                      </template>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                </v-select>
                <v-btn
                  class="input-with-button-box__button primary-button"
                  cstm-height
                  :disabled="docTypesSelect.length === 0"
                  @click="loadDocuments"
                  :loading="loadingTab">
                  Load Documents
                </v-btn>
              </div>
            </div>
            <div class="general-box__right">
              <v-text-field
                class="filter-input"
                v-model="search"
                :disabled="normTable.length === 0"
                prepend-icon="mdi-magnify"
                label="Input text to filter the table"
                single-line
                hide-details
                variant="outlined"
                density="compact"></v-text-field>
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="page__block">
      <DataTable :table="normTable" :fileds="normFields" :search="search" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';

import DataTable from '@/components/DataTable.vue';

import api from '@/web/api.js';
import { store } from '@/store/store.js';
import { useNotify } from '@/composable/useNotify.js';

const expansionPanel = ref(['tools']);

const search = ref('');

const loadingList = ref(false);
const loadingTab = ref(false);

const normTable = ref([]); // Итоговая (подготовленная) таблица с данными
const normFields = ref([]); // Список полей итоговой таблицы

const environmentList = ref([]);
const environmentValue = ref(null);

const docTypes = ref([]); // Список типов документов
const docTypesSelect = ref([]); // Список выбранных типов документов

const { snackbarShow, snackbarText } = useNotify();

/* Следим за изменением sap системы */
watch(
  () => store.systemHost,
  () => {
    loadOptions();
    search.value = '';
    normTable.value.length = 0;
    normFields.value.length = 0;
    expansionPanel.value = ['tools']; // Expand tools expansion panel
  }
);

const docTypesSelect_text = computed(() => {
  if (docTypesSelect.value.length === docTypes.value.length) return 'All types';
  else if (docTypesSelect.value.length === 0) return 'No types';
  const max_num = 2;
  let extra_num = 0;
  const str = docTypesSelect.value.reduce((a, v, i) => {
    if (i < max_num) {
      const title = docTypes.value.find((e) => e.id === v).title;
      if (i === 0) {
        return title;
      } else {
        return `${a}, ${title}`;
      }
    } else {
      extra_num++;
      return a;
    }
  }, '');
  if (extra_num > 0) {
    return `${str} (+${extra_num} more)`;
  } else {
    return str;
  }
});

const docTypesToggle = async () => {
  if (docTypesSelect.value.length === docTypes.value.length) {
    docTypesSelect.value = [];
  } else {
    docTypesSelect.value = docTypes.value.map((e) => e.id);
  }
};

const loadEnvironments = async () => {
  const envList = await api.getEnvironment(store.systemHost);
  if (envList) {
    environmentList.value = envList;
    // Оставляем предыдущее значение Среды, если оно уже было выбрано ранее и также есть в обновленном списке, иначе берем значение по умолчанию
    if (!environmentValue.value || environmentList.value.indexOf(environmentValue.value) === -1) {
      environmentValue.value = environmentList.value?.length
        ? environmentList.value.length > 2
          ? environmentList.value[2]
          : environmentList.value[0]
        : null;
    }
  }
};

const loadDocumentTypes = async () => {
  const dt = await api.getDocumentTypes(store.systemHost);
  if (dt) {
    docTypes.value = dt;
    // Устанавливаем начальные значения
    if (docTypesSelect.value.length === 0) {
      docTypesSelect.value.push(docTypes.value[0].id);
      docTypesSelect.value.push(docTypes.value[1].id);
    }
  }
};

const loadOptions = async () => {
  snackbarShow.value = false;
  loadingList.value = true;
  return Promise.all([loadEnvironments(), loadDocumentTypes()])
    .catch((e) => {
      snackbarText.value = err.message;
      snackbarShow.value = true;
    })
    .finally(() => {
      loadingList.value = false;
    });
};

const loadDocuments = async () => {
  search.value = '';
  snackbarShow.value = false;
  loadingTab.value = true;
  try {
    if (docTypesSelect.value.length === 0) throw new Error('No document type is selected');
    // Если выбраны все типы, то отдаем пустой массив типов
    const doc_types = docTypesSelect.value.length === docTypes.value.length ? [] : Object.values(docTypesSelect.value);
    const content = await api.getDocument(store.systemHost, environmentValue.value, doc_types);
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

onMounted(loadOptions);
</script>

<style lang="scss"></style>

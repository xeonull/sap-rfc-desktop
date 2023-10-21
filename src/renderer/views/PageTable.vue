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
              <v-col cols="4"> Table Options </v-col>
              <v-col cols="8">
                <v-fade-transition leave-absolute>
                  <span v-if="!expanded" class="tool-pane__text text-tip">
                    <span class="text-tip__item" v-if="table_name"><span class="text-tip__label">Table:</span> {{ table_name }}</span>
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
              <v-label>
                {{ `Number of transparent tables of ${store.systemHost} system: ${tableList.length}` }}
              </v-label>
              <div class="input-with-button-box">
                <v-autocomplete
                  class="input-with-button-box__input option-input"
                  label="SAP Table"
                  variant="solo"
                  density="compact"
                  persistent-hint
                  :hint="normTable.length ? `Rows: ${normTable.length}` : ``"
                  v-model="table_name"
                  v-model:search="table_search"
                  :items="tableListShort"
                  :loading="loadingFilter"
                  :no-data-text="table_no_data_text"
                ></v-autocomplete>

                <v-btn class="input-with-button-box__button primary-button" cstm-height :disabled="!table_name" @click="loadTable" :loading="loadingTab">
                  Load table
                </v-btn>
              </div>
            </div>
            <div class="general-box__right">
              <v-text-field
                class="filter-input"
                :disabled="normTable.length === 0"
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Input text to filter the table"
                single-line
                hide-details
                variant="outlined"
                density="compact"
              ></v-text-field>
            </div>
          </div>
          <div class="additional-btn">
            <v-btn
              :icon="showFieldBox ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="showFieldBox = !showFieldBox"
              :disabled="!tableFieldList.length"
              density="compact"
            ></v-btn>
          </div>
          <v-expand-transition>
            <div v-show="showFieldBox" class="additional-box">
              <div class="additional-box__left">
                <div v-for="fld in tableFieldList" :key="fld.FIELDNAME">
                  <v-text-field :label="fld.FIELDNAME" placeholder="Input value" variant="outlined" v-model="fld.VALUE" density="compact" />
                </div>
              </div>
              <div class="additional-box__right">
                <v-tooltip location="right top">
                  <template v-slot:activator="{ props }">
                    <v-icon v-bind="props" icon="mdi-information-variant" />
                  </template>
                  <span class="additional-box__info-text">
                    <p>Use <v-icon icon="mdi-comma" /> for listing</p>
                    <p>Use <v-icon icon="mdi-asterisk" /> for masking</p>
                    <p>Use <v-icon icon="mdi-keyboard-space" /> for empty element</p>
                  </span>
                </v-tooltip>
              </div>
            </div>
          </v-expand-transition>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="page__block">
      <DataTable :table="normTable" :fileds="normFields" :search="search" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

import DataTable from '@/components/DataTable.vue';

import rfc from '@/ipc-api/RFC';
import { store } from '@/store/store.js';
import { useSapOption } from '@/composables/useSapTable.js';
import { useNotify } from '@/composables/useNotify.js';

const expansionPanel = ref(['tools']);
const search = ref('');
const showFieldBox = ref(false);

const loadingList = ref(false);
const loadingTab = ref(false);
const loadingFilter = ref(false);
const normTable = ref([]); // Итоговая (подготовленная) таблица с данными
const normFields = ref([]); // Список полей итоговой таблицы
const tableList = ref([]); // Список таблиц системы
const tableFieldList = ref([]); // Список полей выбранной таблицы (для фильтрации)
const tableListShort = ref([]); // Список таблиц системы (отфильтрованный в соответствии с условием), для отображения в интерфейсе

const { snackbarShow, snackbarText } = useNotify();

const table_name = ref('');
const table_search = ref(null);
const table_no_data_text = ref('');

/* Следим за изменением sap системы */
watch(
  () => store.systemHost,
  () => {
    loadTableList();
    search.value = '';
    normTable.value.length = 0;
    normFields.value.length = 0;
    expansionPanel.value = ['tools']; // Expand tools expansion panel
  }
);

/* Следим за изменением текста в поле с названием таблицы */
watch(table_search, (val) => {
  if (val.length < 3) {
    table_no_data_text.value = 'Type at least 3 characters';
    tableListShort.value = [];
  } else {
    updateListView(val);
    table_no_data_text.value = 'Such table was not found';
  }
});

/* Следим за изменением названия таблицы */
watch(table_name, () => {
  loadTableFields();
});

const updateListView = (value) => {
  loadingFilter.value = true;
  try {
    tableListShort.value = tableList.value.filter((e) => {
      return (e || '').indexOf((value || '').toUpperCase()) > -1;
    });
  } finally {
    loadingFilter.value = false;
  }
};

const loadTableFields = async () => {
  loadingFilter.value = true;
  try {
    const table = await rfc.getTableFieldList(store.systemHost, table_name.value);
    // Добавляем поле VALUE, где будет храниться введенное пользователем значение столбца таблицы
    if (table) {
      table.forEach((e) => {
        e.VALUE = '';
      });
      tableFieldList.value = table;
    }
  } catch (err) {
    snackbarText.value = err.message;
    snackbarShow.value = true;
  } finally {
    loadingFilter.value = false;
  }
};

const loadTable = async () => {
  search.value = '';
  loadingTab.value = true;
  try {
    const { filter } = useSapOption(tableFieldList.value);
    const content = await rfc.getTableContent(store.systemHost, table_name.value, filter);
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

const loadTableList = async () => {
  snackbarShow.value = false;
  loadingList.value = true;
  try {
    const table = await rfc.getTableList(store.systemHost);
    if (table) tableList.value = table;
  } catch (err) {
    snackbarText.value = err.message;
    snackbarShow.value = true;
  } finally {
    loadingList.value = false;
  }
};

onMounted(loadTableList);
</script>

<style lang="scss"></style>

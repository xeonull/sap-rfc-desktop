<template>
  <div>
    <v-data-table
      :headers="fileds"
      :items="table"
      :search="search"
      v-model:items-per-page="itemsPerPage"
      v-model:page="currentPage"
      v-if="fileds?.length"
      height="calc(100vh - 168px)"
      fixed-header
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, PropType } from "vue";
import { VDataTable } from "vuetify/labs/VDataTable";

type UnwrapReadonlyArrayType<A> = A extends Readonly<Array<infer I>> ? UnwrapReadonlyArrayType<I> : A
type DT = InstanceType<typeof VDataTable>;
type ReadonlyDataTableHeader = UnwrapReadonlyArrayType<DT['headers']>;

const props = defineProps({
  table: Array,
  fileds: Array as PropType<ReadonlyDataTableHeader[]>,
  search: String,
});
const itemsPerPage = ref(100);
const currentPage = ref(1);
watch(
  () => props.table,
  () => {
    // Set first page when table change
    currentPage.value = 1;
  }
);
</script>

<style scoped>
/* .vs-table {
  border-collapse: collapse;
  height: 80vh; 
  height: 200px;
  overflow-y: scroll; 
} */
</style>

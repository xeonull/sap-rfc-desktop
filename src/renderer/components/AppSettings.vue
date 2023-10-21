<template>
  <div class="settings">
    <v-switch
      class="settings__item"
      true-icon="mdi:mdi-weather-night"
      density="comfortable"
      false-icon="mdi:mdi-weather-sunny"
      v-model="store.isDarkTheme"
      color="secondary"
    ></v-switch>
    <v-menu :close-on-content-click="false" open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn class="settings__item secondary-button" v-bind="props" icon="mdi:mdi-cog" />
      </template>

      <v-card class="settings-content" min-width="200">
        <template v-slot:append>
          <v-text-field variant="underlined" label="Max Rows" v-model="store.tableMaxRows" type="number"></v-text-field>
        </template>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { useTheme } from "vuetify";
import { store } from "@/store/store.js";
import { watch } from "vue";
const theme = useTheme();

watch(
  () => store.isDarkTheme,
  (val) => (theme.global.name.value = val ? "corpDarkTheme" : "corpLightTheme")
);
</script>

<style lang="scss">
.settings {
  display: flex;
  &__item {
    margin-top: 22px;
    margin-right: 12px;
  }
}
.settings-content {
  padding: 16px 12px 0 0 !important;
}
</style>

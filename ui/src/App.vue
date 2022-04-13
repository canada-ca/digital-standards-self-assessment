<template>
  <div id="app">
    <i18n path=""></i18n>
    <nav-bar />
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { ActionTypes } from './store/actions';
import NavBar from '@/components/NavBar.vue';

export default Vue.extend({
  name: 'App',
  components: { NavBar },

  async created() {
    if (this.$store.getters.isInitialized === false) {
      await this.$store.dispatch(ActionTypes.SetAppData);
    }
    while (!this.$store.getters.isInitialized) {
      await this.delay(100);
    }
  },
  methods: {
    delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
});
</script>

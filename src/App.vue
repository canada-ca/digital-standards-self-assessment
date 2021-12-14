<template>
  <div id="app">
    <i18n path=""></i18n>
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { ActionTypes } from "./store/actions";
export default Vue.extend({
  name: "App",
  components: {},
  created() {
    if (this.$store.getters.isInitialized === false) {
      this.$store.dispatch(ActionTypes.SetAppData);
    }
  },
  mounted() {
    if (this.$store.getters.returnDisplayWelcome === true) {
      this.$bvModal.show("welcome-modal");
    }
  }
});
</script>

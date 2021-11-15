<template>
  <div>
    <b-modal id="welcome-modal" size="xl">
      <template #modal-header>
        <div v-html="markdownToHtml($t('notice.welcomeNoticeTitle'))">
          >
        </div>
      </template>
      <template #default>
        <div v-html="markdownToHtml($t('notice.welcomeNoticeBody'))"></div>
        <b-form-checkbox
          id="checkbox-notice"
          v-model="checkbox"
          name="checkbox-notice-modal"
          value="true"
          unchecked-value="false"
          size="lg"
        >
          {{ $t("notice.hideNotice") }}
        </b-form-checkbox>
      </template>
      <template #modal-footer>
        <b-button @click="updateNotice">OK</b-button>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { ActionTypes } from "@/store/actions";
import Vue from "vue";
export default Vue.extend({
  name: "BaseNotice",
  data() {
    return { checkbox: "false" };
  },
  beforeMount() {
    this.checkbox = this.$store.getters.returnDisplayWelcome ? "false" : "true";
  },
  computed: {
    displayNoticeStatus() {
      return this.$store.getters.returnDisplayWelcome;
    }
  },
  methods: {
    updateNotice() {
      let displayNotice: boolean;
      if (this.checkbox === "true") {
        displayNotice = false;
      } else {
        displayNotice = true;
      }
      // this.$store.commit("updateDisplayNotice", displayNotice);
      this.$store.dispatch(ActionTypes.UpdateDisplayNotice, displayNotice);
      this.$bvModal.hide("welcome-modal");
    },
    markdownToHtml(item: string) {
      const marked = require("marked");
      return marked(item);
      // return marked(messages.en.displayNoticeStatus)
    }
  }
});
</script>

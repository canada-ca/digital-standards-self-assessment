<template>
  <div class="mb-5">
    <h3>{{ $t("notice.welcomeNoticeTitle") }}</h3>
    <div v-html="markdownToHtml($t('notice.welcomeNoticeBody1'))"></div>
    <transition name="collapsed" mode="out-in">
      <div
        v-if="!collapsed"
        v-html="markdownToHtml($t('notice.welcomeNoticeBody2'))"
      ></div>
    </transition>
    <div class="text-right">
      <show-hide-link :hide="true" @onToggled="toggleCollapsed()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ShowHideLink from "./ShowHideLink.vue";
@Component({
  components: { ShowHideLink }
})
export default class Welcome extends Vue {
  collapsed = true;

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  markdownToHtml(item: string) {
    const marked = require("marked");
    return marked(item);
    // return marked(messages.en.displayNoticeStatus)
  }
}
</script>

<style scoped>
.collapsed-enter-active,
.collapsed-leave-active {
  transition: all 0.5s;
  height: 500px;
}
.collapsed-enter,
.collapsed-leave-to {
  opacity: 0;
  height: 0px;
}
</style>

<template>
  <span class="collapsed-toggle" @click="onClicked()">
    {{ $t(collapsed ? "show" : "hide") }}
    <i :class="toggleClass()" aria-hidden="true"></i>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class ShowHideLink extends Vue {
  @Prop()
  hide = true;

  collapsed = true;

  created() {
    this.collapsed = this.hide;
  }

  toggleClass() {
    return this.collapsed ? "fa fa-chevron-down" : "fa fa-chevron-up";
  }

  onClicked() {
    this.collapsed = !this.collapsed;
    this.$emit("onToggled", this.collapsed);
  }
}
</script>

<style scoped>
.collapsed-toggle {
  cursor: pointer;
  user-select: none;
  display: inline-block;
  font-family: Open Sans;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: left;
  color: #8e8e8e;
}
</style>

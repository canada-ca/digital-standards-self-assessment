<template>
  <a
    href="#"
    class="collapsed-toggle"
    @click.prevent="onClicked()"
    @keypress.space="onClicked()"
  >
    {{ $t(collapsed ? "showHideLink.show" : "showHideLink.hide") }}
    <i :class="toggleClass()" aria-hidden="true"></i>
  </a>
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
  text-decoration: none !important;
  user-select: none;
  display: inline-block;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: left;
  color: #4a4a4a;
  margin-top: -20px;
}
</style>

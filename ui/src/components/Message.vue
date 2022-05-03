<template>
  <b-alert
    :show="dismissCountDown"
    dismissible
    fade
    :variant="variant"
    @dismiss-count-down="countDownChanged"
    style="margin-top: 15px"
  >
    {{ $t(messageKey) }}
  </b-alert>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

export type MessageVariantType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

@Component({
  components: {},
})
export default class Message extends Vue {
  messageKey: string = '';
  variant: MessageVariantType = 'primary';
  dismissCountDown = 0;
  toggleAlert = false;

  showMessage(messageKey: string, variant: MessageVariantType) {
    this.messageKey = messageKey;
    this.variant = variant;
    this.dismissCountDown = 5;
  }

  countDownChanged(dismissCountDown: number) {
    this.dismissCountDown = dismissCountDown;
  }
}
</script>

<style scoped>
.alert-primary > :first-child:before,
.alert-secondary > :first-child:before,
.alert-success > :first-child:before,
.alert-danger > :first-child:before,
.alert-warning > :first-child:before,
.alert-info > :first-child:before,
.alert-light > :first-child:before,
.alert-dark > :first-child:before {
  content: none !important;
  font-size: 24px !important;
}
</style>

<template>
  <div v-if="hasError" class="error-wrapper">
    <div class="error-message" v-for="(error, index) in errorMessages" :key="index">{{ $t(error.message) }}</div>
  </div>
</template>

<script lang="ts">
import { Errors } from '@/interfaces/ErrorMessage';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class ErrorMessage extends Vue {
  @Prop() filedName!: string;
  @Prop() errors!: Errors;

  get errorMessages() {
    if (this.filedName) {
      return this.errors.fieldErrors?.filter((fe) => fe.fieldName === this.filedName).map((fe) => fe.message);
    } else {
      return this.errors.globalErrors?.map((ge) => ge.message);
    }
  }

  get hasError() {
    return (
      !!this.errors &&
      ((!!this.errors.globalErrors && this.errors.globalErrors.length > 0) ||
        (!!this.errors.globalErrors && this.errors.globalErrors.length > 0))
    );
  }
}
</script>

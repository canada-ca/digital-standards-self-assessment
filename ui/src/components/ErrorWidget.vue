<template>
  <div v-if="hasError" class="error-wrapper">
    <div class="error-message" v-for="(error, index) in errorMessages" :key="index">{{ $t(error.message) }}</div>
  </div>
</template>

<script lang="ts">
import { Errors } from '@/interfaces/ErrorMessage';
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class ErrorWidget extends Vue {
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
    if (this.filedName) {
      const errors = this.errors.fieldErrors?.filter((fe) => fe.fieldName === this.filedName).map((fe) => fe.message);
      return errors && errors.length > 0;
    } else {
      const errors = this.errors.globalErrors?.map((ge) => ge.message);
      return errors && errors.length > 0;
    }
  }
}
</script>
<style scoped>
.error-message {
  color: red;
}
</style>

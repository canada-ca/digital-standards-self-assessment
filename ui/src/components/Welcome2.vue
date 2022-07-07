<template>
  <div class="mb-3">
    <div class="container">
      <h1>{{ $t('welcome2.A1') }}</h1>
      <h2>{{ $t('welcome2.B1') }}</h2>
      <p>{{ $t('welcome2.P1') }}</p>
      <h2>{{ $t('welcome2.B2') }}</h2>
      <p>{{ $t('welcome2.P2') }}</p>
      <h2>{{ $t('welcome2.B3') }}</h2>
      <p>{{ $t('welcome2.P3') }}</p>
      <p>{{ $t('welcome2.P4') }}</p>

      <h1>{{ $t('welcome2.A2') }}</h1>
      <p>{{ $t('welcome2.P5') }}</p>
      <p>{{ $t('welcome2.P6') }}</p>
      <h2>{{ $t('welcome2.P7') }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { marked } from 'marked';
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Welcome2 extends Vue {}
</script>

<style scoped>
h2 {
  font-size: 1.5em !important;
}
</style>

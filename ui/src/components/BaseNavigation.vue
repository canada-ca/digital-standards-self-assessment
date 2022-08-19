<template>
  <div>
    <div class="alert alert-info">
      <details>
        <summary>{{ $t('welcome.localSaveWarningSummary') }}</summary>
        <p class="small">{{ $t('welcome.localSaveWarningParagraph') }}</p>
        <p class="small">
          <strong>{{ $t('welcome.exception') }}</strong
          >:&nbsp;{{ $t('welcome.localSaveWarningParagraph2') }}
        </p>
      </details>
    </div>
  </div>
</template>
<script lang="ts">
import { Model } from 'survey-vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class BaseNavigation extends Vue {
  @Prop() public survey!: Model;
}
</script>

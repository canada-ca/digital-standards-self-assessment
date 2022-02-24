<template>
  <div>
    <div class="alert alert-info">
      <details>
        <summary>{{ $t("notice.localSaveWarningSummary") }}</summary>
        <p class="small">{{ $t("notice.localSaveWarningParagraph") }}</p>
        <p class="small">
          <strong>{{ $t("notice.exception") }}</strong
          >:&nbsp;{{ $t("notice.localSaveWarningParagraph2") }}
        </p>
      </details>
    </div>
  </div>
</template>
<script lang="ts">
import { Model } from "survey-vue";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class BaseNavigation extends Vue {
  @Prop() public survey!: Model;
}
</script>

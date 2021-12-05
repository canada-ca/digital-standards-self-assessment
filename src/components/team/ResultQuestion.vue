<template>
  <div class="form-group">
    <label>Q: {{ question.title }}</label>
    <p>A: {{ value }}</p>
  </div>
</template>

<script lang="ts">
import QuestionReportData from "@/interfaces/report/QuestionReportData";
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ResultQuestion extends Vue {
  @Prop() public question!: QuestionReportData;

  get value(): string {
    return this.question.answer ? "" + this.question.answer : "";
  }
}
</script>

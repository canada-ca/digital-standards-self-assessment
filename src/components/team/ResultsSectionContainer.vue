<template>
  <div class="row">
    <div class="col">
      <div class="row">
        <div class="col">
          <h2>{{ sectionReportData.title }}</h2>
        </div>
      </div>
      <div class="row">
        <div class="col" style="border-bottom: 2px solid black;">
          <div class="form-group">
            <label>
              Average Score of This Section: {{ sectionAverageScore }}%
            </label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <result-question
            v-for="question in questionDataArray"
            :key="question.name"
            :question="question"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ResultQuestion from "@/components/team/ResultQuestion.vue";
import QuestionReportData from "@/interfaces/report/QuestionReportData";
import SectionReportData from "@/interfaces/report/SectionReportData";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    ResultQuestion
  }
})
export default class ResultsSectionContainer extends Vue {
  @Prop({ required: true }) public sectionReportData!: SectionReportData;

  get questionDataArray(): QuestionReportData[] {
    return this.sectionReportData?.questions;
  }

  get sectionAverageScore() {
    if (this.sectionReportData === undefined) {
      return "0";
    }
    let scorePercentage: string = new Intl.NumberFormat("en-CA", {
        style: "decimal",
        maximumFractionDigits: 0
      }).format((this.sectionReportData.score / this.sectionReportData.maxScore) * 100);
      if (scorePercentage === "NaN") {
        return "0";
      }
      return scorePercentage;
  }
}
</script>

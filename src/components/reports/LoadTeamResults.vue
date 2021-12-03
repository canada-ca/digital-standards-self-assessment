<template>
  <div>
    <div class="row">
      <div class="col">
        <b-form-file
          :lang="locale"
          ref="fileUpload"
          :placeholder="$t('loadFile')"
          :browse-text="$t('loadLocalSurvey.browse')"
          multiple="multiple"
          @change="onFileChanged($event)"
        />
      </div>
    </div>
    <div class="row text-danger mt-3" v-if="hasError()">
      <div class="col">
        <ul>
          <li v-for="(errorSurvey, index) in errorMessages()" :key="index">
            {{
              $t(errorSurvey.errorMessage, { fileName: errorSurvey.fileName })
            }}
          </li>
        </ul>
      </div>
    </div>
    <div
      class="row"
      v-if="hasReportData() && !hasError()"
      style="margin-top: 20px"
    >
      <team-score-report :teamReportDataArray="teamReportDataArray" />
      <team-score-bar-chart
        :teamReportDataArray="teamReportDataArray"
        style="margin-top: 40px"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SurveyFile from "@/interfaces/SurveyFile";
import { Component, Vue, Watch } from "vue-property-decorator";
import TeamScoreReport from "./TeamScoreReport.vue";
import TeamScoreBarChart from "./TeamScoreBarChart.vue";
import TeamReportData from "@/interfaces/report/TeamReportData";
import SectionReportData from "@/interfaces/report/SectionReportData";
import { Model } from "survey-vue";

@Component({
  components: {
    TeamScoreReport,
    TeamScoreBarChart
  }
})
export default class LoadTeamResults extends Vue {
  surveyDataArray: Array<SurveyFile> = [];
  teamReportDataArray: Array<TeamReportData> = [];
  locale!: string;

  $refs!: {
    fileUpload: HTMLInputElement;
  };

  hasError() {
    return this.surveyDataArray.filter(d => d.hasError).length > 0;
  }

  hasReportData() {
    return !!this.surveyDataArray && this.surveyDataArray.length > 0;
  }

  errorMessages() {
    return this.surveyDataArray.filter(d => d.hasError);
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.locale = value;
  }

  onFileChanged($event: any) {
    if (
      $event === null ||
      $event.target === null ||
      $event.dataTransfer === null
    ) {
      return;
    }

    const target = $event.target as HTMLInputElement;
    const files = target.files || $event.dataTransfer.files;
    this.surveyDataArray = new Array();
    this.teamReportDataArray = new Array();
    files.forEach((file: any) => {
      this.loadSurveyFromFile(file);
    });
  }

  loadSurveyFromFile(file: any) {
    const reader = new FileReader();
    let surveyFile: SurveyFile;
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === "undefined") {
        surveyFile = {
          fileName: file.name,
          hasError: true,
          errorMessage: "loadLocalSurvey.validation.file.format",
          currentPage: 0
        };
      }
      try {
        surveyFile = JSON.parse(result);
        surveyFile.hasError = false;
        surveyFile.fileName = file.name;
        this.teamReportDataArray.push({
          name: surveyFile.fileName.substr(0, surveyFile.fileName.length - 5),
          sections: this.extractReportData(surveyFile)
        });
        this.teamReportDataArray.sort((a, b) =>
          a.name < b.name ? -1 : a.name == b.name ? 0 : 1
        );
      } catch (e) {
        this.$refs.fileUpload.value = "";
        surveyFile = {
          fileName: file.name,
          hasError: true,
          errorMessage: "loadLocalSurvey.validation.file.format",
          currentPage: 0
        };
      }
      this.surveyDataArray.push(surveyFile);
    };
    reader.readAsText(file);
  }

  private extractReportData(surveyFile: SurveyFile): Array<SectionReportData> {
    const sectionReportDataArray: Array<SectionReportData> = [];
    if (surveyFile.surveyJSON) {
      let survey: Model = new Model(surveyFile.surveyJSON);
      survey.data = surveyFile.data;
      survey.pages.forEach(page => {
        const sectionReportData: SectionReportData = {
          name: page.name,
          score: 0,
          maxScore: page.questions.length * 5,
          questions: [],
          title: page.title
        };
        page.questions.forEach(question => {
          sectionReportData.questions.push({
            name: question.name,
            type: question.getType(),
            title: question.title,
            answer: question.value
          });
          if (question.value !== undefined) {
            let score = 0;
            if (question.getType() === "rating") {
              score = +question.value;
            } else if (question.getType() === "boolean") {
              if (question.value) {
                score = 5;
              } else {
                score = 1;
              }
            }
            sectionReportData.score += score;
          }
        });
        sectionReportDataArray.push(sectionReportData);
      });
    }
    return sectionReportDataArray;
  }
}
</script>

<style></style>

<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <b-form-file
          ref="fileUpload"
          :title="$t('loadFile')"
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
    <div class="row" v-if="!hasError()">
      // placeholder to display team survey result.
    </div>
  </div>
</template>

<script lang="ts">
import SurveyFile from "@/interfaces/SurveyFile";
import { Model } from "survey-vue";
import Vue from "vue";
import Component from "vue-class-component";
import TeamReportData from "@/interfaces/report/TeamReportData";

@Component({})
export default class LoadTeamResults extends Vue {
  surveyDataArray: Array<SurveyFile> = [];

  $refs!: {
    fileUpload: HTMLInputElement;
  };

  hasError() {
    return this.surveyDataArray.filter(d => d.hasError).length > 0;
  }

  errorMessages() {
    return this.surveyDataArray.filter(d => d.hasError);
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
    files.forEach((file: any) => {
      this.loadSurveyFromFile(file);
    });
    this.$forceUpdate();
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
        surveyFile.fileName = file.name;
        this.extractReportData(surveyFile);
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

  extractReportData(surveyFile: SurveyFile) {
    if (surveyFile.surveyJSON) {
      let survey: Model = new Model(surveyFile.surveyJSON);
      survey.data = surveyFile.data;
      survey.pages.forEach(page => {
        page.questions.forEach(q => {
          console.log(
            "File:",
            surveyFile.fileName,
            "Section:",
            page.name,
            "Question:",
            q.name,
            "Type:",
            q.getType(),
            "Answer:",
            q.value
          );
        });
      });
    }
  }
}
</script>

<style></style>

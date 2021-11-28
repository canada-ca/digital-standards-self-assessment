<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <input
          type="file"
          ref="fileUpload"
          class="btn btn-default mr-auto"
          :title="$t('loadFile')"
          value="Load"
          multiple="multiple"
          style="padding: 0"
          @change="onFileChanged($event)"
        />
      </div>
    </div>
    <div class="row text-danger mt-3" v-if="hasError()">
      <div class="col">
        <ul>
          <li v-for="(errorMessage, index) in errorMessages()" :key="index">
            {{ $t(errorMessage) }}
          </li>
        </ul>
      </div>
    </div>
    <div class="row" v-if="!hasError()">
      <ul>
        <li v-for="survey in surveyDataArray" :key="survey.fileName">
          {{ survey.fileName }} - {{ survey.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import SurveyFile from "@/interfaces/SurveyFile";
import Vue from "vue";
import Component from "vue-class-component";

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
    return this.surveyDataArray
      .filter(d => d.hasError)
      .map(d => d.errorMessage);
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
    let surveyData: any;
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === "undefined") {
        surveyData = {
          fileName: file.name,
          hasError: true,
          errorMessage: "loadLocalSurvey.validation.format"
        };
      }
      try {
        surveyData = JSON.parse(result);
        surveyData.fileName = file.name;
      } catch (e) {
        this.$refs.fileUpload.value = "";
        surveyData = {
          fileName: file.name,
          hasError: true,
          errorMessage: "loadLocalSurvey.validation.format"
        };
      }
      this.surveyDataArray.push(surveyData);
    };
    reader.readAsText(file);
  }
}
</script>

<style></style>

<template>
  <div>
    <b-modal id="load-loacal-survey-modal" size="xl">
      <template #modal-header>
        <div v-html="$t('loadLocalSurvey.title')"></div>
      </template>
      <template #default>
        <div class="form-group" :class="{ 'was-validated': hasError }">
          <textarea
            class="form-control"
            :class="{ 'text-danger': hasError }"
            id="surveyDataInput"
            rows="5"
            required
            :placeholder="$t('loadLocalSurvey.surveyData')"
            v-model="surveyData"
          ></textarea>
          <div class="invalid-feedback">
            {{ $t("loadLocalSurvey.validation.required") }}
          </div>
        </div>
      </template>
      <template #modal-footer>
        <input
          type="file"
          class="btn btn-default mr-auto"
          :title="$t('loadFile')"
          value="Load"
          style="padding: 0"
          @change="onFileChanged($event)"
        />
        <b-button
          class="btn btn-primary"
          style="width: 120px"
          @click="loadLocalSurveyData"
        >
          {{ $t("loadLocalSurvey.OK") }}
        </b-button>
        <b-button
          class="btn btn-default"
          style="width: 120px"
          @click="format()"
        >
          {{ $t("loadLocalSurvey.format") }}
        </b-button>
        <b-button
          class="btn btn-default"
          style="width: 120px"
          @click="cancel()"
        >
          {{ $t("loadLocalSurvey.cancel") }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { ActionTypes } from "@/store/actions";
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class LoadLocalSurvey extends Vue {
  surveyData: string = "";
  hasError: boolean = false;

  loadLocalSurveyData() {
    if (!this.surveyData) {
      this.hasError = true;
    }
    this.$emit("surveyDataLoaded", JSON.parse(this.surveyData));
    this.$bvModal.hide("load-loacal-survey-modal");
  }

  cancel() {
    this.$bvModal.hide("load-loacal-survey-modal");
  }

  format() {
    this.surveyData = JSON.stringify(JSON.parse(this.surveyData), null, 4);
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

    if (files.length === 0) {
      return;
    }
    this.loadSurveyFromFile(files[0]);
  }

  loadSurveyFromFile(file: any) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === "undefined") {
        return;
      }
      this.surveyData = result;
    };
    reader.readAsText(file);
  }
}
</script>

<template>
  <div>
    <b-button
      type="button"
      class="btn btn-primary"
      style="min-width: 500px !important"
      v-on:click="showUploadSurveyDialog()"
    >
      {{ $t("downloadUploadSurvey.uploadSurvey") }}
    </b-button>
    <b-modal id="load-loacal-survey-modal" size="xl">
      <template #modal-header>
        <div v-html="$t('downloadUploadSurvey.title')"></div>
      </template>
      <template #default>
        <div class="form-group" :class="{ 'was-validated': hasError }">
          <textarea
            readonly
            class="form-control"
            :class="{ 'is-invalid': hasError }"
            id="surveyDataInput"
            rows="5"
            required
            :placeholder="$t('downloadUploadSurvey.surveyData')"
            :value="surveyDataForDisplay"
          ></textarea>
          <div class="text-danger mt-3" v-if="hasError">
            {{ $t(errorMessage, { fileName: surveyData.fileName }) }}
          </div>
        </div>
      </template>
      <template #modal-footer>
        <div>
          <input
            id="fileInput"
            type="file"
            ref="fileUpload"
            class="btn btn-default mr-auto"
            value="Load"
            style="opacity: 0; height: 0px; width: 0px"
            tabindex="-1"
            @change="onFileChanged($event)"
          />
          <b-button
            @click="selectFile($event)"
            class="btn btn-primary upload-button"
            >{{ $t("downloadUploadSurvey.browse") }}</b-button
          >
        </div>
        <b-form-checkbox
          class="m-auto"
          v-model="format"
          switch
          size="lg"
          @change="onToggleFormat"
        >
          {{ $t("downloadUploadSurvey.format") }}
        </b-form-checkbox>
        <b-button
          class="btn btn-primary"
          style="width: 120px"
          @click="uploadSurveyData"
        >
          {{ $t("downloadUploadSurvey.OK") }}
        </b-button>
        <b-button
          class="btn btn-default"
          style="width: 120px"
          @click="cancel()"
        >
          {{ $t("downloadUploadSurvey.cancel") }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component
export default class UploadSurvey extends Vue {
  surveyData: any = {};
  surveyDataForDisplay: string = "";
  hasError: boolean = false;
  format: boolean = false;
  errorMessage = "";

  $refs!: {
    fileUpload: HTMLInputElement;
  };

  showUploadSurveyDialog() {
    this.$bvModal.show("load-loacal-survey-modal");
  }

  uploadSurveyData(): void {
    if (!(!!this.surveyData && !!this.surveyData.name)) {
      this.hasError = true;
      this.errorMessage = "validation.file.required";
      return;
    }
    this.$emit("surveyDataLoaded", this.surveyData);
    this.$bvModal.hide("load-loacal-survey-modal");
  }

  cancel() {
    this.$bvModal.hide("load-loacal-survey-modal");
  }

  selectFile(event: MouseEvent) {
    document.getElementById("fileInput")?.click();
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

  onToggleFormat() {
    if (this.surveyData && this.surveyData.name) {
      this.surveyDataForDisplay = this.format
        ? JSON.stringify(this.surveyData, null, 4)
        : JSON.stringify(this.surveyData);
    }
  }

  loadSurveyFromFile(file: any) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === "undefined") {
        this.hasError = true;
        this.errorMessage = "validation.file.format";
        this.$refs.fileUpload.value = "";
        this.surveyData = {
          fileName: file.name,
          hasError: true,
          errorMessage: "validation.file.format"
        };
        this.surveyDataForDisplay = "";
        return;
      }
      try {
        this.surveyData = JSON.parse(result);
        this.surveyData.fileName = file.name;
        this.surveyDataForDisplay = this.format
          ? JSON.stringify(this.surveyData, null, 4)
          : JSON.stringify(this.surveyData);
        this.errorMessage = "";
        this.hasError = false;
      } catch (e) {
        this.$refs.fileUpload.value = "";
        this.surveyData = {
          fileName: file.name,
          hasError: true,
          errorMessage: "validation.file.format"
        };
        this.surveyDataForDisplay = "";
        this.hasError = true;
        this.errorMessage = "validation.file.format";
      }
    };
    reader.readAsText(file);
  }
}
</script>

<style scoped>
.upload-button {
  min-width: 270px !important;
}
</style>

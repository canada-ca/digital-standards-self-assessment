<template>
  <div>
    <b-link @click="showUploadDialog($event)">{{
      $t("teamResults.uploadSurveys")
    }}</b-link>
    <b-modal id="upload-team-survey-modal" size="lg">
      <template #modal-header>
        <div>{{ $t("teamResults.uploadSurveys") }}</div>
      </template>
      <template #default>
        <div style="padding: 30px">
          <p style="margin-bottom: 30px !important">
            {{ $t("teamResults.uploadDesc") }}
          </p>
          <div class="row">
            <div class="col-md-6 text-center">
              <b-form-file
                id="fileA"
                @change="onFileChanged($event)"
                multiple="multiple"
                style="opacity:0; height:0px;width:0px;"
              />
              <b-button
                id="buttonA"
                @click="selectFile($event)"
                class="btn btn-primary upload-button"
                >{{ $t("teamResults.uploadSurveysA") }}</b-button
              >
              <div style="margin-top: 20px">
                <div v-for="(file, index) in filesA" :key="index">
                  <file-item :file="file" @delete="deleteFilesA(index)" />
                </div>
              </div>
            </div>
            <div class="col-md-6 text-center">
              <b-form-file
                id="fileB"
                @change="onFileChanged($event)"
                multiple="multiple"
                style="opacity:0; height:0px;width:0px;"
              />
              <b-button
                id="buttonB"
                @click="selectFile($event)"
                class="btn btn-primary upload-button"
                >{{ $t("teamResults.uploadSurveysB") }}</b-button
              >
              <div style="margin-top: 20px">
                <div v-for="(file, index) in filesB" :key="index">
                  <file-item :file="file" @delete="deleteFilesB(index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #modal-footer>
        <b-button
          class="btn btn-primary"
          @click="calculateResults()"
          :disabled="!readyToCalc()"
        >
          {{ $t("teamResults.calcResults") }}
        </b-button>
        <b-button
          class="btn btn-default"
          style="width: 120px; margin-right: 10px !important"
          @click="onCancelClicked()"
        >
          {{ $t("downloadUploadSurvey.cancel") }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import FileItem from "@/components/team/FileItem.vue";
import ErrorMessage from "@/interfaces/ErrorMessage";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {FileItem}
})
export default class UploadTeamSurveys extends Vue {
  filesA: any[] = [];
  filesB: any[] = [];
  errorMessages: Array<ErrorMessage> = [];
  locale = "en";

  $refs!: {
    fileUpload: HTMLInputElement;
  };

  showUploadDialog(event: MouseEvent) {
    event.preventDefault();
    this.errorMessages = [];
    this.$bvModal.show("upload-team-survey-modal");
  }

  selectFile(event: MouseEvent) {
    const targetButton: HTMLButtonElement = event.target as HTMLButtonElement;
    const fileElementID = "file" + targetButton.id.substring(6);
    console.log(fileElementID);
    document.getElementById(fileElementID)?.click()
  }

  deleteFilesA(index: number) {
    this.filesA.splice(index, 1);
  }

  deleteFilesB(index: number) {
    this.filesB.splice(index, 1);
  }

  readyToCalc(): boolean {
    return (this.filesA && this.filesA.length > 0) || (this.filesB && this.filesB.length > 0)
  }

  calculateResults() {
    
  }

  onCancelClicked() {
    this.$bvModal.hide("upload-team-survey-modal");
  }

  hasError() {
    return this.errorMessages.length > 0;
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
    if (files.length === 0) {
      return;
    }
    if (target.id === "fileA") {
      this.filesA = [...files];
    } else {
      this.filesB = [...files];
    }
  }
}
</script>

<style>
.upload-button {
  min-width: 270px !important;
}
</style>

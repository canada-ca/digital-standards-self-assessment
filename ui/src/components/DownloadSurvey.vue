<template>
  <div>
    <b-button
      type="button"
      class="btn btn-primary ml-auto"
      style="min-width: 500px !important"
      @click="showFileNameModal()"
    >
      {{ $t("downloadUploadSurvey.downloadSurvey") }}
    </b-button>
    <b-modal id="file-name-modal" size="l" @shown="focusFileNameInput">
      <template #modal-header>
        <div>{{ $t("downloadUploadSurvey.downloadTitle") }}</div>
      </template>
      <template #default>
        <b-form @submit="onSubmit" ref="form" style="margin: 10px">
          <div class="file-label">
            <label>{{ $t("downloadUploadSurvey.fileName") }}</label>
            <div class="text-right text-danger">* Required</div>
          </div>
          <b-form-input
            id="fileNameInput"
            ref="fileNameInput"
            class="form-control"
            :class="{ 'is-invalid': hasError }"
            v-model="fileName"
            :placeholder="$t('downloadUploadSurvey.inputFileName')"
          />
          <div class="text-danger mt-3" v-if="hasError">
            {{ $t(errorMessage) }}
          </div>
          <input ref="submitButton" type="submit" style="display: none" />
        </b-form>
      </template>
      <template #modal-footer>
        <b-button
          class="btn btn-primary"
          style="width: 120px"
          @click="onOkClicked()"
        >
          {{ $t("downloadUploadSurvey.OK") }}
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
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class DownloadSurvey extends Vue {
  fileName: string = "";
  hasError: boolean = false;
  errorMessage = "";

  $refs!: {
    fileNameInput: HTMLInputElement;
    form: HTMLFormElement;
    submitButton: HTMLButtonElement;
  };

  showFileNameModal() {
    this.fileName = "";
    this.hasError = false;
    this.errorMessage = "";
    this.$bvModal.show("file-name-modal");
  }

  focusFileNameInput() {
    this.$refs.fileNameInput.focus();
  }

  onOkClicked() {
    this.$refs.submitButton.click();
  }

  onSubmit(event: any) {
    event.preventDefault();
    if (this.fileName.length == 0) {
      this.hasError = true;
      this.errorMessage = "validation.fileName.required";
      return;
    }
    this.$emit("confirmToDownload", this.fileName);
    this.$bvModal.hide("file-name-modal");
  }

  onCancelClicked() {
    this.$bvModal.hide("file-name-modal");
  }
}
</script>

<style scoped>
.file-label {
  display: flex;
  justify-content: space-between;
}
.file-label div {
  min-width: 100px;
}
</style>

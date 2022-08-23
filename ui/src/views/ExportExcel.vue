<template>
  <div class="container" style="min-height: 500px">
    <message ref="message" />
    <h1>{{ $t('exportExcel.title') }}</h1>
    <div class="field-section">
      <label>{{ $t('downloadUploadSurvey.fileName') }}</label>
      <b-form-input
        id="fileNameInput"
        ref="fileNameInput"
        class="form-control file-name"
        :class="{ 'is-invalid': hasError('fileName') }"
        v-model="fileName"
        :placeholder="$t('downloadUploadSurvey.inputFileName')"
      />
      <error-widget :filedName="'fileName'" :errors="errors" />

      <label class="archive-name-label">{{ $t('downloadUploadSurvey.archiveName') }}</label>
      <b-form-select v-model="archiveName" :options="archiveNames" class="form-control"></b-form-select>
    </div>
    <b-button class="btn btn-primary" style="width: 120px" @click="onOkClicked()">
      {{ $t('downloadUploadSurvey.OK') }}
    </b-button>
  </div>
</template>
<script lang="ts">
import ErrorWidget from '@/components/ErrorWidget.vue';
import Message, { MessageVariantType } from '@/components/Message.vue';
import { SectionGroup, SurveyResult } from '@/interfaces/api-models';
import { Errors } from '@/interfaces/ErrorMessage';
import apiService from '@/services/api.service';
import exportService from '@/services/export.service';
import Vue from 'vue';
import Component from 'vue-class-component';
import * as XLSX from 'xlsx';

@Component({
  components: { ErrorWidget, Message },
})
export default class ExportExcel extends Vue {
  fileName: string = '';
  archiveName: string = 'current';
  archiveNames: string[] = [];
  errors: Errors = { fieldErrors: [] };

  $refs!: {
    message: Message;
  };

  hasError(fieldName: string): boolean {
    const fieldErrors =
      !!this.errors && !!this.errors.fieldErrors && this.errors.fieldErrors?.filter((fe) => fe.fieldName === fieldName);
    return !!fieldErrors && fieldErrors.length > 0;
  }

  async created() {
    this.fileName = '';
    this.archiveName = 'current';
    this.archiveNames = await apiService.findSurveyResultArchiveNames();
  }

  validate(): boolean {
    let hasError = false;
    this.errors = {
      globalErrors: [],
      fieldErrors: [],
    };
    if (this.fileName.length == 0) {
      hasError = true;
      this.errors.fieldErrors?.push({ fieldName: 'fileName', message: { message: 'validation.fileName.required' } });
    }
    return !hasError;
  }

  showMessage(messageKey: string, variant: MessageVariantType = 'primary') {
    this.$refs.message.showMessage(messageKey, variant);
    const top = document.getElementById('def-top')?.offsetTop;
    window.scrollTo(0, top || 0);
  }

  async onOkClicked(event: any) {
    if (!this.validate()) {
      return;
    }
    try {
      const surveyJSON: any = this.$store.state.surveyJSON;
      const surveyResults: SurveyResult[] = await apiService.findArchivedSurveyResults(this.archiveName);
      const sectionGroups: SectionGroup[] = this.$store.state.sectionGroups;
      const data = exportService.convertToDataArray(this.$i18n, sectionGroups, surveyJSON, surveyResults);
      this.exportToExcel(this.fileName, data);
    } catch (error) {
      console.log(error);
      this.showMessage('teamResults.submitFailed', 'danger');
    }
  }

  exportToExcel(fileName: string, data: Array<{ [key: string]: any }>) {
    var ws = XLSX.utils.json_to_sheet(data);
    var wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Answers');

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    XLSX.writeFile(wb, fileName + '.xlsx'); // name of the file is 'book.xlsx'
  }
}
</script>

<style scoped>
button {
  margin-top: 20px;
}

.file-name {
  z-index: 0;
}

.b-form-btn-label-control.dropdown.b-form-datepicker.form-control.show {
  display: flex !important;
}

.archive-name-label {
  margin-top: 20px;
}

div.form-group /deep/ .b-calendar .b-calendar-grid-body .col[data-date] .btn {
  width: 32px !important;
  height: 32px !important;
  font-size: 14px !important;
  line-height: 1 !important;
  margin: 3px auto !important;
  padding: 9px 0 !important;
  min-height: 32px;
  min-width: 32px;
}
</style>

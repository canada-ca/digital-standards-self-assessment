<template>
  <div class="container" style="min-height: 500px">
    <message ref="message" />
    <h1>{{ $t('exportExcel.title') }}</h1>
    <div class="field-section">
      <label>{{ $t('downloadUploadSurvey.archiveName') }}</label>
      <b-form-input
        id="archiveNameInput"
        ref="archiveNameInput"
        class="form-control archive-name"
        :class="{ 'is-invalid': hasError('archiveName') }"
        v-model="archiveName"
        :placeholder="$t('downloadUploadSurvey.inputArchiveName')"
      />
      <error-widget :fieldName="'archiveName'" :errors="errors" />
    </div>
    <b-button class="btn btn-primary" style="width: 120px" @click="onOkClicked()">
      {{ $t('downloadUploadSurvey.OK') }}
    </b-button>
  </div>
</template>
<script lang="ts">
import ErrorWidget from '@/components/ErrorWidget.vue';
import Message, { MessageVariantType } from '@/components/Message.vue';
import { Errors } from '@/interfaces/ErrorMessage';
import apiService from '@/services/api.service';
import { AxiosError } from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: { ErrorWidget, Message },
})
export default class ArchiveSurveyResults extends Vue {
  archiveName: string = '';
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
    this.archiveName = '';
  }

  validate(): boolean {
    let hasError = false;
    this.errors = {
      globalErrors: [],
      fieldErrors: [],
    };
    if (this.archiveName.length == 0) {
      hasError = true;
      this.errors.fieldErrors?.push({
        fieldName: 'archiveName',
        message: { message: 'validation.archiveName.required' },
      });
    } else if (this.archiveName === 'current') {
      hasError = true;
      this.errors.fieldErrors?.push({
        fieldName: 'archiveName',
        message: { message: 'validation.archiveName.canNotBeCurrent' },
      });
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
      const data = await apiService.archiveSurveyResults(this.archiveName);
      this.showMessage('downloadUploadSurvey.archiveSucess', 'success');
    } catch (error) {
      if (
        error instanceof AxiosError &&
        (error as AxiosError<{ message: string }>).response?.data.message ===
          'This archive name was alredy used, please change another one.'
      ) {
        this.showMessage('downloadUploadSurvey.archiveNameExists', 'danger');
      } else if (
        error instanceof AxiosError &&
        (error as AxiosError).message === 'Request failed with status code 404'
      ) {
        this.showMessage('downloadUploadSurvey.noDataToArchive', 'danger');
      } else {
        this.showMessage('downloadUploadSurvey.archiveFailed', 'danger');
      }
    }
  }
}
</script>

<style scoped>
button {
  margin-top: 20px;
}

.archive-name {
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

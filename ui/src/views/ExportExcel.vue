<template>
  <div class="container" style="min-height: 500px">
    <h1>{{ $t('exportExcel.title') }}</h1>
    <div class="field-section">
      <label for="startDate">{{ $t('teamResults.startDate') }}</label>
      <b-form-datepicker
        id="startDate"
        v-model="startDate"
        :locale="locale"
        v-bind="labels[locale] || {}"
        :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit' }"
      />
      <label for="endDate">{{ $t('teamResults.endDate') }}</label>
      <b-form-datepicker
        id="endDate"
        v-model="endDate"
        :locale="locale"
        v-bind="labels[locale] || {}"
        :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit' }"
      />

      <label>{{ $t('downloadUploadSurvey.fileName') }}</label>
      <b-form-input
        id="fileNameInput"
        ref="fileNameInput"
        class="form-control file-name"
        :class="{ 'is-invalid': hasError }"
        v-model="fileName"
        :placeholder="$t('downloadUploadSurvey.inputFileName')"
      />
      <div class="text-danger mt-3" v-if="hasError">
        {{ $t(errorMessage) }}
      </div>
    </div>
    <b-button class="btn btn-primary" style="width: 120px" @click="onOkClicked()">
      {{ $t('downloadUploadSurvey.OK') }}
    </b-button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import moment from 'moment';
import { Errors } from '@/interfaces/ErrorMessage';

@Component({})
export default class ExportExcel extends Vue {
  fileName: string = '';
  errors: Errors = { fieldErrors: [] };

  startDate?: Date = moment().startOf('months').toDate();
  endDate?: Date = moment().endOf('months').toDate();
  labels = {
    fr: {
      weekdayHeaderFormat: 'narrow',
      labelPrevDecade: 'Prev Decade(FR)',
      labelPrevYear: 'Prev Year(FR)',
      labelPrevMonth: 'Prev Month(FR)',
      labelCurrentMonth: 'Current Month(FR)',
      labelNextMonth: 'Next Month(FR)',
      labelNextYear: 'Next Year(FR)',
      labelNextDecade: 'Next Decade(FR)',
      labelToday: 'Today(FR)',
      labelSelected: 'Selected Date(FR)',
      labelNoDateSelected: 'Unselected Date(FR)',
      labelCalendar: 'Calendar(FR)',
      labelNav: 'Navigation(FR)',
      labelHelp: 'Use cursor keys to navigate calendar dates(FR)',
    },
  };

  get locale() {
    return this.$i18n.locale;
  }

  get hasError(): boolean {
    return (
      !!this.errors &&
      ((!!this.errors.globalErrors && this.errors.globalErrors.length > 0) ||
        (!!this.errors.globalErrors && this.errors.globalErrors.length > 0))
    );
  }

  created() {
    this.fileName = '';
  }

  validate(): boolean {
    this.errors = {
      fieldErrors: [],
    };
    if (this.fileName.length == 0) {
      this.errors.fieldErrors?.push({ fieldName: 'fileName', message: { message: 'validation.fileName.required' } });
    }
    if (!this.startDate) {
      this.errors.fieldErrors?.push({ fieldName: 'startDate', message: { message: 'validation.startDate.required' } });
    }
    if (!this.endDate) {
      this.errors.fieldErrors?.push({ fieldName: 'endDate', message: { message: 'validation.endDate.required' } });
    }
    return this.hasError;
  }

  onOkClicked(event: any) {}
}
</script>

<style scoped>
.field-section > label {
  margin-top: 20px;
}

button {
  margin-top: 20px;
}

.file-name {
  z-index: 0;
}

.b-form-btn-label-control.dropdown.b-form-datepicker.form-control.show {
  display: flex !important;
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

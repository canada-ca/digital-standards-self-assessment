<template>
  <div class="container" style="min-height: 500px">
    <message ref="message" />
    <h1>{{ $t('exportExcel.title') }}</h1>
    <div class="field-section">
      <label for="startDate">{{ $t('teamResults.startDate') }}</label>
      <b-form-datepicker
        id="startDate"
        v-model="startDate"
        :locale="locale"
        v-bind="labels[locale] || {}"
        :class="{ 'is-invalid': hasError('startDate') }"
        :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit' }"
      />
      <error-widget :filedName="'startDate'" :errors="errors" />

      <label for="endDate">{{ $t('teamResults.endDate') }}</label>
      <b-form-datepicker
        id="endDate"
        v-model="endDate"
        :locale="locale"
        v-bind="labels[locale] || {}"
        :class="{ 'is-invalid': hasError('endDate') }"
        :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit' }"
      />
      <error-widget :filedName="'endDate'" :errors="errors" />

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
import moment from 'moment';
import Vue from 'vue';
import Component from 'vue-class-component';
import * as XLSX from 'xlsx';
import exportService from '@/services/export.service';

@Component({
  components: { ErrorWidget, Message },
})
export default class ExportExcel extends Vue {
  fileName: string = '';
  errors: Errors = { fieldErrors: [] };

  startDate?: Date = moment().startOf('months').toDate();
  endDate?: Date = moment().endOf('months').toDate();
  labels = {
    fr: {
      weekdayHeaderFormat: 'narrow',
      labelPrevDecade: 'Décennie précédente',
      labelPrevYear: 'Année précédente',
      labelPrevMonth: 'Le mois précédent',
      labelCurrentMonth: 'Mois en cours',
      labelNextMonth: 'Le mois prochain',
      labelNextYear: "L'année prochaine",
      labelNextDecade: 'La prochaine décennie',
      labelToday: "Aujourd'hui",
      labelSelected: 'Date sélectionnée',
      labelNoDateSelected: 'Date non sélectionnée',
      labelCalendar: 'Calendrier',
      labelNav: 'La navigation',
      labelHelp: 'Utilisez les touches du curseur pour parcourir les dates du calendrier',
    },
  };

  $refs!: {
    message: Message;
  };

  get locale() {
    return this.$i18n.locale;
  }

  hasError(fieldName: string): boolean {
    const fieldErrors =
      !!this.errors && !!this.errors.fieldErrors && this.errors.fieldErrors?.filter((fe) => fe.fieldName === fieldName);
    return !!fieldErrors && fieldErrors.length > 0;
  }

  created() {
    this.fileName = '';
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
    if (!this.startDate) {
      hasError = true;
      this.errors.fieldErrors?.push({ fieldName: 'startDate', message: { message: 'validation.startDate.required' } });
    } else {
      if (!moment(this.startDate).isValid()) {
        hasError = true;
        this.errors.fieldErrors?.push({ fieldName: 'startDate', message: { message: 'validation.startDate.invalid' } });
      }
    }
    if (!this.endDate) {
      hasError = true;
      this.errors.fieldErrors?.push({ fieldName: 'endDate', message: { message: 'validation.endDate.required' } });
    } else {
      if (!moment(this.endDate).isValid()) {
        hasError = true;
        this.errors.fieldErrors?.push({ fieldName: 'startDate', message: { message: 'validation.endDate.invalid' } });
      }
    }
    if (!!this.startDate && moment(this.startDate).isValid() && !!this.endDate && moment(this.endDate).isValid()) {
      if (moment(this.startDate).isAfter(moment(this.endDate))) {
        hasError = true;
        this.errors.fieldErrors?.push({
          fieldName: 'endDate',
          message: { message: 'validation.endDate.beforeStartDate' },
        });
      }
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
    const strStartDate = moment(this.startDate).format('YYYY-MM-DD');
    const strEndDate = moment(this.endDate).format('YYYY-MM-DD');
    try {
      const surveyJSON: any = this.$store.state.surveyJSON;
      const surveyResults: SurveyResult[] = await apiService.findSurveyResults(strStartDate, strEndDate);
      const sectionGroups: SectionGroup[] = this.$store.state.sectionGroups;
      const data = exportService.convertToDataArray(this.locale, sectionGroups, surveyJSON, surveyResults);
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

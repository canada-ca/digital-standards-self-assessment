<template>
  <div class="container">
    <h1>
      {{ $t('teamResults.title') }}
    </h1>
    <div class="row">
      <div class="col date-range">
        <div class="form-group">
          <label for="startDate">{{ $t('teamResults.startDate') }}</label>
          <b-form-datepicker id="startDate" v-model="startDate" :locale="locale" v-bind="labels[locale] || {}" />
        </div>
        <div class="form-group">
          <label for="endDate">{{ $t('teamResults.endDate') }}</label>
          <b-form-datepicker id="endDate" v-model="endDate" :locale="locale" v-bind="labels[locale] || {}" />
        </div>
        <div class="form-group">
          <b-button class="btn btn-primary minwidth-100">{{ $t('buttons.OK') }}</b-button>
        </div>
      </div>
    </div>
    <p v-if="!hasReportData">{{ $t('teamResults.description') }}</p>
    <div class="row">
      <div class="col">
        <b-img
          class="overview-image"
          fluid-grow
          :src="require('@/assets/images/teamSurveyOverview.png')"
          alt="overview"
          v-if="!hasReportData"
        />
        <team-score-bar-chart :teamReportDataArray="teamReportDataArray" />
        <team-score-data-table :teamReportDataArray="teamReportDataArray" v-if="hasReportData" />
        <individual-breakdown :teamReportDataArray="individualReportDataArray" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UploadTeamSurveys from '@/components/team/UploadTeamSurveys.vue';
import { TeamReportData, TeamReportDataBundle } from '@/store/state';
import TeamScoreBarChart from '@/components/team/TeamScoreBarChart.vue';
import TeamScoreDataTable from '@/components/team/TeamScoreDataTable.vue';
import IndividualBreakdown from '@/components/team/IndividualBreakdown.vue';
import { ActionTypes } from '@/store/actions';

import moment, { months } from 'moment';

@Component({
  components: {
    UploadTeamSurveys,
    TeamScoreBarChart,
    TeamScoreDataTable,
    IndividualBreakdown,
  },
})
export default class Results extends Vue {
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

  get teamReportDataArray(): TeamReportData[] {
    return this.$store.getters.returnTeamReportDataArray;
  }
  get individualReportDataArray(): TeamReportDataBundle[] {
    return this.$store.getters.returnIndividualTeamReportDataArray;
  }

  get hasReportData(): boolean {
    return this.teamReportDataArray.length > 0;
  }

  get showBreakdown() {
    return this.$store.getters.returnShowBreakdown;
  }

  addTeamReportData(teamReportData: TeamReportData) {
    this.$store.commit(ActionTypes.AddTeamSurvey, teamReportData);
  }
}
</script>

<style scoped>
.overview-image {
  padding: 40px 320px;
  position: absolute;
  top: 0px;
}

.date-range {
  display: grid;
  grid-template-columns: 40% 40% 20%;
  grid-column-gap: 20px;
  align-items: end;
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

.minwidth-100 {
  min-width: 100px !important;
}
</style>

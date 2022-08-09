<template>
  <div>
    <div class="row">
      <div class="col date-range">
        <div class="form-group">
          <label for="startDate">{{ $t('teamResults.startDate') }}</label>
          <b-form-datepicker
            id="startDate"
            v-model="startDate"
            :locale="locale"
            v-bind="labels[locale] || {}"
            :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit' }"
          />
        </div>
        <div class="form-group">
          <label for="endDate">{{ $t('teamResults.endDate') }}</label>
          <b-form-datepicker
            id="endDate"
            v-model="endDate"
            :locale="locale"
            v-bind="labels[locale] || {}"
            :date-format-options="{ year: 'numeric', month: 'short', day: '2-digit' }"
          />
        </div>
        <div class="form-group">
          <b-button class="btn btn-primary minwidth-100" @click="retrieveTeamResults()">{{
            $t('buttons.OK')
          }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SurveyResult, Team } from '@/interfaces/api-models';
import { ErrorMessage } from '@/interfaces/ErrorMessage';
import apiService from '@/services/api.service';
import { SectionReportData, TeamReportData, TeamReportDataBundle, UserReportData } from '@/store/state';
import { calcScore, calcSectionMaxScore } from '@/utils/utils';
import moment from 'moment';
import { Model } from 'survey-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class RetrieveTeamSurveys extends Vue {
  errorMessages: Array<ErrorMessage> = [];
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

  get locale() {
    return this.$i18n.locale;
  }

  get surveyJson() {
    return this.$store.getters.returnSurveyJSON;
  }
  // The key is teamId
  teamReportDataBundles: Map<string, TeamReportDataBundle> = new Map();

  async retrieveTeamResults() {
    this.cleanData();
    try {
      if (!this.startDate || !this.endDate) {
        this.errorMessages.push({
          message: 'validation.teamResult.date',
        });
        return;
      }
      const strStartDate = moment(this.startDate).format('YYYY-MM-DD');
      const strEndDate = moment(this.endDate).format('YYYY-MM-DD');
      const surveyResults = await apiService.findSurveyResults(strStartDate, strEndDate);
      this.calculateResults(surveyResults);
      this.$emit('loadTeamReportData', [...this.teamReportDataBundles.values()]);
    } catch (err) {
      this.$emit('loadTeamReportData', []);
    }
  }

  private cleanData() {
    this.errorMessages = [];
    this.teamReportDataBundles = new Map();
  }

  calculateResults(surveyResults: SurveyResult[]) {
    for (const result of surveyResults) {
      this.loadSurveyResults(result);
    }
    this.averageTeamScore();
  }

  loadSurveyResults(result: SurveyResult) {
    const team: Team = result.team as Team;
    const teamId = team._id || '';
    const userId = result.userId;
    const answers = result.answers;

    const userReportData: UserReportData = {
      userId,
      sections: this.extractSectionReportData(answers, result.createdAt),
    };

    let bundle = this.teamReportDataBundles.get(teamId);
    if (!bundle) {
      bundle = {
        teamId,
        team,
        teamAverageReportData: {} as TeamReportData,
        userReportDataArray: [userReportData],
      };
      this.teamReportDataBundles.set(teamId, bundle);
    } else {
      bundle.userReportDataArray.push(userReportData);
    }
  }

  private extractSectionReportData(answers: { [key: string]: any }, createdAt?: Date): Array<SectionReportData> {
    const sectionReportDataArray: Array<SectionReportData> = [];
    if (this.surveyJson) {
      let survey: Model = new Model(this.surveyJson);
      survey.data = answers;
      survey.pages.forEach((page: any) => {
        const sectionReportData: SectionReportData = {
          name: page.name,
          score: 0,
          maxScore: calcSectionMaxScore(page.name, this.surveyJson),
          questions: [],
          title: page.title,
          createdAt,
        };
        page.questions.forEach((question: any) => {
          sectionReportData.questions.push({
            name: question.name,
            type: question.getType(),
            title: question.title,
            answer: question.value,
          });
          if (question.value !== undefined) {
            const score = calcScore(question.value);
            sectionReportData.score += score;
          }
        });
        sectionReportDataArray.push(sectionReportData);
      });
    }
    return sectionReportDataArray;
  }

  private averageTeamScore() {
    for (const teamId of this.teamReportDataBundles.keys()) {
      const teamAverageReportData: TeamReportData = {
        teamId,
        team: this.teamReportDataBundles.get(teamId)?.team || ({} as Team),
        sections: [],
      };
      // Extract score into a map
      // section_name: [{score, maxScore}, {score, maxScore}, {score, maxScore} ...]
      const scoresMap: Map<String, any[]> = new Map();
      const bundle = this.teamReportDataBundles.get(teamId);
      const userReportDataArray = bundle?.userReportDataArray;
      if (!!bundle && userReportDataArray && userReportDataArray.length > 0) {
        for (const reportData of userReportDataArray) {
          for (const section of reportData.sections) {
            if (!scoresMap.has(section.name)) {
              scoresMap.set(section.name, []);
            }
            scoresMap.get(section.name)?.push({ score: section.score, maxScore: section.maxScore });
          }
        }
        scoresMap.forEach((scores, sn) => {
          const section = scores
            .filter(({ score, maxScore }) => score && score > 0) // Only calculate average score when user has score > 0
            .reduce(
              (prev, cur) => ({
                score: prev.score + cur.score,
                maxScore: prev.maxScore + cur.maxScore,
              }),
              { score: 0, maxScore: 0 } as SectionReportData
            );
          section.name = sn;
          teamAverageReportData.sections.push(section);
        });
        bundle.teamAverageReportData = teamAverageReportData;
      }
    }
  }

  hasError() {
    return this.errorMessages.length > 0;
  }
}
</script>

<style>
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

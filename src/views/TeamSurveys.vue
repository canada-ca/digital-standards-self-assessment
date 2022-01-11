<template>
  <div class="container">
    <h1>
      {{ $t("teamResults.title") }}
    </h1>
    <p>{{ $t("teamResults.description") }}</p>
    <p>
      <upload-team-surveys @loadTeamReportData="addTeamReportData" />
    </p>
    <div class="row">
      <div class="col">
        <b-img
          class="overview-image"
          fluid-grow
          :src="img"
          v-if="!hasReportData()"
        />
        <team-score-bar-chart :teamReportDataArray="teamReportDataArray" />
        <team-score-data-table
          :teamReportDataArray="teamReportDataArray"
          v-if="hasReportData()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadTeamSurveys from "@/components/team/UploadTeamSurveys.vue";
import TeamReportData from "@/interfaces/report/TeamReportData";
import TeamScoreBarChart from "@/components/team/TeamScoreBarChart.vue";
import TeamScoreDataTable from "@/components/team/TeamScoreDataTable.vue";
const teamSurveyOverviewImg = require("@/assets/teamSurveyOverview.png");

@Component({
  components: {
    UploadTeamSurveys,
    TeamScoreBarChart,
    TeamScoreDataTable
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    }
  }
})
export default class Results extends Vue {
  img = teamSurveyOverviewImg;

  teamReportDataArray: TeamReportData[] = [];

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    //    this.Survey.locale = value;
    //    this.Survey.render();
  }

  hasReportData(): boolean {
    return this.teamReportDataArray.length > 0;
  }

  addTeamReportData(teamReportData: TeamReportData) {
    const index = this.teamReportDataArray.findIndex(
      d => d.name === teamReportData.name
    );
    if (index === -1) {
      this.teamReportDataArray.push(teamReportData);
    } else {
      this.teamReportDataArray.splice(index, 1, teamReportData);
    }
  }
}
</script>

<style scoped>
.overview-image {
  padding: 40px 280px;
  position: absolute;
  top: 0px;
}
</style>

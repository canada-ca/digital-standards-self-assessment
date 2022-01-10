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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadTeamSurveys from "@/components/team/UploadTeamSurveys.vue";
import TeamReportData from "@/interfaces/report/TeamReportData";
import TeamScoreBarChart from "@/components/team/TeamScoreBarChart.vue";
const teamSurveyOverviewImg = require("@/assets/teamSurveyOverview.png");

@Component({
  components: {
    UploadTeamSurveys,
    TeamScoreBarChart
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
    this.teamReportDataArray.push(teamReportData);
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

<template>
  <div class="container">
    <h1>
      {{ $t("teamResults.title") }}
    </h1>
    <p v-if="!hasReportData">{{ $t("teamResults.description") }}</p>
    <p>
      <upload-team-surveys @loadTeamReportData="addTeamReportData" />
    </p>
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
        <team-score-data-table
          :teamReportDataArray="teamReportDataArray"
          v-if="hasReportData"
        />
        <individual-breakdown
          :teamReportDataArray="individualReportDataArray"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadTeamSurveys from "@/components/team/UploadTeamSurveys.vue";
import { TeamReportData, TeamReportDataBundle } from "@/store/state";
import TeamScoreBarChart from "@/components/team/TeamScoreBarChart.vue";
import TeamScoreDataTable from "@/components/team/TeamScoreDataTable.vue";
import IndividualBreakdown from "@/components/team/IndividualBreakdown.vue";
import { ActionTypes } from "@/store/actions";

@Component({
  components: {
    UploadTeamSurveys,
    TeamScoreBarChart,
    TeamScoreDataTable,
    IndividualBreakdown
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    }
  }
})
export default class Results extends Vue {
  get teamReportDataArray(): TeamReportData[] {
    return this.$store.getters.returnTeamReportDataArray;
  }
  get individualReportDataArray(): TeamReportDataBundle[] {
    return this.$store.getters.returnIndividualTeamReportDataArray;
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    //    this.Survey.locale = value;
    //    this.Survey.render();
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
</style>

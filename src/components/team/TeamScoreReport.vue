<template>
  <div class="col" v-if="teamReportDataArray">
    <ul class="card-deck">
      <TeamScoreCard
        v-for="teamData in teamReportDataArray"
        :teamReportData="teamData"
        :key="teamData.name"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import TeamScoreCard from "./TeamScoreCard.vue";
import TeamReportData from "@/interfaces/report/TeamReportData";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    TeamScoreCard
  }
})
export default class TeamScoreReport extends Vue {
  @Prop()
  teamReportDataArray!: Array<TeamReportData>;
}
</script>

<style scoped>
li.card {
  height: auto !important;
}
</style>

<template>
  <div style="margin-top: 40px" v-show="showBreakdown">
    <div>
      <b-link @click.prevent="hideBreakdown()">
        {{ $t("teamResults.hideIndividualBreakdown") }}
      </b-link>
    </div>
    <h5 class="text-center">{{ teamName }}</h5>
    <div class="individual-breakdown">
      <IndividualBreakdownItem
        :teamReportData="teamReportData"
        v-for="teamReportData in teamReportDataArray"
        :key="teamReportData.name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { TeamReportData } from "@/store/state";
import { Component, Prop, Vue } from "vue-property-decorator";
import IndividualBreakdownItem from "@/components/team/IndividualBreakdownItem.vue";
import { ActionTypes } from "@/store/actions";

@Component({
  components: { IndividualBreakdownItem }
})
export default class IndividualBreakdown extends Vue {
  @Prop()
  teamReportDataArray!: TeamReportData[];

  get teamName() {
    return this.$store.getters.returnIndividualTeamName;
  }

  get showBreakdown() {
    return this.$store.getters.returnShowBreakdown;
  }

  hideBreakdown() {
    this.$store.commit(ActionTypes.HideIndividualBreakdown);
  }
}
</script>

<style scoped>
.individual-breakdown {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>

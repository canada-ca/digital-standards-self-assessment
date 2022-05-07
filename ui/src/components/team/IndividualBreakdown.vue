<template>
  <div style="margin-top: 40px" v-if="showBreakdown">
    <div>
      <b-link @click.prevent="hideBreakdown()">
        {{ $t('teamResults.hideIndividualBreakdown') }}
      </b-link>
    </div>
    <h5 class="text-center">{{ teamName }}</h5>
    <div class="individual-breakdown">
      <IndividualBreakdownBarChart />
    </div>
  </div>
</template>

<script lang="ts">
import IndividualBreakdownBarChart from '@/components/team/IndividualBreakdownBarChart.vue';
import { Team } from '@/interfaces/api-models';
import { ActionTypes } from '@/store/actions';
import { UserReportData } from '@/store/state';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: { IndividualBreakdownBarChart },
})
export default class IndividualBreakdown extends Vue {
  get teamName() {
    const individualTeam: Team | undefined = this.$store.getters.returnIndividualTeam;
    return this.$i18n.locale === 'fr' ? individualTeam?.teamNameFr : individualTeam?.teamNameEn;
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

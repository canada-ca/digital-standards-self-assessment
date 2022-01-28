<template>
  <b-card class="mt-2">
    <b-card-header class="h3">
      {{ getSectionName(thisSurveyData, sectionName) }}
    </b-card-header>
    <b-card-body>
      <p class="h5">
        {{ $t("survey.currentScore") }}:
        {{ sectionScoreLevel(userScore, maxScore) }}%
      </p>
      <p></p>
      <ResultRecommendations
        v-if="!showRecommendation"
        :section-name="sectionName"
        :section-score-level="sectionScoreLevel"
        :section-recommendations="myRecommendations.sectionRecommendations"
        :locale="locale"
      />
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { SurveyModel } from "survey-vue";
import { Recommendations } from "@/types";
import ResultRecommendations from "@/components/ResultRecommendations.vue";
@Component({
  components: { ResultsCard, ResultRecommendations },
  computed: {
    showRecommendation: () => process.env.VUE_APP_SHOW_RECOMMENDATION
  },
  methods: {
    getSectionName(surveyData: SurveyModel, sectionName: string) {
      //TODO: validate if surveyData is undefined
      let page = surveyData.getPageByName(sectionName);
      return page.title;
    },
    sectionScoreLevel(userScore: number, maxScore: number) {
      return new Intl.NumberFormat("en-CA", {
        style: "decimal",
        maximumFractionDigits: 0
      }).format((userScore / maxScore) * 100);
    }
  }
})
export default class ResultsCard extends Vue {
  @Prop() public sectionName!: string;
  @Prop() public userScore!: number;
  @Prop() public maxScore!: number;
  @Prop() public myRecommendations!: Recommendations;
  @Prop() public locale!: any;
  thisSurveyData = this.$store.getters.returnSurveyModel;
}
</script>

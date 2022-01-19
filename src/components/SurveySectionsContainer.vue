<template>
  <div>
    <h5>{{ $t("currentSurveyResults") }}</h5>
    <SurveySectionCard
      v-for="section in sections"
      :key="section.id"
      :section="section"
      :survey="survey"
      :icon="getIcon(section.name, sectionRecommendation)"
    ></SurveySectionCard>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SurveySectionCard from "@/components/SurveySectionCard.vue";
import { PageModel, SurveyModel } from "survey-vue";
import { SectionRecommendation } from "@/types";

@Component({
  components: { SurveySectionCard }
})
export default class SurveySectionsContainer extends Vue {
  @Prop() public sections!: PageModel[];
  @Prop() public survey!: SurveyModel;
  @Prop() public sectionRecommendation!: SectionRecommendation[];

  getIcon(sectionName: string, sectionRecommendation: SectionRecommendation[]) {
    let section = sectionRecommendation.find(section => {
      return section.name === sectionName;
    });
    if (section !== undefined) {
      return section.icon;
    } else {
      return "smile";
    }
  }
}
</script>

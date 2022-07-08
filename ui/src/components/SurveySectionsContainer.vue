<template>
  <div>
    <h1>{{ $t('survey.currentSurveyResults') }}</h1>
    <SurveySectionCard
      v-for="section in sections"
      :key="section.id"
      :sectionTitle="section.title"
      :sectionName="section.name"
      :sectionDescription="section.description"
      :survey="survey"
    ></SurveySectionCard>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SurveySectionCard from '@/components/SurveySectionCard.vue';
import { PageModel, SurveyModel } from 'survey-vue';

@Component({
  components: { SurveySectionCard },
})
export default class SurveySectionsContainer extends Vue {
  @Prop() public sections!: PageModel[];
  @Prop() public survey!: SurveyModel;
}
</script>

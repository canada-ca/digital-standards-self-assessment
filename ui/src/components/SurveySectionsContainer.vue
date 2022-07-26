<template>
  <div>
    <h1>{{ $t('survey.currentSurveyResults') }}</h1>
    <section v-if="sectionGroups">
      <div v-for="sectionGroup in sectionGroups" :key="sectionGroup.displayOrder">
        <div class="section-group">{{ getSectionGroupName(sectionGroup) }}</div>
        <SurveySectionCard
          v-for="section in getSectionsByGroup(sectionGroup)"
          :key="section.id"
          :section="section"
          :survey="survey"
        ></SurveySectionCard>
      </div>
    </section>
    <section v-if="!sectionGroups">
      <SurveySectionCard
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :survey="survey"
      ></SurveySectionCard>
    </section>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SurveySectionCard from '@/components/SurveySectionCard.vue';
import { PageModel, SurveyModel } from 'survey-vue';
import { SectionGroup } from '@/interfaces/api-models';

@Component({
  components: { SurveySectionCard },
})
export default class SurveySectionsContainer extends Vue {
  @Prop() sectionGroups!: SectionGroup[];
  @Prop() sections!: PageModel[];
  @Prop() survey!: SurveyModel;

  getSectionGroupName(sg: SectionGroup) {
    return this.$i18n.locale === 'fr' ? sg.titleFr : sg.titleEn;
  }

  getSectionsByGroup(sg: SectionGroup) {
    return sg.sectionNames.map((sn) => this.sections.find((s) => s.name === sn));
  }
}
</script>
<style scoped>
.section-group {
  font-size: 24px;
  font-weight: bold;
  padding: 20px 0px 5px 0px;
}
</style>

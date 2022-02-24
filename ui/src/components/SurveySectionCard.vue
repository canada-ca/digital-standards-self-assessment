<template>
  <div class="survey-card-container">
    <div class="survey-card" img-top>
      <div class="icon-container">
        <i :class="setStatusIcon(section.name)"></i>
      </div>
      <div style="flex: auto">
        <div class="survey-title">
          <a href="#" @click.prevent="goToSection(section.name)" @keypress.space="goToSection(section.name)">{{
            section.title
          }}</a>
        </div>
        <transition name="collapsed" mode="out-in">
          <div v-if="!collapsed" class="mt-3">
            <p style="font-size: 16px">
              {{ getShortDescription(section.description) }}
            </p>
            <span style="color: #395072; font-weight: 700">
              {{ $t('survey.currentScore') }} :
              {{ sectionScoreLevel(section.name) }}
            </span>
          </div>
        </transition>
      </div>
    </div>
    <div class="show-hide-container">
      <show-hide-link :hide="true" @onToggled="toggleCollapsed()" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { PageModel, SurveyModel } from 'survey-vue';
import { Section } from '@/types';
import { ActionTypes } from '@/store/actions';
import ShowHideLink from '@/components/ShowHideLink.vue';

@Component({
  components: { ShowHideLink },
})
export default class SurveySectionCard extends Vue {
  @Prop() public section!: PageModel;
  @Prop() public survey!: SurveyModel;

  collapsed = true;

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  goToSection(sectionName: string) {
    this.survey.currentPage = sectionName;
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.survey);
    this.$store.dispatch(ActionTypes.UpdateCurrentPageName, sectionName);
    this.$router.push('/questions');
  }

  getShortDescription(description: string) {
    let maxLen = 280;
    if (description.length <= maxLen) return description;
    return description.substr(0, description.lastIndexOf(' ', maxLen)) + '... ';
  }

  sectionScoreLevel(sectionName: string) {
    const thisSection: Section = this.$store.getters.returnSectionByName(sectionName);
    if (thisSection === undefined) {
      return 'N/A';
    }
    let scorePercentage: string = new Intl.NumberFormat('en-CA', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format((thisSection.userScore / thisSection.maxScore) * 100);
    if (scorePercentage === 'NaN' || scorePercentage === '0') {
      return 'N/A';
    } else {
      return scorePercentage + '%';
    }
  }

  setStatusIcon(sectionName: string) {
    const thisSection: Section = this.$store.getters.returnSectionByName(sectionName);
    if (thisSection !== undefined && thisSection.userScore > 0) {
      return 'fa fa-2x fa-circle';
    } else {
      return 'zero fa fa-2x fa-circle';
    }
  }
}
</script>

<style scoped>
.survey-title {
  font-size: 1.2em !important;
  color: #395072;
}

.survey-title > a {
  cursor: pointer;
}

.survey-card-container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  background-color: #fff;
  background-clip: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
}

.survey-card-container:focus {
  outline: '1px solid black';
  box-shadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
}

.survey-card {
  padding: 20px;
  width: 100%;
  min-width: 30rem;
  display: flex;
}

.icon-container {
  min-width: 60px;
  color: #26374b;
  text-align: left;
  height: 100%;
}

.zero {
  color: #e5e5e5;
}

.show-hide-container {
  text-align: right;
  margin: -35px 15px 0px 0px;
}

.collapsed-enter-active,
.collapsed-leave-active {
  transition: all 0.5s;
  max-height: 200px;
}
.collapsed-enter,
.collapsed-leave-to {
  opacity: 0;
  max-height: 0px;
}
</style>

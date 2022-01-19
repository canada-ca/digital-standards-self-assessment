<template>
  <div class="survey-card-container" :style="cardStyles">
    <div
      class="survey-card"
      img-top
      tabindex="0"
      v-on:click="goToSection(section.name)"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @keydown.space="goToSection(section.name)"
    >
      <div class="icon-container">
        <i :class="setIconClass(icon)"></i>
      </div>
      <div style="flex: auto;">
        <div class="survey-title">
          {{ section.title }}
        </div>
        <transition name="collapsed" mode="out-in">
          <div v-if="!collapsed" class="mt-3">
            <p style="font-size: 16px;">
              {{ getShortDescription(section.description) }}
            </p>
            <span style="color: #395072">
              {{ $t("currentScore") }}: {{ sectionScoreLevel(section.name) }}%
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { PageModel, SurveyModel } from "survey-vue";
import { Section } from "@/types";
import { ActionTypes } from "@/store/actions";
import ShowHideLink from "@/components/ShowHideLink.vue";

@Component({
  components: { ShowHideLink },
  data: function() {
    return {
      cardStyleHover: {
        "box-shadow": "0 0 0 2px black",
        cursor: "pointer"
      },
      cardStyle: {
        "box-shadow":
          "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19)"
      },
      hover: false
    };
  },
  computed: {
    cardStyles() {
      if (this.$data.hover == true) {
        return this.$data.cardStyleHover;
      } else {
        return this.$data.cardStyle;
      }
    }
  }
})
export default class SurveySectionCard extends Vue {
  @Prop() public section!: PageModel;
  @Prop() public survey!: SurveyModel;
  @Prop() public icon!: string;

  collapsed = true;

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  goToSection(sectionName: string) {
    this.survey.currentPage = sectionName;
    // this.$store.commit("updateSurveyData", this.survey);
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.survey);
    // this.$store.commit("updateCurrentPageName", sectionName);
    this.$store.dispatch(ActionTypes.UpdateCurrentPageName, sectionName);
    this.$router.push("/questions");
  }

  setIconClass(icon: string) {
    let classDef: string = "fas fa-" + icon + " fa-2x";
    return classDef;
  }

  getShortDescription(description: string) {
    let maxLen = 280;
    if (description.length <= maxLen) return description;
    return description.substr(0, description.lastIndexOf(" ", maxLen)) + "... ";
  }

  sectionScoreLevel(sectionName: string) {
    const thisSection: Section = this.$store.getters.returnSectionByName(
      sectionName
    );
    if (thisSection === undefined) {
      return "0";
    }
    let scorePercentage: string = new Intl.NumberFormat("en-CA", {
      style: "decimal",
      maximumFractionDigits: 0
    }).format((thisSection.userScore / thisSection.maxScore) * 100);
    if (scorePercentage === "NaN") {
      return "0";
    }
    return scorePercentage;
  }

  setStatusIcon(sectionName: string) {
    const thisSection: Section = this.$store.getters.returnSectionByName(
      sectionName
    );
    if (thisSection === undefined) {
      return "far fa-circle";
    } else if (thisSection.userScore === 0) {
      return "far fa-circle";
    } else if (thisSection.userScore > 0) {
      return "fas fa-circle";
    } else {
      return "fas fa-circle";
    }
  }
}
</script>

<style scoped>
.survey-title {
  font-size: 1.2em !important;
  color: #395072;
}

.survey-card-container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  background-color: #fff;
  background-clip: border-box;
  margin-top: 10px;
  margin-bottom: 10px;
}

.survey-card-container:focus {
  outline: "1px solid black";
  box-shadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
}

.survey-card {
  padding: 20px;
  width: 100%;
  min-width: 30rem;
  display: flex;
}

.icon-container {
  min-width: 60px;
  color: #395072;
  text-align: left;
  height: 100%;
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

<template>
  <li
    class="card"
    img-top
    tabindex="0"
    style="min-width: 30rem; margin-top: 15px; margin-bottom: 5px;"
    v-on:click="goToSection(section.name)"
    :survey="survey"
    v-bind:style="cardStyles"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @keydown.space="goToSection(section.name)"
  >
    <i
      :class="setIconClass(icon)"
      style="margin-top: 20px; color: #395072; text-align:center;"
    ></i>
    <div class="card-body">
      <h2 style="color: #395072;" class="card-title">{{ section.title }}</h2>
      <p style="font-size: 16px;" class="card-text">
        {{ getShortDescription(section.description) }}
      </p>
    </div>
    <div class="card-footer">
      <span style="color: #395072">
        <i :class="setStatusIcon(section.name)">
          {{ $t("currentScore") }}: {{ sectionScoreLevel(section.name) }}%</i
        >
      </span>
    </div>
  </li>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PageModel, SurveyModel } from "survey-vue";
import { Section } from "@/types";
import { ActionTypes } from "@/store/actions";

@Component({
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
  },
  methods: {
    setIconClass(icon: string) {
      let classDef: string = "fas fa-" + icon + " fa-4x";
      return classDef;
    },
    getShortDescription(description: string) {
      let maxLen = 280;
      if (description.length <= maxLen) return description;
      return (
        description.substr(0, description.lastIndexOf(" ", maxLen)) + "... "
      );
    },
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
    },
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
})
export default class HomeSectionCard extends Vue {
  @Prop() public section!: PageModel;
  @Prop() public survey!: SurveyModel;
  @Prop() public icon!: string;

  goToSection(sectionName: string) {
    this.survey.currentPage = sectionName;
    // this.$store.commit("updateSurveyData", this.survey);
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.survey);
    // this.$store.commit("updateCurrentPageName", sectionName);
    this.$store.dispatch(ActionTypes.UpdateCurrentPageName, sectionName);
    this.$router.push("/questions");
  }
}
</script>

<style scoped>
h2 {
  font-size: 1.2em !important;
}
li:focus {
  outline: "1px solid black";
  box-shadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
}
</style>

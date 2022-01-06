<template>
  <li
    class="card"
    tabindex="0"
    style="min-width: 20rem; margin-top: 15px; margin-bottom: 5px;"
    v-on:click="gotoTeamReport(teamReportData.name)"
    v-bind:style="cardStyles"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @keydown.space="gotoTeamReport(teamReportData.name)"
  >
    <div class="card-body">
      <div
        v-for="sectionData in teamReportData.sections"
        :key="sectionData.name"
        :title="sectionData.title"
      >
        {{ sectionData.name }}: {{ sectionScoreLevel(sectionData.name) }}%
      </div>
    </div>
    <div class="card-footer">
      <span style="color: #395072">
        {{ teamReportData.name }}
      </span>
    </div>
  </li>
</template>

<script lang="ts">
import TeamReportData from "@/interfaces/report/TeamReportData";
import { Component, Prop, Vue } from "vue-property-decorator";

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
  }
})
export default class TeamScoreCard extends Vue {
  @Prop() public teamReportData!: TeamReportData;

  sectionScoreLevel(sectionName: string) {
    if (this.teamReportData) {
      const sectionReportData = this.teamReportData.sections.find(
        s => s.name === sectionName
      );
      if (sectionReportData === undefined) {
        return "0";
      }
      let scorePercentage: string = new Intl.NumberFormat("en-CA", {
        style: "decimal",
        maximumFractionDigits: 0
      }).format((sectionReportData.score / sectionReportData.maxScore) * 100);
      if (scorePercentage === "NaN") {
        return "0";
      }
      return scorePercentage;
    }
    return 0;
  }

  gotoTeamReport(teamName: string) {}
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

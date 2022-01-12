<template>
  <div>
    <b-table
      :striped="true"
      :bordered="true"
      :hover="true"
      head-variant="dark"
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      responsive="sm"
    ></b-table>
  </div>
</template>

<script lang="ts">
import { TeamReportData } from "@/store/state";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class TeamScoreDataTable extends Vue {
  @Prop()
  teamReportDataArray!: Array<TeamReportData>;

  sortBy = "team_name";
  sortDesc = false;
  fields = [{ key: "team_name", sortable: true }];

  items: any[] = [];

  private extractAllSectionNames() {
    const sectionNameSet: Set<string> = new Set();
    this.teamReportDataArray.forEach(t => {
      t.sections.forEach(s => {
        sectionNameSet.add(s.name);
      });
    });
    const sectionNames = [...sectionNameSet];
    this.fields = [{ key: "team_name", sortable: true }];
    sectionNames.map(sn => {
      this.fields.push({ key: sn, sortable: true });
    });
    return sectionNames;
  }

  private getTeamScores(sectionNames: string[]) {
    this.items = [];
    this.teamReportDataArray.forEach(data => {
      var rec: { [k: string]: any } = {};
      rec["team_name"] = data.name;
      sectionNames.forEach(sn => {
        // eslint-disable-next-line security/detect-object-injection
        rec[sn] = this.getSectionScore(data.name, sn);
      });
      this.items.push(rec);
    });
  }

  private getSectionScore(teamName: string, sectionName: string): string {
    let scorePercentage = "0";
    if (this.teamReportDataArray) {
      const teamReportData = this.teamReportDataArray.find(
        t => t.name === teamName
      );
      if (teamReportData) {
        const section = teamReportData.sections.find(
          s => s.name === sectionName
        );
        if (section) {
          scorePercentage = new Intl.NumberFormat("en-CA", {
            style: "decimal",
            maximumFractionDigits: 0
          }).format((section.score / section.maxScore) * 100);
          if (scorePercentage === "NaN") {
            return "0";
          }
        }
      }
    }
    return scorePercentage;
  }

  created() {
    this.createDatatable();
  }

  @Watch("teamReportDataArray")
  createDatatable() {
    const sectionNames = this.extractAllSectionNames();
    this.getTeamScores(sectionNames);
  }
}
</script>

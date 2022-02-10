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
    >
      <template #cell(team_name)="row">
        <b-link
          class="team-name"
          v-b-tooltip.hover
          :title="$t('teamResults.showIndividualBreakdown')"
          @click.prevent="showIndividualBreakdown(row)"
        >
          {{ row.item.team_name }}
        </b-link>
      </template>
      <template #cell(actions)="row">
        <b-link
          class="delete-team"
          @click.prevent="deleteTeam(row)"
          v-b-tooltip.hover
          :title="$t('teamResults.deleteTeam')"
        >
          <b-icon-trash style="margin-right: 10px" class="action-icon" />
        </b-link>
      </template>
    </b-table>
    <div
      style="font-size: 12px"
      v-html="
        markdownToHtml($t('teamResults.showIndividualBreakdownInstruction'))
      "
    />
  </div>
</template>

<script lang="ts">
import { TeamReportData } from "@/store/state";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { BIconTrash } from "bootstrap-vue";
import { ActionTypes } from "@/store/actions";
import { marked } from "marked";
import i18n from "@/plugins/i18n";

@Component({
  components: {
    BIconTrash
  }
})
export default class TeamScoreDataTable extends Vue {
  @Prop()
  teamReportDataArray!: Array<TeamReportData>;

  sortBy = "team_name";
  sortDesc = false;
  fields = [{ key: "team_name", sortable: true }] as any[];

  items: any[] = [];

  private extractAllSectionNames() {
    const sectionNameSet: Set<string> = new Set();
    this.teamReportDataArray.forEach((t) => {
      t.sections.forEach((s) => {
        sectionNameSet.add(s.name);
      });
    });
    const sectionNames = [...sectionNameSet];
    this.fields = [
      {
        key: "team_name",
        sortable: true,
        label: i18n.t("teamResults.teamName")
      }
    ];
    sectionNames.map((sn) => {
      this.fields.push({ key: sn, sortable: true });
    });
    this.fields.push({
      key: "actions",
      sortable: false,
      tdClass: "text-center",
      label: i18n.t("teamResults.actions")
    });
    return sectionNames;
  }

  private getTeamScores(sectionNames: string[]) {
    this.items = [];
    this.teamReportDataArray.forEach((data) => {
      var rec: { [k: string]: any } = {};
      rec["team_name"] = data.name;
      sectionNames.forEach((sn) => {
        // eslint-disable-next-line security/detect-object-injection
        rec[sn] = this.getSectionScore(data.name, sn) + "%";
      });
      this.items.push(rec);
    });
  }

  private getSectionScore(teamName: string, sectionName: string): string {
    let scorePercentage = "0";
    if (this.teamReportDataArray) {
      const teamReportData = this.teamReportDataArray.find(
        (t) => t.name === teamName
      );
      if (teamReportData) {
        const section = teamReportData.sections.find(
          (s) => s.name === sectionName
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
  @Watch("$i18n.locale")
  createDatatable() {
    const sectionNames = this.extractAllSectionNames();
    this.getTeamScores(sectionNames);
  }

  deleteTeam(row: any) {
    this.$store.commit(ActionTypes.DeleteTeamSurvey, row.item.team_name);
  }

  showIndividualBreakdown(row: any) {
    this.$store.commit(ActionTypes.ShowIndividualBreakdown, row.item.team_name);
  }

  markdownToHtml(item: string) {
    return marked(item);
  }
}
</script>

<style scoped>
.action-icon {
  cursor: pointer;
  user-select: none;
}
.team-name {
  cursor: pointer;
}
.delete-team {
  text-decoration: none !important;
}
</style>

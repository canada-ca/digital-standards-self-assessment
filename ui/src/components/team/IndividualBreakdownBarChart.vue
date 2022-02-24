<template>
  <div
    v-if="hasReportData"
    ref="barChart"
    style="min-width: 100%; height: 500px; margin-top: 30px"
  ></div>
</template>

<script lang="ts">
import { TeamReportData } from "@/store/state";
import * as echarts from "echarts";
import { ECharts, EChartsOption } from "echarts";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class IndividualBreakdownBarCard extends Vue {
  @Prop()
  teamReportDataArray!: Array<TeamReportData>;

  allTeamNames: string[] = [];
  teamScores: any[][] = [];
  chartSeries: echarts.SeriesOption[] = [];
  chart!: ECharts;

  $refs!: {
    barChart: HTMLElement;
  };

  get hasReportData() {
    return this.teamReportDataArray && this.teamReportDataArray.length > 0;
  }

  created() {
    window.addEventListener("resize", this.onResize);
  }

  mounted() {
    this.creatEcharts();
  }

  destroyed() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  private extractAllSectionNames() {
    const sectionNameSet: Set<string> = new Set();
    this.teamReportDataArray.forEach((t) => {
      t.sections.forEach((s) => {
        sectionNameSet.add(s.name);
      });
    });
    return [...sectionNameSet];
  }

  private extractAllTeamNames() {
    this.allTeamNames = [];
    this.teamReportDataArray.forEach((t) => {
      this.allTeamNames.push(t.name);
    });
    this.chartSeries = this.allTeamNames.map((name) => ({
      type: "bar",
      label: { show: true, position: "top" }
    }));
    this.teamScores = this.getTeamScores();
  }

  private getTeamScores(): any[][] {
    const teamScoreArray: any[][] = [];
    const allSectionNames = this.extractAllSectionNames();
    allSectionNames.forEach((sn) => {
      const rec: any[] = [];
      rec.push(sn);
      this.teamReportDataArray.forEach((data) => {
        rec.push(this.getSectionScore(data.name, sn));
      });
      teamScoreArray.push(rec);
    });
    return teamScoreArray;
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

  @Watch("teamReportDataArray")
  creatEcharts() {
    if (!this.hasReportData) {
      if (this.chart) {
        this.chart.dispose();
      }
      return;
    }
    this.extractAllTeamNames();
    const option: EChartsOption = {
      legend: {
        data: this.allTeamNames
      },
      tooltip: {},
      dataset: {
        source: [["section", ...this.allTeamNames], ...this.teamScores]
      },
      xAxis: { type: "category" },
      yAxis: {
        type: "value",
        axisLabel: {
          show: true,
          interval: "auto",
          formatter: "{value}%"
        }
      },
      series: this.chartSeries
    };
    if (this.chart) {
      this.chart.dispose();
    }
    this.chart = echarts.init(this.$refs.barChart);
    this.chart.setOption(option);
  }
}
</script>

<template>
  <div>
    <div class="text-center">{{ individualName }}</div>
    <div
      v-if="hasReportData"
      ref="barChart"
      style="min-width: 500px; height: 250px; margin: 20px 10px"
    ></div>
  </div>
</template>

<script lang="ts">
import { SectionReportData, TeamReportData } from "@/store/state";
import { ECharts, EChartsOption } from "echarts";
import * as echarts from "echarts";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class IndividualBreakdownItem extends Vue {
  @Prop()
  teamReportData!: TeamReportData;

  get individualName(): string {
    return this.teamReportData.name;
  }
  chart!: ECharts;

  $refs!: {
    barChart: HTMLElement;
  };

  get hasReportData() {
    return !!this.teamReportData;
  }

  mounted() {
    this.creatEcharts();
  }

  @Watch("teamReportData")
  creatEcharts() {
    const allSectionNames = this.extractAllSectionNames();
    const scores = this.getScores();
    const option: EChartsOption = {
      grid: {
        left: "10%",
        right: "0%",
        top: "0%",
        show: true
      },
      tooltip: {},
      xAxis: {
        type: "category",
        data: allSectionNames,
        axisLabel: { interval: 0, rotate: 30 }
      },
      yAxis: {
        type: "value",
        axisLabel: {
          show: true,
          interval: "auto",
          formatter: "{value}%"
        }
      },
      series: [
        {
          data: scores,
          type: "bar"
        }
      ]
    };
    if (this.chart) {
      this.chart.dispose();
    }
    this.chart = echarts.init(this.$refs.barChart);
    this.chart.setOption(option);
  }

  private extractAllSectionNames() {
    const sectionNameSet: Set<string> = new Set();
    this.teamReportData.sections.forEach(s => {
      sectionNameSet.add(s.name);
    });
    return [...sectionNameSet];
  }

  private getScores(): any[] {
    const teamScoreArray: any[] = [];
    this.teamReportData.sections.forEach(s => {
      teamScoreArray.push(this.getScore(s));
    });
    return teamScoreArray;
  }

  private getScore(section: SectionReportData): string {
    let scorePercentage = "0";
    scorePercentage = new Intl.NumberFormat("en-CA", {
      style: "decimal",
      maximumFractionDigits: 0
    }).format((section.score / section.maxScore) * 100);
    if (scorePercentage === "NaN") {
      return "0";
    }
    return scorePercentage;
  }
}
</script>

<style scoped></style>

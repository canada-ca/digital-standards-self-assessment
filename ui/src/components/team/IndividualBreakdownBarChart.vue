<template>
  <div v-if="hasReportData" ref="barChart" style="min-width: 100%; height: 500px; margin-top: 30px"></div>
</template>

<script lang="ts">
import { UserReportData } from '@/store/state';
import * as echarts from 'echarts';
import { ECharts, EChartsOption } from 'echarts';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class IndividualBreakdownBarCard extends Vue {
  allEmails: string[] = [];
  userScores: any[][] = [];
  chartSeries: echarts.SeriesOption[] = [];
  chart!: ECharts;

  $refs!: {
    barChart: HTMLElement;
  };

  get userReportDataArray(): Array<UserReportData> {
    return this.$store.getters.returnIndividualTeamReportDataArray;
  }

  get hasReportData() {
    return this.userReportDataArray && this.userReportDataArray.length > 0;
  }

  created() {
    window.addEventListener('resize', this.onResize);
  }

  mounted() {
    this.creatEcharts();
  }

  destroyed() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    if (this.chart) {
      this.chart.resize();
    }
  }

  private extractAllSectionNames() {
    const sectionNameSet: Set<string> = new Set();
    this.userReportDataArray.forEach((t) => {
      t.sections.forEach((s) => {
        sectionNameSet.add(s.name);
      });
    });
    return [...sectionNameSet];
  }

  private extractAllUserEmails() {
    this.allEmails = [];
    this.userReportDataArray.forEach((t) => {
      this.allEmails.push(t.email);
    });
    this.chartSeries = this.allEmails.map((email) => ({
      type: 'bar',
      label: { show: true, position: 'top' },
    }));
    this.userScores = this.getUserScores();
  }

  private getUserScores(): any[][] {
    const userScoreArray: any[][] = [];
    const allSectionNames = this.extractAllSectionNames();
    allSectionNames.forEach((sn) => {
      const rec: any[] = [];
      rec.push(sn);
      this.userReportDataArray.forEach((data) => {
        rec.push(this.getSectionScore(data.email, sn));
      });
      userScoreArray.push(rec);
    });
    return userScoreArray;
  }

  private getSectionScore(email: string, sectionName: string): string {
    let scorePercentage = '0';
    if (this.userReportDataArray) {
      const userReportData = this.userReportDataArray.find((t) => t.email === email);
      if (userReportData) {
        const section = userReportData.sections.find((s) => s.name === sectionName);
        if (section) {
          scorePercentage = new Intl.NumberFormat('en-CA', {
            style: 'decimal',
            maximumFractionDigits: 0,
          }).format((section.score / section.maxScore) * 100);
          if (scorePercentage === 'NaN') {
            return '0';
          }
        }
      }
    }
    return scorePercentage;
  }

  @Watch('$store.getters.returnIndividualTeamReportDataArray')
  creatEcharts() {
    if (!this.hasReportData) {
      if (this.chart) {
        this.chart.dispose();
      }
      return;
    }
    this.extractAllUserEmails();
    const option: EChartsOption = {
      legend: {
        data: this.allEmails,
      },
      tooltip: {},
      dataset: {
        source: [['section', ...this.allEmails], ...this.userScores],
      },
      xAxis: { type: 'category' },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          interval: 'auto',
          formatter: '{value}%',
        },
      },
      series: this.chartSeries,
    };
    if (this.chart) {
      this.chart.dispose();
    }
    this.chart = echarts.init(this.$refs.barChart);
    this.chart.setOption(option);
  }
}
</script>

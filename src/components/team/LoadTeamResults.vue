<template>
  <div>
    <div class="row">
      <div class="col">
        <b-form-file
          :lang="locale"
          ref="fileUpload"
          :placeholder="$t('loadFile')"
          :browse-text="$t('teamResults.browse')"
          multiple="multiple"
          @change="onFileChanged($event)"
        />
      </div>
    </div>
    <div class="row text-danger mt-3" v-if="hasError()">
      <div class="col">
        <ul>
          <li v-for="(error, index) in errorMessages" :key="index">
            {{ $t(error.message, { fileName: error.param }) }}
          </li>
        </ul>
      </div>
    </div>
    <div class="row" v-if="hasReportData() && !hasError()">
      <div class="col">
        <b-tabs style="margin-top: 20px">
          <b-tab :title="$t('teamResults.teamScoreDetails')" active>
            <team-score-bar-chart :teamReportDataArray="teamReportDataArray" />
            <team-score-report :teamReportDataArray="teamReportDataArray" />
          </b-tab>
          <b-tab
            :title="$t('teamResults.teamAverageScore')"
            v-if="hasAverageData()"
          >
            <results-section-container
              v-for="section of teamAverageReportData.sections"
              :sectionReportData="section"
              :key="section.name"
            />
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ErrorMessage from "@/interfaces/ErrorMessage";
import SectionReportData from "@/interfaces/report/SectionReportData";
import TeamReportData from "@/interfaces/report/TeamReportData";
import SurveyFile from "@/interfaces/SurveyFile";
import { isEqual } from "lodash";
import { Model } from "survey-vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import TeamScoreBarChart from "@/components/team/TeamScoreBarChart.vue";
import TeamScoreReport from "@/components/team/TeamScoreReport.vue";
import ResultsSectionContainer from "@/components/team/ResultsSectionContainer.vue";

@Component({
  components: {
    TeamScoreReport,
    TeamScoreBarChart,
    ResultsSectionContainer
  }
})
export default class LoadTeamResults extends Vue {
  surveyDataArray: Array<SurveyFile> = [];
  teamReportDataArray: Array<TeamReportData> = [];
  teamAverageReportData!: TeamReportData;
  errorMessages: Array<ErrorMessage> = [];
  locale = "en";

  $refs!: {
    fileUpload: HTMLInputElement;
  };

  hasError() {
    return this.errorMessages.length > 0;
  }

  hasReportData() {
    return !!this.surveyDataArray && this.surveyDataArray.length > 0;
  }

  hasAverageData() {
    return (
      !!this.teamAverageReportData &&
      this.teamAverageReportData.sections.length > 0
    );
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.locale = value;
  }

  onFileChanged($event: any) {
    if (
      $event === null ||
      $event.target === null ||
      $event.dataTransfer === null
    ) {
      return;
    }

    const target = $event.target as HTMLInputElement;
    const files = target.files || $event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    this.surveyDataArray = new Array();
    this.teamReportDataArray = new Array();
    const fileCount = files.length;
    files.forEach((file: any) => {
      this.loadSurveyFromFile(fileCount, file);
    });
  }

  loadSurveyFromFile(fileCount: number, file: any) {
    const reader = new FileReader();
    let surveyFile: SurveyFile;
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === "undefined") {
        surveyFile = {
          fileName: file.name,
          hasError: true,
          errorMessage: "validation.file.format",
          currentPage: 0
        };
        this.errorMessages.push({
          message: "validation.file.format",
          param: file.name
        });
      } else {
        try {
          surveyFile = JSON.parse(result);
          surveyFile.hasError = false;
          surveyFile.fileName = file.name;
          this.teamReportDataArray.push({
            name: surveyFile.fileName.substr(0, surveyFile.fileName.length - 5),
            sections: this.extractReportData(surveyFile)
          });
        } catch (e) {
          this.$refs.fileUpload.value = "";
          surveyFile = {
            fileName: file.name,
            hasError: true,
            errorMessage: "validation.file.format",
            currentPage: 0
          };
          this.errorMessages.push({
            message: "validation.file.format",
            param: file.name
          });
        }
      }
      this.surveyDataArray.push(surveyFile);

      if (this.surveyDataArray.length === fileCount) {
        // sort report data
        this.teamReportDataArray.sort((a, b) =>
          a.name < b.name ? -1 : a.name == b.name ? 0 : 1
        );
        this.teamAverageReportData = { ...this.teamReportDataArray[0] };
        this.averageTeamScore();
      }
    };
    reader.readAsText(file);
  }

  private averageTeamScore() {
    if (this.teamAverageReportData === undefined) {
      return;
    }
    // Extract score into a map
    // section_name: question_name: [score1, score2, score3]
    const scoresMap: Map<String, Map<string, any[]>> = new Map();
    if (this.surveyDataArray.length > 0) {
      const firstSurvey = this.surveyDataArray[0].surveyJSON;
      for (const surveyFile of this.surveyDataArray) {
        // validate if all files have same format
        if (!isEqual(firstSurvey, surveyFile.surveyJSON)) {
          this.errorMessages.push({
            message: "validation.file.differentFormat"
          } as ErrorMessage);
          return;
        }
        for (const section of surveyFile.surveyJSON.pages) {
          if (!scoresMap.has(section.name)) {
            scoresMap.set(section.name, new Map<string, any[]>());
          }
          const sectionScoreMap = scoresMap.get(section.name);
          for (const question of section.elements) {
            if (!sectionScoreMap!.has(question.name)) {
              sectionScoreMap!.set(question.name, []);
            }
            sectionScoreMap!
              .get(question.name)!
              .push(surveyFile.data[question.name]);
          }
        }
      }
      for (const section of this.teamAverageReportData.sections) {
        for (const question of section.questions) {
          const scoreArray = scoresMap!
            .get(section.name)!
            .get(question.name)!
            .filter(v => v !== undefined);
          if (question.type == "rating") {
            const sum = scoreArray!.reduce((a, b) => a + b, 0);
            const avg = sum / scoreArray!.length || 0;
            question.answer = Math.round(avg);
          } else if (question.type === "boolean") {
            const booleanResult = scoreArray!.reduce(
              (prevVal, curVal) => {
                curVal ? prevVal.true++ : prevVal.false++;
                return prevVal;
              },
              { true: 0, false: 0 }
            );
            question.answer =
              booleanResult.true + " true, " + booleanResult.false + " false";
          }
        }
      }
    }
  }

  private extractReportData(surveyFile: SurveyFile): Array<SectionReportData> {
    const sectionReportDataArray: Array<SectionReportData> = [];
    if (surveyFile.surveyJSON) {
      let survey: Model = new Model(surveyFile.surveyJSON);
      survey.data = surveyFile.data;
      survey.pages.forEach(page => {
        const sectionReportData: SectionReportData = {
          name: page.name,
          score: 0,
          maxScore: page.questions.length * 5,
          questions: [],
          title: page.title
        };
        page.questions.forEach(question => {
          sectionReportData.questions.push({
            name: question.name,
            type: question.getType(),
            title: question.title,
            answer: question.value
          });
          if (question.value !== undefined) {
            let score = 0;
            if (question.getType() === "rating") {
              score = +question.value;
            } else if (question.getType() === "boolean") {
              if (question.value) {
                score = 5;
              } else {
                score = 1;
              }
            }
            sectionReportData.score += score;
          }
        });
        sectionReportDataArray.push(sectionReportData);
      });
    }
    return sectionReportDataArray;
  }
}
</script>

<style></style>

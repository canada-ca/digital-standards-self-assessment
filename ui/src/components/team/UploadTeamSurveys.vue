<template>
  <div>
    <b-link @click="showUploadDialog($event)">{{ $t('teamResults.uploadSurveys') }}</b-link>
    <b-modal id="upload-team-survey-modal" size="lg" @shown="focus">
      <template #modal-header>
        <div>{{ $t('teamResults.uploadSurveys') }}</div>
      </template>
      <template #default>
        <div style="padding: 30px">
          <b-form-group
            :label="$t('teamResults.teamName')"
            label-for="teamName"
            :invalid-feedback="$t(invalidFeedback())"
            :state="state()"
          >
            <b-form-input
              id="teamName"
              ref="teamNameInput"
              :placeholder="$t('teamResults.teamNamePlaceholder')"
              v-model="teamName"
              :state="state()"
              trim
            ></b-form-input>
          </b-form-group>
          <div class="row">
            <div class="col text-center">
              <b-form-file
                id="fileInput"
                tabindex="-1"
                @change="onFileChanged($event)"
                multiple="multiple"
                style="opacity: 0; height: 0px; width: 0px"
              />
              <b-button @click="selectFile($event)" class="btn btn-primary upload-button">{{
                $t('teamResults.uploadSurveys')
              }}</b-button>
              <div class="row text-danger mt-3" v-if="hasError()">
                <div class="col">
                  <ul>
                    <li v-for="(error, index) in errorMessages" :key="index">
                      {{ $t(error.message, { fileName: error.param }) }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="file-list-div">
                <div v-for="(file, index) in files" :key="index">
                  <file-item :file="file" @delete="deleteFile(index)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #modal-footer>
        <b-button class="btn btn-primary" @click="calculateResults()" :disabled="!readyToCalc()">
          {{ $t('teamResults.calcResults') }}
        </b-button>
        <b-button class="btn btn-default" style="width: 120px; margin-right: 10px !important" @click="closeModal()">
          {{ $t('downloadUploadSurvey.cancel') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import FileItem from '@/components/team/FileItem.vue';
import ErrorMessage from '@/interfaces/ErrorMessage';
import { SectionReportData, TeamReportDataBundle } from '@/store/state';
import { TeamReportData } from '@/store/state';
import SurveyFile from '@/interfaces/SurveyFile';
import { Model } from 'survey-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { calcScore, calcSectionMaxScore } from '@/utils/utils';

@Component({
  components: { FileItem },
})
export default class UploadTeamSurveys extends Vue {
  files: any[] = [];
  errorMessages: Array<ErrorMessage> = [];
  locale = 'en';
  teamName = '';

  $refs!: {
    teamNameInput: HTMLInputElement;
  };

  focus() {
    this.$refs.teamNameInput.focus();
  }

  teamReportDataArray: Array<TeamReportData> = [];
  teamAverageReportData!: TeamReportData;

  showUploadDialog(event: MouseEvent) {
    event.preventDefault();
    this.errorMessages = [];
    this.cleanData();
    this.$bvModal.show('upload-team-survey-modal');
  }

  private cleanData() {
    this.teamName = '';
    this.teamReportDataArray = [];
    this.files = [];
  }

  state() {
    return this.teamName.length > 0;
  }
  invalidFeedback() {
    if (this.teamName.length == 0) {
      return 'teamResults.teamNameRequired';
    }
  }

  selectFile(event: MouseEvent) {
    document.getElementById('fileInput')?.click();
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  readyToCalc(): boolean {
    return this.files && this.files.length > 0 && this.teamName.length > 0;
  }

  calculateResults() {
    this.teamReportDataArray = [];
    const fileCount = this.files.length;
    this.files.forEach((file: any) => {
      this.loadSurveyFromFile(fileCount, file);
    });
  }

  loadSurveyFromFile(fileCount: number, file: any) {
    const reader = new FileReader();
    let surveyFile: SurveyFile;
    reader.onload = (e: ProgressEvent) => {
      const result = reader.result as string;
      if (result === 'undefined') {
        surveyFile = {
          fileName: file.name,
          hasError: true,
          errorMessage: 'validation.file.format',
          currentPage: 0,
        };
        this.errorMessages.push({
          message: 'validation.file.format',
          param: file.name,
        });
      } else {
        try {
          surveyFile = JSON.parse(result);
          surveyFile.hasError = false;
          surveyFile.fileName = file.name;
          this.teamReportDataArray.push({
            name: surveyFile.fileName.substr(0, surveyFile.fileName.length - 5),
            sections: this.extractReportData(surveyFile),
          });
        } catch (e) {
          surveyFile = {
            fileName: file.name,
            hasError: true,
            errorMessage: 'validation.file.format',
            currentPage: 0,
          };
          this.errorMessages.push({
            message: 'validation.file.format',
            param: file.name,
          });
        }
      }

      if (this.teamReportDataArray.length === fileCount) {
        // sort report data
        this.teamReportDataArray.sort((a, b) => (a.name < b.name ? -1 : a.name == b.name ? 0 : 1));
        this.averageTeamScore();
        const reportDataBundle: TeamReportDataBundle = {
          teamName: this.teamName,
          teamAverageReportData: this.teamAverageReportData,
          teamReportDataArray: this.teamReportDataArray,
        };
        this.$emit('loadTeamReportData', reportDataBundle);
        this.closeModal();
      }
    };
    reader.readAsText(file);
  }

  private averageTeamScore() {
    this.teamAverageReportData = {
      name: this.teamName,
      sections: [],
    } as TeamReportData;
    this.teamAverageReportData.name = this.teamName;
    // Extract score into a map
    // section_name: [{score, maxScore}, {score, maxScore}, {score, maxScore} ...]
    const scoresMap: Map<String, any[]> = new Map();
    if (this.teamReportDataArray.length > 0) {
      for (const reportData of this.teamReportDataArray) {
        for (const section of reportData.sections) {
          if (!scoresMap.has(section.name)) {
            scoresMap.set(section.name, []);
          }
          scoresMap.get(section.name)?.push({ score: section.score, maxScore: section.maxScore });
        }
      }
      scoresMap.forEach((scores, sn) => {
        const section = scores
          .filter(({ score, maxScore }) => score && score > 0)
          .reduce(
            (prev, cur) => ({
              score: prev.score + cur.score,
              maxScore: prev.maxScore + cur.maxScore,
            }),
            { score: 0, maxScore: 0 } as SectionReportData
          );
        section.name = sn;
        this.teamAverageReportData.sections.push(section);
      });
    }
  }

  private extractReportData(surveyFile: SurveyFile): Array<SectionReportData> {
    const sectionReportDataArray: Array<SectionReportData> = [];
    if (surveyFile.surveyJSON) {
      let survey: Model = new Model(surveyFile.surveyJSON);
      survey.data = surveyFile.data;
      survey.pages.forEach((page: any) => {
        const sectionReportData: SectionReportData = {
          name: page.name,
          score: 0,
          maxScore: calcSectionMaxScore(page.name, surveyFile.surveyJSON),
          questions: [],
          title: page.title,
        };
        page.questions.forEach((question: any) => {
          sectionReportData.questions.push({
            name: question.name,
            type: question.getType(),
            title: question.title,
            answer: question.value,
          });
          if (question.value !== undefined) {
            const score = calcScore(question.getType(), question.value);
            sectionReportData.score += score;
          }
        });
        sectionReportDataArray.push(sectionReportData);
      });
    }
    return sectionReportDataArray;
  }

  closeModal() {
    this.$bvModal.hide('upload-team-survey-modal');
  }

  hasError() {
    return this.errorMessages.length > 0;
  }

  @Watch('$i18n.locale')
  changeLanguage(value: string, oldValue: string) {
    this.locale = value;
  }

  onFileChanged($event: any) {
    if ($event === null || $event.target === null || $event.dataTransfer === null) {
      return;
    }

    const target = $event.target as HTMLInputElement;
    const files = target.files || $event.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    this.files = [...files];
  }
}
</script>

<style>
.upload-button {
  min-width: 270px !important;
}
.file-list-div {
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.team-name-div {
  display: flex;
}
</style>

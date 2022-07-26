<template>
  <div class="container">
    <message ref="message" />
    <div>
      <SurveySectionsContainer :sectionGroups="sectionGroups" :sections="sections" :survey="Survey" />
    </div>
    <div class="btn-div">
      <b-button class="btn btn-secondary reset" @click="reset">{{ $t('buttons.reset') }}</b-button>
      <download-survey @confirmToDownload="downloadSurvey" />
      <b-button class="btn btn-primary submitAnswers" @click="submitAnswers">{{ $t('buttons.submitButton') }}</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import AssessmentTool from '@/components/AssessmentTool.vue';
import DownloadSurvey from '@/components/DownloadSurvey.vue';
import Message, { MessageVariantType } from '@/components/Message.vue';
import SurveySectionsContainer from '@/components/SurveySectionsContainer.vue';
import { SectionGroup, SurveyResult, Team } from '@/interfaces/api-models';
import { Profile } from '@/interfaces/Profile';
import i18n from '@/plugins/i18n';
import apiService from '@/services/api.service';
import { ActionTypes } from '@/store/actions';
import showdown from 'showdown';
import { Model, PageModel, SurveyModel } from 'survey-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
    AssessmentTool,
    SurveySectionsContainer,
    DownloadSurvey,
    Message,
  },
})
export default class Survey extends Vue {
  Survey: Model = new Model({});
  sections: PageModel[] = [];
  sectionGroups: SectionGroup[] = [];

  $refs!: {
    message: Message;
  };

  private async loadQeustions(surveyJSON: any, surveyData: any) {
    this.Survey.clear(true, true);
    const pageCount = this.Survey.PageCount;
    for (let i = 0; i < pageCount; i++) {
      this.Survey.removePage(this.Survey.pages[0]);
    }
    this.Survey.fromJSON(surveyJSON);
    this.Survey.data = surveyData;
    this.sections = this.returnAllSections(this.Survey);
    this.sectionGroups = this.$store.state.sectionGroups;
    await this.$store.dispatch(ActionTypes.UseSurveyJSON, {
      surveyJSON,
      surveyModel: this.Survey,
    });
  }

  private returnAllSections(survey: SurveyModel): PageModel[] {
    let sections: PageModel[] = [];
    survey.pages.forEach((page: any) => {
      sections.push(page);
    });
    return sections;
  }

  @Watch('$i18n.locale')
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async beforeMount() {
    while (!this.$store.getters.isInitialized) {
      await this.delay(100);
    }
    let surveyJSON = this.$store.getters.returnSurveyJSON;
    await this.loadQeustions(surveyJSON, this.$store.getters.returnToolData);
    this.Survey.css = {
      navigationButton: 'btn survey-button',
    };

    this.Survey.onComplete.add((result: any) => {
      this.$store.dispatch(ActionTypes.UpdateSurveyData, result);
      this.$router.push('/results');
    });

    const converter = new showdown.Converter();

    this.Survey.onTextMarkdown.add((survey: any, options: any) => {
      //convert the markdown text to html
      var str = converter.makeHtml(options.text);
      //remove root paragraphs <p></p>
      str = str.substring(3);
      str = str.substring(0, str.length - 4);
      //set html
      options.html = str;
    });

    // Set locale
    this.Survey.locale = i18n.locale;
  }

  buildSurveyFile(): string {
    return JSON.stringify({
      name: 'surveyResults',
      version: this.$store.state.toolVersion,
      currentPage: this.$store.state.currentPageNo,
      data: this.$store.state.toolData,
      surveyJSON: this.$store.state.surveyJSON,
    });
  }

  downloadSurvey(fileName: string): void {
    const dataStr = 'data:text/json;charset=utf-8,' + this.buildSurveyFile();
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', fileName + '.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  showMessage(messageKey: string, variant: MessageVariantType = 'primary') {
    this.$refs.message.showMessage(messageKey, variant);
    const top = document.getElementById('def-top')?.offsetTop;
    window.scrollTo(0, top || 0);
  }

  async reset() {
    if (this.Survey) {
      this.Survey.clear(true, true);
    }
    await this.$store.dispatch(ActionTypes.SetAppData);
    await this.$store.dispatch(ActionTypes.Reset);
  }

  get collectEmail(): boolean {
    return process.env.VUE_APP_COLLECT_USER_EMAIL + '' === 'true';
  }

  get allowSubmitWithoutFinishingAll(): boolean {
    return process.env.VUE_APP_ALLOW_SUBMIT_RESULT_WITHOUT_FINISHING_ALL + '' === 'true';
  }

  private isProfileSet(profile: Profile) {
    return (
      !!profile &&
      !!profile.userId &&
      !!profile.team &&
      (this.collectEmail === false || (this.collectEmail && !!profile.userId))
    );
  }

  private allQuestionAnswered() {
    for (const section of this.sections) {
      for (const question of section.questions) {
        console.log(JSON.stringify(question));
        if (question.value === undefined) {
          return false;
        }
      }
    }
    return true;
  }

  async submitAnswers() {
    const profile: Profile = this.$store.getters.returnProfile;
    const isProfileSet = this.isProfileSet(profile);

    if (!isProfileSet) {
      await this.$store.dispatch(ActionTypes.ShowHideProfile, true);
      this.showMessage('teamResults.profileIsRequired', 'warning');
      return;
    }

    if (this.allowSubmitWithoutFinishingAll === false && this.allQuestionAnswered() === false) {
      this.showMessage('survey.pleaseFinishAllQuestions', 'warning');
      return;
    }

    const result: SurveyResult = {
      answers: this.$store.getters.returnToolData,
      team: profile.team as Team,
      userId: '' + (this.collectEmail ? profile.userId : profile.userId),
      jobTitle: profile.jobTitle,
      survey: this.$store.getters.returnSurveyJSON._id,
    };
    try {
      const newResult = await apiService.saveSurveyResult(result);
      this.showMessage('teamResults.submitSuccess', 'success');
    } catch (err) {
      this.showMessage('teamResults.submitFailed', 'danger');
    }
  }
}
</script>

<style scoped>
.btn-div {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 30px;
}
.btn-div /deep/ button {
  min-width: 250px !important;
}
</style>

<template>
  <div class="container">
    <div>
      <SurveySectionsContainer :sections="sections" :survey="Survey" :section-recommendation="sectionRecommendation" />
    </div>
    <div class="btn-div">
      <download-survey @confirmToDownload="downloadSurvey" />
      <upload-survey @surveyDataLoaded="onSurveyDataLoaded" />
    </div>
  </div>
</template>

<script lang="ts">
import AssessmentTool from '@/components/AssessmentTool.vue'; // @ is an alias to /src
import DownloadSurvey from '@/components/DownloadSurvey.vue';
import SurveySectionsContainer from '@/components/SurveySectionsContainer.vue';
import UploadSurvey from '@/components/UploadSurvey.vue';
import SurveyFile from '@/interfaces/SurveyFile';
import i18n from '@/plugins/i18n';
import { ActionTypes } from '@/store/actions';
import { SectionRecommendation } from '@/store/state';
import defaultSurveyJSON from '@/survey-enfr.json';
import resultsData from '@/survey-results.json';
import showdown from 'showdown';
import { Model, PageModel, SurveyModel } from 'survey-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
    AssessmentTool,
    SurveySectionsContainer,
    UploadSurvey,
    DownloadSurvey,
  },
})
export default class Survey extends Vue {
  Survey: Model = new Model({});
  sections: PageModel[] = this.returnAllSectionsByPrefix(this.Survey, 'section_');
  sectionRecommendation: SectionRecommendation[] = resultsData.sectionRecommendations;

  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);
    this.Survey.render();
  }

  private loadQeustions(surveyJSON: any, surveyData: any) {
    this.Survey.clear(true, true);
    const pageCount = this.Survey.PageCount;
    for (let i = 0; i < pageCount; i++) {
      this.Survey.removePage(this.Survey.pages[0]);
    }
    this.Survey.fromJSON(surveyJSON);
    this.Survey.data = surveyData;
    this.sections = this.returnAllSectionsByPrefix(this.Survey, 'section_');
    this.$store.dispatch(ActionTypes.UseSurveyJSON, {
      surveyJSON,
      surveyModel: this.Survey,
    });
  }

  private returnAllSectionsByPrefix(survey: SurveyModel, prefix: string): PageModel[] {
    let sections: PageModel[] = [];
    survey.pages.forEach((page: any) => {
      if (page.name.includes(prefix)) {
        sections.push(page);
      }
    });
    return sections;
  }

  @Watch('$i18n.locale')
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
  }

  created() {
    let surveyJSON = this.$store.getters.returnSurveyJSON;
    if (!surveyJSON) {
      surveyJSON = defaultSurveyJSON;
    }
    this.loadQeustions(surveyJSON, this.$store.getters.returnToolData);
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

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData,
      } as SurveyFile);
    }
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

  onSurveyDataLoaded($event: SurveyFile) {
    this.loadQeustions($event.surveyJSON, $event.data);
    this.fileLoaded($event);
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
</style>

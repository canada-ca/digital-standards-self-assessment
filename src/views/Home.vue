<template>
  <div class="home">
    <LoadLocalSurvey @surveyDataLoaded="onSurveyDataLoaded" />
    <b-button @click="displayWelcomeMessage()">{{
      $t("notice.displayWelcome")
    }}</b-button>
    <b-button
      type="button"
      class="btn btn-primary ml-auto"
      style="width: inherit"
      v-on:click="downloadSurvey()"
    >
      {{ $t("loadLocalSurvey.downloadSurvey") }}
    </b-button>
    <b-button
      type="button"
      class="btn btn-primary"
      style="width: inherit"
      v-on:click="showLoadLocalSurveyDialog()"
    >
      {{ $t("loadLocalSurvey.loadSurvey") }}
    </b-button>
    <div>
      <HomeSectionsContainer
        :sections="sections"
        :survey="Survey"
        :section-recommendation="sectionRecommendation"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Model, Page, PageModel } from "survey-vue";
import showdown from "showdown";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import HomeSectionsContainer from "@/components/HomeSectionsContainer.vue";
import BaseNavigation from "@/components/BaseNavigation.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import i18n from "@/plugins/i18n";
import defaultSurveyJSON from "@/survey-enfr.json";
import { SectionRecommendation } from "@/store/state";
import resultsData from "@/survey-results.json";
import { returnAllSectionsByPrefix } from "@/store";
import { ActionTypes } from "@/store/actions";
import LoadLocalSurvey from "@/components/LoadLocalSurvey.vue";

@Component({
  components: {
    AssessmentTool,
    BaseNavigation,
    HomeSectionsContainer,
    LoadLocalSurvey
  },
  methods: {
    displayWelcomeMessage() {
      this.$bvModal.show("welcome-modal");
    }
  }
})
export default class Home extends Vue {
  Survey: Model = new Model({});
  sections: PageModel[] = returnAllSectionsByPrefix(this.Survey, "section_");
  sectionRecommendation: SectionRecommendation[] =
    resultsData.sectionRecommendations;

  // Feature disabled, will be removed from store actions
  // startAgain() {
  //   this.Survey.clear(true, true);
  //   window.localStorage.clear();
  //   this.$store.commit("resetSurvey");
  // }

  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);
    this.Survey.render();
  }

  private loadQeustions(surveyJSON: any) {
    this.Survey.clear(true, true);
    const pageCount = this.Survey.PageCount;
    for (let i = 0; i < pageCount; i++) {
      this.Survey.removePage(this.Survey.pages[0]);
    }
    this.Survey.fromJSON(surveyJSON);
    this.sections = returnAllSectionsByPrefix(this.Survey, "section_");
    this.$store.dispatch(ActionTypes.UseSurveyJSON, {
      surveyJSON,
      surveyModel: this.Survey
    });
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
  }

  created() {
    let surveyJSON = this.$store.getters.returnSurveyJSON;
    if (!surveyJSON) {
      surveyJSON = defaultSurveyJSON;
    }
    this.loadQeustions(surveyJSON);
    this.Survey.css = {
      navigationButton: "btn survey-button"
    };

    this.Survey.onComplete.add(result => {
      this.$store.dispatch(ActionTypes.UpdateSurveyData, result);
      this.$router.push("/results");
    });

    // this.Survey.onValueChanged.add(result => {
    //   this.$store.dispatch(ActionTypes.UpdateSurveyData, result);
    // });

    const converter = new showdown.Converter();

    this.Survey.onTextMarkdown.add(function(survey, options) {
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

    // accessibility fix... aria-labelledby being needlessly generated for html question
    // TODO: make this dynamic by looping over questions and doing this for all html questions
    this.Survey.onAfterRenderQuestion.add(function(sender, options) {
      let welcomePage = document.getElementsByName("welcome1");
      if (welcomePage && welcomePage.length > 0) {
        let welcomePageElement = welcomePage[0];
        welcomePageElement.removeAttribute("aria-labelledby");
      }
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData
      } as SurveyFile);
    }
  }

  buildSurveyFile(): string {
    return JSON.stringify({
      name: "surveyResults",
      version: this.$store.state.toolVersion,
      currentPage: this.$store.state.currentPageNo,
      data: this.$store.state.toolData,
      surveyJSON: this.$store.state.surveyJSON
    });
  }

  downloadSurvey(): void {
    const dataStr = "data:text/json;charset=utf-8," + this.buildSurveyFile();
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "result.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  showLoadLocalSurveyDialog() {
    this.$bvModal.show("load-loacal-survey-modal");
  }

  onSurveyDataLoaded($event: SurveyFile) {
    this.loadQeustions($event.surveyJSON);
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
  }
}
</script>

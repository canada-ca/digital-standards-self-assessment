<template>
  <div class="results">
    <AssessmentTool :survey="Survey" />
    <div class="page-actions">
      <div class="row" style="padding: 0 5px">
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn btn-default"
            style="width: inherit"
            v-on:click="goToHomePage()"
          >
            &#8672;&nbsp;{{ $t("navigation.goBack") }}
          </button>
        </div>
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn btn-primary"
            style="width: inherit"
            v-on:click="goToSectionResults()"
          >
            {{ $t("navigation.viewSectionResults") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Model } from "survey-vue";
import AssessmentTool from "@/components/AssessmentTool.vue"; // @ is an alias to /src
import BaseNavigation from "@/components/BaseNavigation.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import surveyJSON from "@/survey-enfr.json";
import { ActionTypes } from "@/store/actions";

@Component({
  components: {
    AssessmentTool,
    BaseNavigation
  }
})
export default class Questions extends Vue {
  @Prop() public currentPageNo!: number;
  Survey: Model = new Model(surveyJSON);
  //
  // startAgain() {
  //   this.Survey.clear(true, true);
  //   window.localStorage.clear();
  //   this.$store.commit("resetSurvey");
  //   this.$router.push("/");
  // }

  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);
    this.$router.push("/");
  }

  goToHomePage() {
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);
    this.$router.push("/");
  }

  buildSurveyFile(): string {
    return JSON.stringify({
      name: "surveyResults",
      version: this.$store.state.toolVersion,
      currentPage: this.$store.state.currentPageNo,
      data: this.$store.state.toolData
    });
  }
  async saveSurveyData(): Promise<boolean> {
    var responseStatus: boolean = false;
    const saveFile = this.buildSurveyFile();

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/text"
      },
      mode: "no-cors" as RequestMode,
      name: "surveyData",
      body: saveFile
    };
    await fetch(
      "https://doraselfassessment.azurewebsites.net/api/saveselfassessment",
      requestOptions
    ).then(function(response) {
      if (response.status === 200) {
        responseStatus = true;
      }
    });
    return responseStatus;
  }

  goToSectionResults() {
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);
    this.saveSurveyData();
    this.$router.push("/sections");
  }
  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
  }
  created() {
    this.Survey.onComplete.add(result => {
      this.$store.dispatch(ActionTypes.UpdateSurveyData, result);
      this.$router.push("/results");
    });

    this.Survey.currentPageNo = this.$store.getters.returnCurrentPageNumber;
    this.Survey.data = this.$store.getters.resultsDataSections;
    this.Survey.locale = this.$i18n.locale;
  }
}
</script>

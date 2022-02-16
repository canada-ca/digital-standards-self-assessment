<template>
  <div class="container">
    <div class="results">
      <h1>
        {{ $t('survey.sectionResultsTitle') }}
      </h1>
      <div>
        <ResultsCard
          v-if="currentSection !== undefined"
          :section="currentSection"
          :section-name="currentSection.sectionName"
          :user-score="currentSection.userScore"
          :max-score="getMaxScore(currentSection)"
          :my-recommendations="myRecommendations"
          :locale="locale"
        />
        <div v-else>
          <p>
            {{ $t('notice.noProgress') }}
          </p>
        </div>
      </div>
      <p />
      <div class="page-actions container">
        <div class="row" style="padding: 0 15px">
          <div class="col-3 col-sm-2 col-md-3">
            <button type="button" class="btn btn-primary" style="width: inherit" v-on:click="goToQuestions()">
              &#8672;&nbsp;{{ $t('navigation.goBack') }}
            </button>
          </div>
          <div class="col-3 col-sm-2 col-md-3">
            <button type="button" class="btn btn-default" style="width: inherit" v-on:click="goToHomePage()" :key="$route.path">
              {{ $t('navigation.chooseAnotherSection') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Model } from 'survey-vue';
import showdown from 'showdown';
import SurveyFile from '@/interfaces/SurveyFile';
import ResultsCard from '@/components/ResultsCard.vue';
import i18n from '@/plugins/i18n';
import surveyJSON from '@/survey-enfr.json';
import { Section } from '@/types';
import { ActionTypes } from '@/store/actions';

@Component({
  components: {
    ResultsCard,
  },
  computed: {
    // TODO: This computed property is never used
    sectionNames() {
      return this.$store.getters.returnSectionsNamesGenerated;
    },
    results() {
      return this.$store.getters.resultsDataSections;
    },
    sections() {
      return this.$store.getters.returnAllSections;
    },
    currentSection() {
      return this.$store.getters.returnCurrentSection;
    },
    myRecommendations() {
      return this.$store.state.recommendations;
    },
    locale() {
      return this.$i18n.locale;
    },
  },
  methods: {
    getMaxScore(section: Section) {
      return this.$store.getters.returnSectionMaxScore(section.sectionName);
    },
  },
})
export default class Results extends Vue {
  @Prop() data: any;
  @Prop() public section!: Section;
  myResults = this.$store.getters.resultsDataSections;

  Survey: Model = new Model(surveyJSON);
  goToHomePage() {
    this.$router.push('/survey');
  }
  goToAllResults() {
    this.$router.push('/Results');
  }
  goToQuestions() {
    this.$router.push('/Questions');
  }
  buildSurveyFile(): string {
    return JSON.stringify({
      name: 'surveyResults',
      version: this.$store.state.toolVersion,
      currentPage: this.$store.state.currentPageNo,
      data: this.$store.state.toolData,
    });
  }
  downloadSurveyAnswer(): void {
    const dataStr = 'data:text/json;charset=utf-8,' + this.buildSurveyFile();
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'result.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  // async saveSurveyData(): Promise<boolean> {
  //   var responseStatus: boolean = false;
  //   const saveFile = this.buildSurveyFile();

  //   var requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/text"
  //     },
  //     mode: "no-cors" as RequestMode,
  //     name: "surveyData",
  //     body: saveFile
  //   };
  //   await fetch(
  //     "https://doraselfassessment.azurewebsites.net/api/saveselfassessment",
  //     requestOptions
  //   ).then(function(response) {
  //     if (response.status === 200) {
  //       responseStatus = true;
  //     }
  //   });
  //   return responseStatus;
  // }

  /**
   * Export survey result.
   */
  exportResults() {
    const source = window.document.getElementById(this.$i18n.locale + '-content') as HTMLElement;

    let pageActions = window.document.getElementsByClassName('page-actions');

    function beforePrint() {
      for (let i in pageActions) {
        if (pageActions[parseInt(i)].classList) {
          pageActions[parseInt(i)].classList.add('hidden');
        }
      }
    }

    function afterPrint() {
      for (let i in pageActions) {
        if (pageActions[parseInt(i)].classList) {
          pageActions[parseInt(i)].classList.remove('hidden');
        }
      }
    }

    window.addEventListener('beforeprint', beforePrint, false);
    window.addEventListener('afterprint', afterPrint, false);

    window.print();

    window.removeEventListener('beforeprint', beforePrint);
    window.removeEventListener('afterprint', afterPrint);
  }
  // Feature disabled, will be removed from store actions
  // startAgain() {
  //   this.Survey.clear(true, true);
  //   window.localStorage.clear();
  //   this.$store.commit("resetSurvey");
  //   this.$router.push({ path: "/" });
  // }
  fileLoaded($event: SurveyFile) {
    this.Survey.data = $event.data;
    this.Survey.currentPageNo = $event.currentPage;
    this.Survey.start();
    // this.$store.commit("calculateResult", this.Survey);
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);

    this.myResults = this.$store.getters.resultDataSections;
  }

  @Watch('$i18n.locale')
  changeLanguage(value: string, oldValue: string) {
    this.Survey.locale = value;
    this.Survey.render();
  }

  created() {
    this.Survey.onComplete.add((result: any) => {
      // this.$store.commit("updateSurveyData", result);
      this.$store.dispatch(ActionTypes.UpdateSurveyData, result);
    });

    this.Survey.onValueChanged.add((result: any) => {
      // this.$store.commit("calculateResult", result);
      this.$store.dispatch(ActionTypes.UpdateSurveyData, result);
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

    // accessibility fix... aria-labelledby being needlessly generated for html question
    // TODO: make this dynamic by looping over questions and doing this for all html questions
    this.Survey.onAfterRenderQuestion.add((sender: any, options: any) => {
      let welcomePage = document.getElementsByName('welcome1');
      if (welcomePage && welcomePage.length > 0) {
        let welcomePageElement = welcomePage[0];
        welcomePageElement.removeAttribute('aria-labelledby');
      }
    });

    //if survey is in progress reload from store
    if (this.$store.getters.inProgress) {
      this.fileLoaded({
        currentPage: this.$store.state.currentPageNo,
        data: this.$store.state.toolData,
      } as SurveyFile);
    }
  }
}
</script>

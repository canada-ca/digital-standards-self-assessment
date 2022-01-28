<template>
  <div class="results">
    <AssessmentTool :survey="Survey" />
    <div class="page-actions container">
      <div class="row" style="padding: 0 5px">
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn btn-default"
            style="width: inherit"
            v-on:click="goToSurvey()"
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
import { ActionTypes } from "@/store/actions";
@Component({
  components: {
    AssessmentTool
  }
})
export default class Questions extends Vue {
  @Prop() public currentPageNo!: number;
  Survey: Model = new Model(this.$store.getters.returnSurveyJSON);

  goToSurvey() {
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);
    this.$router.push("/survey");
  }
  goToSectionResults() {
    this.$store.dispatch(ActionTypes.UpdateSurveyData, this.Survey);
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

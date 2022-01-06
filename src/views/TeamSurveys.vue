<template>
  <div class="container">
    <h1>
      {{ $t("teamResults.title") }}
    </h1>
    <p>{{ $t("teamResults.description") }}</p>
    <p>
      <upload-team-surveys />
    </p>
    <div class="row">
      <div class="col overview-image">
        <b-img class="overview-image" fluid-grow :src="img" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import UploadTeamSurveys from "@/components/team/UploadTeamSurveys.vue";
const teamSurveyOverviewImg = require("@/assets/teamSurveyOverview.png");

@Component({
  components: {
    UploadTeamSurveys
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    }
  }
})
export default class Results extends Vue {
  img = teamSurveyOverviewImg;

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    //    this.Survey.locale = value;
    //    this.Survey.render();
  }

  created() {}
}
</script>

<style scoped>
.overview-image {
  padding: 40px 150px;
}
</style>

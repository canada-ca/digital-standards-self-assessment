<template>
  <div class="results">
    <h1>
      {{ $t("teamResults.title") }}
    </h1>
    <div>
      <load-team-results />
    </div>
    <div class="page-actions">
      <div class="row" style="padding: 0 15px">
        <div class="col-3 col-sm-2 col-md-3">
          <button
            type="button"
            class="btn btn-default"
            style="width: inherit"
            v-on:click="goToHomePage()"
            :key="$route.path"
          >
            {{ $t("navigation.goHome") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import LoadTeamResults from "@/components/LoadTeamResults.vue";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    LoadTeamResults
  },
  computed: {
    locale() {
      return this.$i18n.locale;
    }
  }
})
export default class Results extends Vue {
  goToHomePage() {
    this.$router.push("/");
  }
  goToQuestions() {
    this.$router.push("/Questions");
  }
  /**
   * Export survey result.
   */
  exportResults() {
    const source = window.document.getElementById(
      this.$i18n.locale + "-content"
    ) as HTMLElement;

    let pageActions = window.document.getElementsByClassName("page-actions");

    function beforePrint() {
      for (let i in pageActions) {
        if (pageActions[parseInt(i)].classList) {
          pageActions[parseInt(i)].classList.add("hidden");
        }
      }
    }

    function afterPrint() {
      for (let i in pageActions) {
        if (pageActions[parseInt(i)].classList) {
          pageActions[parseInt(i)].classList.remove("hidden");
        }
      }
    }

    window.addEventListener("beforeprint", beforePrint, false);
    window.addEventListener("afterprint", afterPrint, false);

    window.print();

    window.removeEventListener("beforeprint", beforePrint);
    window.removeEventListener("afterprint", afterPrint);
  }

  @Watch("$i18n.locale")
  changeLanguage(value: string, oldValue: string) {
    //    this.Survey.locale = value;
    //    this.Survey.render();
  }

  created() {}
}
</script>

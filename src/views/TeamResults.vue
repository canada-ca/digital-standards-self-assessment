<template>
  <div class="results">
    <h1>
      {{ $t("teamResults.title") }}
    </h1>
    <div>
      <load-team-results />
    </div>
  </div>
</template>

<script lang="ts">
import LoadTeamResults from "../components/team/LoadTeamResults.vue";
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

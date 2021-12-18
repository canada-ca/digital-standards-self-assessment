<template>
  <div class="mb-3 mt-5">
    <h3>{{ $t("notice.welcomeNoticeTitle") }}</h3>
    <div v-html="markdownToHtml($t('notice.welcomeNoticeBody'))"></div>
    <transition name="collapsed" mode="out-in">
      <div v-if="!collapsed">
        <h5>
          {{ $t("notice.subtitle1") }}
        </h5>
        <div class="mt-4" style="display: flex;">
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                Measure Personal growth and success
              </p>
              <p>
                You can compare previous test results to current test results to
                see your personal growth over time.
              </p>
            </span>
          </div>
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">Measure Teams growth and success</p>
              <p>
                You can calulate teams results and can evaluate the teams
                overall growth and success or compare to your teams previous
                test results.
              </p>
            </span>
          </div>
        </div>
        <h5>
          {{ $t("notice.subtitle2") }}
        </h5>
        <div>
          You are not required to answer each section in a single visit, but we
          encourage teams to complete them all at least once to establish a full
          baseline.
        </div>
        <div class="mt-4" style="display: flex;">
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                4-6 minutes per section
              </p>
            </span>
          </div>
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                Aprox. 60 minutes to complete all 11 sections
              </p>
            </span>
          </div>
        </div>
      </div>
    </transition>
    <div class="text-right">
      <show-hide-link :hide="true" @onToggled="toggleCollapsed()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ShowHideLink from "./ShowHideLink.vue";
@Component({
  components: { ShowHideLink }
})
export default class Welcome extends Vue {
  collapsed = true;

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  markdownToHtml(item: string) {
    const marked = require("marked");
    return marked(item);
    // return marked(messages.en.displayNoticeStatus)
  }
}
</script>

<style scoped>
.collapsed-enter-active,
.collapsed-leave-active {
  transition: all 0.5s;
  max-height: 500px;
}
.collapsed-enter,
.collapsed-leave-to {
  opacity: 0;
  max-height: 0px;
}

.welcome-col {
  display: flex;
  flex-basis: 50%;
  padding-left: 30px;
  padding-right: 30px;
}
</style>

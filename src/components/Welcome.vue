<template>
  <div class="mb-3 mt-5">
    <section class="container">
      <h3>{{ $t("notice.welcomeNoticeTitle") }}</h3>
      <div v-html="markdownToHtml($t('notice.welcomeNoticeBody'))"></div>
    </section>
    <section style="background: #E0EDFF;">
      <div class="container">
        <h5>
          {{ $t("notice.subtitle1") }}
        </h5>
        <div class="mt-4" style="display: flex;">
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                {{ $t("notice.section1p1") }}
              </p>
              <p>
                {{ $t("notice.section1p2") }}
              </p>
            </span>
          </div>
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                {{ $t("notice.section1p3") }}
              </p>
              <p>
                {{ $t("notice.section1p4") }}
              </p>
            </span>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <h5>
          {{ $t("notice.subtitle2") }}
        </h5>
        <div>
          {{ $t("notice.section2p1") }}
        </div>
        <div class="mt-4" style="display: flex;">
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                {{ $t("notice.section2p2") }}
              </p>
            </span>
          </div>
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                {{ $t("notice.section2p3") }}
              </p>
            </span>
          </div>
        </div>
      </div>
    </section>
    <section style="background: #E0EDFF;">
      <div class="container">
        <h5>
          {{ $t("notice.subtitle3") }}
        </h5>
        <div class="mt-4" style="display: flex;">
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                {{ $t("notice.section3p1") }}
              </p>
              <p>
                {{ $t("notice.section3p2") }}
              </p>
            </span>
          </div>
          <div class="welcome-col">
            <i class="fas fa-circle mt-3 mr-3"></i>
            <span>
              <p style="font-size: 1.4em">
                {{ $t("notice.section3p3") }}
              </p>
              <p>
                {{ $t("notice.section3p4") }}
              </p>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { marked } from "marked";
import { Component, Vue } from "vue-property-decorator";
import ShowHideLink from "./ShowHideLink.vue";
@Component({
  components: { ShowHideLink }
})
export default class Welcome extends Vue {
  markdownToHtml(item: string) {
    return marked(item);
  }
}
</script>

<style scoped>
.welcome-col {
  display: flex;
  flex-basis: 50%;
  padding-left: 30px;
  padding-right: 30px;
}
</style>

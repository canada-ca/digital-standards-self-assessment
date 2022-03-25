<template>
  <div class="mb-3">
    <section style="background: #e0edff">
      <div class="container">
        <h1>{{ $t('notice.startUsingTitle') }}</h1>
        <div v-html="markdownToHtml($t('notice.startUsingDesc'))" />
        <div class="col-container">
          <div class="welcome-col left-col">
            <b-img :src="require('@/assets/images/items.png')" style="height: 35px; margin: 8px 20px 0px 0px" alt="" />
            <span>
              <p style="font-size: 1.4em">
                {{ $t('notice.takeTheSurvey') }}
              </p>
              <p v-html="markdownToHtml($t('notice.takeTheSurveyDesc'))"></p>
            </span>
          </div>
          <div class="welcome-col right-col">
            <b-img :src="require('@/assets/images/bars.png')" style="height: 42px; margin: 8px 20px 0px 0px" alt="" />
            <span>
              <p style="font-size: 1.4em">
                {{ $t('notice.calculateTeamResults') }}
              </p>
              <p v-html="markdownToHtml($t('notice.calculateTeamResultsDesc'))" />
            </span>
          </div>
        </div>
      </div>
    </section>
    <section class="container">
      <h2 style="margin-top: 30px" id="welcomeNoticeTitle">{{ $t('notice.welcomeNoticeTitle') }}</h2>
      <div style="margin: 30px 0px" v-html="markdownToHtml($t('notice.welcomeNoticeBody'))"></div>
    </section>
    <section style="background: #e0edff">
      <div class="container">
        <h2 style="margin-top: 30px">
          {{ $t('notice.subtitle1') }}
        </h2>
        <div class="col-container">
          <div class="welcome-col left-col">
            <b-img :src="require('@/assets/images/steps.png')" style="height: 60px; margin: 8px 20px 0px 0px" alt="" />
            <span>
              <p style="font-size: 1.4em">
                {{ $t('notice.section1p1') }}
              </p>
              <p v-html="markdownToHtml($t('notice.section1p2'))"></p>
            </span>
          </div>
          <div class="welcome-col right-col">
            <b-img :src="require('@/assets/images/step.png')" style="height: 50px; margin: 8px 20px 0px 0px" alt="" />
            <span>
              <p style="font-size: 1.4em">
                {{ $t('notice.section1p3') }}
              </p>
              <p v-html="markdownToHtml($t('notice.section1p4'))" />
            </span>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <h2 style="margin-top: 30px">
          {{ $t('notice.subtitle2') }}
        </h2>
        <div v-html="markdownToHtml($t('notice.section2p1'))" />
        <div class="col-container">
          <div class="welcome-col left-col">
            <b-img :src="require('@/assets/images/time2.png')" style="height: 60px; margin: 8px 20px 0px 0px" alt="" />
            <span>
              <p style="font-size: 1.4em">
                {{ $t('notice.section2p2') }}
              </p>
            </span>
          </div>
          <div class="welcome-col right-col">
            <b-img :src="require('@/assets/images/time1.png')" style="height: 60px; margin: 8px 20px 0px 0px" alt="" />
            <span>
              <p style="font-size: 1.4em">
                {{ $t('notice.section2p3') }}
              </p>
            </span>
          </div>
        </div>
      </div>
    </section>
    <section style="background: #e0edff">
      <div class="container">
        <h2 style="margin-top: 30px">
          {{ $t('notice.subtitle3') }}
        </h2>
        <div class="col-container">
          <div class="welcome-col" style="flex-basis: 100%">
            <b-img :src="require('@/assets/images/brush.png')" style="height: 45px; margin: 8px 20px 0px 0px" alt="" />
            <span>
              <p style="font-size: 1.4em">
                {{ $t('notice.section3p1') }}
              </p>
              <p v-html="markdownToHtml($t('notice.section3p2'))"></p>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { marked } from 'marked';
import { Component, Vue } from 'vue-property-decorator';
import ShowHideLink from './ShowHideLink.vue';
@Component({
  components: { ShowHideLink },
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
}
.col-container {
  display: flex;
  margin: 30px 0px;
}
.left-col {
  padding-right: 30px;
}
.right-col {
  padding-left: 30px;
}
h2 {
  font-size: 36px !important;
  font-weight: 300 !important;
}
</style>

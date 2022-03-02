<template>
  <div class="header">
    <div class="container">
      <div class="app-name-sec">
        <router-link
          class="app-name"
          style="color: #fff !important; font-size: 36px !important"
          to="/"
          >{{ $t("navigation.appName") }}</router-link
        >
        <div class="menu-sec">
          <router-link
            class="menu-link"
            style="color: #fff !important; font-size: 30px !important"
            to="/survey"
            >{{ $t("navigation.survey") }}</router-link
          >
          <router-link
            class="menu-link"
            style="color: #fff !important; font-size: 30px !important"
            to="/teamSurveys"
            >{{ $t("navigation.teamsSurvey") }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NavBar extends Vue {}
</script>

<style scoped>
.header {
  background: #38414d;
  margin-top: 5px;
  padding: 0 10px;
}

.header .app-name,
.header .menu-link {
  margin-bottom: 6px;
  margin-top: 8px;
  padding: 5px;
  line-height: 1.1;
}
/*App bar - app name link*/
.header a {
  display: inline-block;
  font-weight: 400;
  text-decoration: none !important;
}

.header a:hover {
  text-decoration: underline !important;
}

.menu-link {
  color: #fff !important;
}
.app-name-sec {
  display: flex !important;
  justify-content: space-between !important;
}
.menu-sec {
  min-width: 380px;
  display: flex !important;
  justify-content: space-between;
}

.menu-sec a {
  margin-top: 10px !important;
}
</style>

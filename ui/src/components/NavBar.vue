<template>
  <div class="header">
    <div class="container">
      <div class="app-name-sec">
        <router-link class="app-name" style="color: #fff !important; font-size: 36px !important" to="/">{{
          appName
        }}</router-link>
        <div class="menu-sec">
          <router-link class="menu-link" to="/survey">{{ $t('navigation.survey') }}</router-link>
          <router-link v-if="showTeamResult" class="menu-link" to="/teamSurveys">{{
            $t('navigation.teamsSurvey')
          }}</router-link>
          <b-link class="menu-link" @click.prevent="toggleProfile()">
            <i class="fa fa-user" v-b-tooltip.hover="{ customClass: 'tooltip-class' }" :title="profileTitle" />
            <sup v-if="isProfileSet">
              <span class="badge badge-warning"><i class="fa fa-check fa-xs" /></span>
            </sup>
          </b-link>
        </div>
      </div>
    </div>
    <b-collapse v-model="showProfile">
      <div class="profile-card">
        <label v-if="collectEmail">{{ $t('navigation.yourEmail') }}</label>
        <b-form-input
          v-if="collectEmail"
          type="email"
          @change="setEmail"
          :class="{ 'is-invalid': hasError }"
          :value="email"
        />
        <div class="text-danger mt-3 email-error" v-if="collectEmail && hasError">
          {{ $t('validation.email.invalid') }}
        </div>
        <label>{{ $t('navigation.yourTeam') }}</label>
        <auto-complete :items="teams" @valueChanged="setTeam" :value="team" />
        <label v-if="collectJobTitle">{{ $t('navigation.itLevel') }}</label>
        <b-form-select
          class="form-control"
          v-if="collectJobTitle"
          @change="setItLevel"
          :value="itLevel"
          :options="allItLevels"
        >
        </b-form-select>

        <label v-if="collectJobTitle">{{ $t('navigation.jobTitle') }}</label>
        <b-form-select
          class="form-control"
          v-if="collectJobTitle"
          :options="jobTitleOptions"
          @change="setJobTitle"
          :value="jobTitle"
        >
        </b-form-select>
        <label v-if="collectJobTitle">{{ $t('navigation.timeInThePosition') }}</label>
        <b-form-select
          class="form-control"
          v-if="collectJobTitle"
          @change="setTimeInThePosition"
          :value="timeInThePosition"
        >
          <option value="$t('navigation.lessThanAYear')">{{ $t('navigation.lessThanAYear') }}</option>
          <option value="$t('navigation.oneYearOrMore')">{{ $t('navigation.oneYearOrMore') }}</option>
        </b-form-select>
      </div>
    </b-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AutoComplete from '@/components/AutoComplete.vue';
import { Profile } from '@/interfaces/Profile';
import { ActionTypes } from '@/store/actions';
import { validateEmail } from '@/utils/utils';
import i18n from '@/plugins/i18n';
import apiService from '@/services/api.service';
import { JobTitle, Team } from '@/interfaces/api-models';
import { ItLevels } from '@/interfaces/ITLevels';
import { getCookie, setCookie } from 'typescript-cookie';

@Component({
  components: {
    AutoComplete,
  },
})
export default class NavBar extends Vue {
  profile?: Profile;
  showProfile = false;
  isProfileSet = false;
  hasError = false;
  teams: Team[] = [];
  itLevel? = '';
  allItLevels = ItLevels.map((v) => ({ value: v, text: v }));
  jobTitles: JobTitle[] = [];
  jobTitleOptions: Array<{ value: string; text: string }> = [];

  async created() {
    this.profile = this.$store.getters.returnProfile;
    this.showProfile = this.$store.getters.showProfile;
    this.watchProfile();
    if (this.email) {
      this.hasError = !validateEmail(this.email);
    }
    this.teams = await apiService.findAllTeams();
    this.jobTitles = await apiService.findAllJobTitles();
    this.itLevel = this.profile?.jobTitle?.itLevel;
    this.getJobTitleOptions();
  }

  get collectEmail(): boolean {
    return process.env.VUE_APP_COLLECT_USER_EMAIL + '' === 'true';
  }

  get collectJobTitle(): boolean {
    return process.env.VUE_APP_COLLECT_JOB_TITLE + '' === 'true';
  }

  get showTeamResult(): boolean {
    return process.env.VUE_APP_WELCOME_SHOW_TEAM_RESULT + '' === 'true';
  }

  get appName(): string {
    return this.$i18n.locale === 'fr'
      ? process.env.VUE_APP_APP_TITLE_FR || 'Évaluation des normes relatives au numérique'
      : process.env.VUE_APP_APP_TITLE_EN || 'Digital Standards Self-Assessment';
  }

  @Watch('$i18n.locale')
  getJobTitleOptions() {
    this.jobTitleOptions = this.jobTitles
      .filter((v) => v.itLevel === this.itLevel)
      .map((v) => ({ value: v.gcitCode, text: this.$i18n.locale === 'en' ? v.shortTitleEn : v.shortTitleFr }));
    const result = this.jobTitleOptions.find((v) => v.value === this.profile?.jobTitle?.gcitCode);
    this.profile?.jobTitle == result;
  }

  @Watch('$store.getters.returnShowProfile')
  watchShowProfile() {
    this.showProfile = this.$store.getters.returnShowProfile;
    if (this.showProfile) {
    }
  }

  @Watch('$store.getters.returnProfile')
  watchProfile() {
    this.profile = this.$store.getters.returnProfile;
    this.isProfileSet =
      !!this.profile &&
      !!this.profile.userId &&
      !!this.profile.team &&
      (this.collectJobTitle === false ||
        (this.collectJobTitle && !!this.profile.jobTitle && !!this.profile?.timeInPosition));
  }

  toggleProfile() {
    this.$store.dispatch(ActionTypes.ShowHideProfile, !this.showProfile);
  }

  get profileTitle() {
    if (this.isProfileSet) {
      return '';
    } else {
      return i18n.t('navigation.profile.notSet');
    }
  }

  get team() {
    return this.profile?.team;
  }

  get email() {
    return this.profile?.userId;
  }

  get jobTitle() {
    return this.profile?.jobTitle?.gcitCode;
  }

  get timeInThePosition() {
    return this.profile?.timeInPosition;
  }

  setTeam(team: Team) {
    this.setUserId();
    this.profile = { ...this.profile, team };
    this.$store.dispatch(ActionTypes.SaveProfile, this.profile);
  }
  setEmail(email: string) {
    this.hasError = false;
    if (!!email && !validateEmail(email)) {
      this.hasError = true;
      return;
    }
    this.setUserId();
    this.profile = { ...this.profile, userId: email };
    this.$store.dispatch(ActionTypes.SaveProfile, this.profile);
  }

  setItLevel(itLevel: string) {
    this.itLevel = itLevel;
    this.getJobTitleOptions();
    this.profile = { ...this.profile, jobTitle: undefined };
    this.$store.dispatch(ActionTypes.SaveProfile, this.profile);
  }

  setJobTitle(title: string) {
    const jobTitle = this.jobTitles.find((v) => v.gcitCode === title);
    this.profile = { ...this.profile, jobTitle };
    this.$store.dispatch(ActionTypes.SaveProfile, this.profile);
  }

  setTimeInThePosition(timeInPosition: string) {
    this.profile = { ...this.profile, timeInPosition };
    this.$store.dispatch(ActionTypes.SaveProfile, this.profile);
  }

  setUserId() {
    let userId = getCookie('userId');
    if (!userId) {
      userId = this.random();
      setCookie('userId', userId, { expires: 3650 });
    }
    if (!this.profile) {
      this.profile = { userId };
    } else {
      if (!this.profile.userId) {
        this.profile = { ...this.profile, userId };
      }
    }
  }

  random() {
    const length = 16;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let str = '';
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }
}
</script>

<style scoped>
.header {
  background: #38414d;
  margin-top: 5px;
}

.header .app-name,
.header .menu-link {
  margin-bottom: 6px;
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
  font-size: 30px !important;
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
  margin-top: 20px;
}

.profile-card {
  display: inline-flex;
  justify-content: center;
  gap: 10px 25px;
  background-color: #ffffff;
  width: 100%;
  padding: 6px 10px;
}

.profile-card > * {
  flex-basis: content;
}

.input-with-error {
  display: grid;
}

.email-error {
  grid-row: 2;
  grid-column: 3;
}

.tooltip-class {
  font-size: 16px;
}
</style>

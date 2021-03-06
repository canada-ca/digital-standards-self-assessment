<template>
  <div class="header">
    <div class="container">
      <div class="app-name-sec">
        <router-link class="app-name" style="color: #fff !important; font-size: 36px !important" to="/">{{
          $t('navigation.appName')
        }}</router-link>
        <div class="menu-sec">
          <router-link class="menu-link" to="/survey">{{ $t('navigation.survey') }}</router-link>
          <router-link class="menu-link" to="/teamSurveys">{{ $t('navigation.teamsSurvey') }}</router-link>
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
        <span />
        <label v-if="collectEmail">{{ $t('navigation.yourEmail') }}</label>
        <b-form-input
          v-if="collectEmail"
          type="email"
          @change="setEmail"
          :class="{ 'is-invalid': hasError }"
          :value="email"
        />
        <div class="text-danger mt-3 email-error" v-if="hasError">
          {{ $t('validation.email.invalid') }}
        </div>
        <label>{{ $t('navigation.yourTeam') }}</label>
        <auto-complete :items="teams" @valueChanged="setTeam" :value="team" />
        <span />
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
import { Team } from '@/interfaces/api-models';
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

  async created() {
    this.profile = this.$store.getters.returnProfile;
    this.showProfile = this.$store.getters.showProfile;
    this.watchProfile();
    if (this.email) {
      this.hasError = !validateEmail(this.email);
    }
    this.teams = await apiService.findAllTeams();
  }

  get collectEmail(): boolean {
    return process.env.VUE_APP_COLLECT_USER_EMAIL + '' === 'true';
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
      (this.collectEmail === false || (this.collectEmail && !!this.profile.email));

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
    return this.profile?.email;
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
    this.profile = { ...this.profile, email };
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
  display: inline-grid;
  grid-template-columns: auto 120px 300px 120px 300px auto;
  grid-column-gap: 10px;
  background-color: #ffffff;
  width: 100%;
  padding: 6px 10px;
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

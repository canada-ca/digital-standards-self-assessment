<template>
  <section>
    <welcome v-if="welcomeVersion === '1'" />
    <welcome-2 v-if="welcomeVersion === '2'" />
  </section>
</template>

<script lang="ts">
import Welcome from '@/components/Welcome.vue';
import Welcome2 from '@/components/Welcome2.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Welcome,
    Welcome2,
  },
})
export default class Home extends Vue {
  get welcomeVersion() {
    return process.env.VUE_APP_WELCOME_VERSION;
  }
}
</script>

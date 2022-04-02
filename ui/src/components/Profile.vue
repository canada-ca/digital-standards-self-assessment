<template>
  <div class="header">
    <div class="container">
      <div class="profile-sec">
        <b-form-input id="email" type="email" placeholder="Input your email"></b-form-input>
        <auto-complete :items="teams" @inputChanged="setInput" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AutoComplete from '@/components/AutoComplete.vue';

@Component({
  components: { AutoComplete },
})
export default class Profile extends Vue {
  get teams() {
    return ['team1', 'team2', 'team3', 'team4'];
  }

  setInput(input: string) {
    console.log(input);
  }
}
</script>

<style scoped>
.header {
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

.profile-sec {
  display: flex !important;
  justify-content: space-between !important;
}
</style>

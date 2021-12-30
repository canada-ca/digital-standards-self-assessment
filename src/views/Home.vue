<template>
  <welcome />
</template>

<script lang="ts">
import Welcome from "@/components/Welcome.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    Welcome
  }
})
export default class Home extends Vue {}
</script>

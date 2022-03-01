<template>
  <div class="file-item">
    <span>{{ file.name }}</span>
    <b-img
      :src="require('@/assets/images/delete.png')"
      class="delete-icon"
      alt="delete"
      @click="onDeleteClicked()"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({})
export default class FileItem extends Vue {
  @Prop()
  file: any;

  onDeleteClicked() {
    this.$emit("delete");
  }
}
</script>

<style scoped>
.delete-icon {
  height: 18px;
  width: 18px;
  cursor: pointer;
}
.file-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 4px 10px !important;
  border: 1px solid #646464;
  margin-bottom: 10px;
}
</style>

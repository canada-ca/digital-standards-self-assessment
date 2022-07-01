<template>
  <div class="ac-container">
    <b-form-input
      type="search"
      v-model="searchInput"
      @blur="blur"
      @input="onInputChanged"
      @focus="focus"
      @keyup.esc="escape"
      @keyup.enter="enter"
      @keydown.up="up"
      @keydown.down="down"
      :placeholder="placeholder"
    />
    <div class="filtered-items" v-if="canShowFilteredItems">
      <div
        class="filtered-item"
        :class="{ 'filtered-item__hovered': index === cursor }"
        v-for="(item, index) in filteredItems"
        :key="index"
        @click="selectItem(item)"
        @mouseover="cursor = index"
      >
        <div>{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Team } from '@/interfaces/api-models';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({})
export default class AutoComplete extends Vue {
  // data
  searchInput = '';
  showItems = false;
  cursor = -1;
  filteredItems = new Array<string>();
  tempObjectItems = new Array<unknown>();

  // props
  @Prop() items!: Array<Team>;
  @Prop() objectMatchkey?: string;
  @Prop() placeholder?: string;
  @Prop() value?: Team;

  selectedTeam?: Team;

  get lang() {
    return this.$i18n.locale;
  }

  get canShowFilteredItems(): boolean {
    return this.showItems && !!this.filteredItems.length;
  }

  mounted() {
    this.onItemChanged();
  }

  @Watch('$i18n.locale')
  @Watch('items')
  onItemChanged() {
    if (!!this.value) {
      this.selectedTeam = this.value;
    }
    if (!!this.selectedTeam) {
      const strValue = this.lang === 'fr' ? this.selectedTeam.teamNameFr : this.selectedTeam.teamNameEn;
      this.setFilteredItems(strValue);
      if (this.cursor > -1) {
        this.searchInput = strValue;
      }
    } else {
      this.setFilteredItems();
    }
  }

  @Watch('searchInput')
  searchInputChanged(newInput: string) {
    this.setFilteredItems(newInput);
  }

  blur() {
    setTimeout(() => {
      if (this.searchInput === '') {
        this.$emit('valueChanged', undefined);
        this.selectedTeam = undefined;
      }
      if (this.showItems && !this.filteredItems[this.cursor]) {
        this.searchInput = '';
      }
      this.showItems = false;
    }, 200);
  }

  focus() {
    this.showItems = true;
  }

  onInputChanged() {
    this.showItems = true;
  }

  setFilteredItems(newInput = '') {
    this.setFilteredItemsForStringType(newInput);
    if (this.filteredItems.length > 0) {
      this.cursor = 0;
    } else {
      this.cursor = -1;
    }
  }

  setFilteredItemsForStringType(newInput: string) {
    if (this.items && this.items.length > 0) {
      const matchedItems: Team[] = this.items.filter((item) => {
        const stringItem: string = this.lang === 'fr' ? item.teamNameFr : item.teamNameEn;
        return this.isMatchFoundInStringItem(stringItem, newInput);
      });
      this.filteredItems = matchedItems.map((item) => (this.lang === 'fr' ? item.teamNameFr : item.teamNameEn));
    }
  }

  isMatchFoundInStringItem(item: string, newInput: string) {
    return item.toLocaleLowerCase().includes(newInput.toLocaleLowerCase());
  }

  isMatchFoundInObjectItem(item: unknown, newInput: string) {
    if (item && typeof item === 'object' && newInput && this.objectMatchkey) {
      const itemValue: string = item[this.objectMatchkey as keyof typeof item];
      const isMatchFound: boolean = itemValue.toLocaleLowerCase().includes(newInput.toLocaleLowerCase());
      return isMatchFound;
    }
    return false;
  }

  selectItem(fieldValue: string) {
    if (fieldValue) {
      this.searchInput = this.getSelectedItem(fieldValue);
      const selectedItem = this.items.find((item) =>
        this.lang === 'fr' ? item.teamNameFr === fieldValue : item.teamNameEn === fieldValue
      );
      this.$emit('valueChanged', selectedItem);
      this.selectedTeam = selectedItem;
      this.showItems = false;
    }
  }

  getSelectedItem(item: string) {
    if (this.objectMatchkey && this.tempObjectItems) {
      const itemObject = this.tempObjectItems.find(
        (tempItem) =>
          tempItem &&
          typeof tempItem === 'object' &&
          item.includes(tempItem[this.objectMatchkey as keyof typeof tempItem])
      );
      if (itemObject && typeof itemObject === 'object') {
        return itemObject[this.objectMatchkey as keyof typeof itemObject] ?? item;
      }
    }
    return item;
  }

  enter() {
    if (this.showItems && this.filteredItems[this.cursor]) {
      this.selectItem(this.filteredItems[this.cursor]);
      this.showItems = false;
    }
  }

  up() {
    if (this.cursor > -1) {
      this.cursor--;
      this.$el.getElementsByClassName('filtered-item')[this.cursor];
    }
  }

  down() {
    this.showItems = true;
    if (this.cursor < this.filteredItems.length) {
      this.cursor++;
      this.$el.getElementsByClassName('filtered-item')[this.cursor];
    }
  }

  escape() {
    this.showItems = !this.showItems;
  }
}
</script>

<style scoped>
.ac-container {
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  justify-content: start;
}
.ac-container input {
  width: 100%;
}
.filtered-items {
  position: absolute;
  top: 0;
  right: 0;
  width: fit-content;
  grid-row: 2;
  z-index: 9999;
  float: left;
  min-width: 10rem;
  max-height: 350px;
  overflow-y: auto;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}
.ac-container .filtered-items .filtered-item {
  cursor: pointer;
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
}
.ac-container .filtered-items .filtered-item:hover,
.ac-container .filtered-items .filtered-item__hovered {
  background-color: #eee;
  color: #101010;
}
</style>

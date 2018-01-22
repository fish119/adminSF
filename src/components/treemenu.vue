<template>
  <v-list>
    <v-list-group v-for="item in data" v-bind:key="item.id" prepend-icon="account_balance">
      <v-list-tile slot="activator" @click="itemClick(item)">
        <v-list-tile-content>
          <v-list-tile-title>{{ item.name }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <div class="children" style="margin-left:5px;">
        <treemenu :data="item.children" :isParent="isParent" @handle="emitHandle"></treemenu>
      </div>
    </v-list-group>
  </v-list>

</template>
<script>
  export default {
    name: 'treemenu',
    props: {
      data: Array,
      isParent: Boolean
    },
    methods: {
      itemClick(depart) {
        this.emitHandle(depart);
      },
      emitHandle(item) {
        this.$emit('handle', item)
      }
    }
  }

</script>
<style scoped>
  .children>.navigation-drawer {
    padding-bottom: 0 !important;
  }

</style>

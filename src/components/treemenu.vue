<template>
  <v-navigation-drawer floating permanent width="100%">
    <v-list>
      <v-list-group v-for="item in items" v-bind:key="item.id" prepend-icon="account_balance" @click.native.stop="itemClick(item,null)">
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <div class="children">
          <treemenu v-for="subItem in item.children" :items="item.children" v-show="item.children" v-bind:key="subItem.id" v-on:departClick="itemClick(subItem,item)"></treemenu>
        </div>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
  export default {
    name: 'treemenu',
    props: {
      items: Array
    },
    methods: {
      itemClick(depart,parent) {
        this.$emit("departClick", {item:depart,parent:parent});
      }
    }
  }

</script>
<style scoped>
  .children>.navigation-drawer {
    padding-bottom: 0 !important;
  }

</style>

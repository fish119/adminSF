<template>
  <v-navigation-drawer floating permanent width="100%">
    <v-list>
      <v-list-group v-for="item in data" v-bind:key="item.id" prepend-icon="account_balance" @click.native.stop="itemClick(item,isParent)">
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <div class="children">
          <treemenu :data="item.children" :isParent="isParent"></treemenu>
        </div>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
  export default {
    name: 'treemenu',
    props: {
      data: Array,
      isParent: Boolean
    },
    methods: {
      itemClick(depart, isParent) {
        if (isParent) {
          this.$store.commit('setParentMenuObj', depart);
        } else {
          this.$store.commit('setSelectedMenuObj', depart);
        }
      }
    }
  }

</script>
<style scoped>
  .children>.navigation-drawer {
    padding-bottom: 0 !important;
  }

</style>

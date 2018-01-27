<template>
  <div class="main-container-div">
    <v-flex hidden-xs-only>
      <v-breadcrumbs class="main-breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item v-for="item in breadcrumbsItems" :key="item">
          {{ item }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-divider></v-divider>
    </v-flex>
    <v-container fluid style="padding:10px;">
      <v-layout row wrap>
        <iframe :src="baseUrl+'druid/index.html'" frameborder="0"></iframe>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        breadcrumbsItems: ['系统监控', '数据库监控'],
      }
    },
    computed: {
      baseUrl() {
        return this.axios.baseURL
      }
    }
  }
</script>

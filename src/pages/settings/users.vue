<template>
  <div class="main-container-div">
    <v-flex hidden-xs-only>
      <v-breadcrumbs class="main-breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item v-for="item in breadcrumbsItems" :key="item.text" :disabled="item.disabled">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-divider></v-divider>
    </v-flex>
    <v-container fluid style="padding:10px;">
    </v-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        breadcrumbsItems: [{
            text: '系统设置',
            disabled: false
          },
          {
            text: '用户管理',
            disabled: false
          }
        ],
      }
    }
  }

</script>
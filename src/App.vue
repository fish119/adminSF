<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
  export default {
    name: 'app'
  }

</script>
<style>
  #nprogress .bar {
    background: #FF4081 !important;
  }

  #nprogress .peg {
    box-shadow: 0 0 10px #FF4081, 0 0 5px #FF4081!important;
  }

  #nprogress .spinner-icon {
    border-top-color: #FF4081!important;
    border-left-color: #FF4081!important;
  }

</style>

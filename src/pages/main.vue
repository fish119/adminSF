<template>
  <v-layout>
    <h1>{{text}}</h1>
    <p>
    <button @click="test">TEST</button>
    </p>
  </v-layout>
</template>
<script>
  export default {
    data() {
      return {
        text:'Main'
      }
    },
    methods: {
      test(){
         this.axios.post('test/test').then(response => {
            this.text = response.data
        })
      },
    }
  }

</script>

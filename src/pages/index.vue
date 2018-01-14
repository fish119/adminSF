<template>
  <div>
    <v-navigation-drawer class="nav-drawer" fixed :clipped="$vuetify.breakpoint.mdAndUp" app v-model="drawer">
      <v-layout row class="user-details" align-center="true" justify-center>
        <v-layout justify-center style="margin-left:20px;">
          <v-avatar size="48">
            <img width="48px;" :src="avatar" alt="user">
          </v-avatar>
        </v-layout>
        <v-layout style="margin-left:-10px;">
          <p class="username">{{username}}</p>
        </v-layout>
      </v-layout>
      <v-list>
        <v-list-group v-for="item in items" v-bind:key="item.title" :prepend-icon="item.icon" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" @click="">
            <v-list-tile-action class="list-sub-item-icon">
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" dark app :clipped-left="$vuetify.breakpoint.mdAndUp" fixed>
      <v-toolbar-title class="ml-0 pl-3">
        <v-btn icon large @click.stop="drawer = !drawer">
          <v-avatar size="50px" tile>
            <img src="/static/logo.png" alt="Vuetify">
          </v-avatar>
        </v-btn>
        <span>Fish119 Admin Template</span>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon large @click="logout" style="right:20px;">
        <v-icon medium>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <!-- <v-layout justify-center align-center> -->
        <router-view></router-view>
        <!-- </v-layout> -->
      </v-container>
      <v-snackbar color="error" :timeout="2000" :top="true" v-model="isShowSnackbar">
        {{this.$store.state.snackMsg}}
        <v-btn flat dark @click.native="$store.commit('showSnackbar')">Close</v-btn>
      </v-snackbar>
    </v-content>
    <!-- <v-btn fab bottom right color="pink" dark fixed > -->
  </div>
</template>
<style src="../assets/main.css" />
<script>
  export default {
    data: () => ({
      username:'',
      avatar:'/static/avatar.png',
      dialog: false,
      drawer: null,
      items: [{
          action: 'local_activity',
          icon: 'local_activity',
          title: 'Attractions',
          items: [{
            icon: 'local_activity',
            title: 'List Item'
          }]
        },
        {
          action: 'restaurant',
          icon: 'restaurant',
          title: 'Dining',
          items: [{
              icon: 'local_activity',
              title: 'Breakfast & brunch'
            },
            {
              icon: 'local_activity',
              title: 'New American'
            },
            {
              icon: 'local_activity',
              title: 'Sushi'
            }
          ]
        }
      ]
    }),
    computed: {
      isShowSnackbar: {
        get() {
          return this.$store.state.isShowSnackbar
        },
        set(value) {
          this.$store.commit('showSnackbar')
        }
      }
    },
    methods: {
      getIndexData(username){
        console.log(username)
        this.axios.post('index',{username:username}).then(response => {
          this.username = response.data.user.username
          this.avatar = response.data.user.avatar
            console.log(response)
        })
      },
      logout: function () {
        window.localStorage.clear();
        this.$router.push('/login');
      }
    },
    mounted() {
      this.getIndexData(window.localStorage.getItem('username'))
    }
  }

</script>

<template>
  <v-container fill-height class="login-layout">
    <v-layout row wrap align-center>
      <v-flex xs12 md4 offset-md4 sm8 offset-sm2 class="text-xs-center" style="padding:0 50px;">
        <v-avatar size="60" style="padding-bottom:30px;">
          <img src="/static/logo.png" alt="user">
        </v-avatar>
        <v-card class="card" color="#fff">
          <v-card-title class="text-xs-center">
            <h3 class="headline text-xs-center login-title">Login</h3>
          </v-card-title>
          <v-card-text style="padding-top:0;margin-top:0;">
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field v-on:keyup.13="submit" label="Username" v-model="username" :rules="nameRules" required></v-text-field>
              <v-text-field v-on:keyup.13="submit" name="password" v-model="password" label="Password" :rules="passwordRules" required :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (showPassword = !showPassword)" :type="showPassword ? 'password' : 'text'"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions style="padding-bottom:16px;">
            <v-spacer></v-spacer>
            <v-btn color="accent" @click="submit" :disabled="!valid">登 录</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="accent" @click="$store.commit('showSnackbar','注册')">注 册</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
        <p class="text-xs-center" style="color:rgba(0,0,0,0.5);padding-top:30px;">&copy;FISH119 &nbsp;&nbsp;2018 &nbsp;&nbsp;
          <a href="http://www.fish119.site" style="color:#fff;text-decoration: none;">http://www.fish119.site</a>
        </p>
      </v-flex>
    </v-layout>
    <v-snackbar color="error" :timeout="2000" :top="true" v-model="isShowSnackbar">
      {{this.$store.state.snackMsg}}
      <v-btn flat dark @click.native="$store.commit('showSnackbar')">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
  export default {
    data() {
      return {
        snackbar: false,
        showPassword: true,
        valid: true,
        username: 'string',
        nameRules: [
          (v) => !!v || 'Username is required',
          (v) => v && v.length >= 6 || 'Username must be more than 6 characters',
          (v) => v && v.length <= 20 || 'Username must be less than 20 characters'
        ],
        password: 'password',
        passwordRules: [
          (v) => !!v || 'Password is required',
          // (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
          (v) => v && v.length >= 6 || 'Password must be more than 6 characters',
          (v) => v && v.length <= 20 || 'Password must be less than 20 characters'
        ]
      }
    },
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
      submit() {
        this.valid = false;
        if (this.$refs.form.validate()) {
          let params = {
            username: this.username,
            password: this.password
          }
          this.axios.post('auth', params)
            .then(response => {
              this.valid = true;
              if (response.status == 200) {
                if (response.data.token) {
                  window.localStorage.setItem('token', "fish119"+response.data.token)
                  this.$router.push('/');
                }
              }
            })
        }
      },
      clear() {
        this.$refs.form.reset()
      }
    }
  }

</script>
<style scoped>
  .login-layout {
    background: #00BCD4!important;
    max-width: none;
  }

  .card {
    background-color: #fafafa!important;
    box-shadow: 6px 6px 3px rgba(0, 0, 0, .2)!important;
  }

  .login-title {
    width: 100%;
    color: rgba(0, 0, 0, 0.6);
  }

</style>

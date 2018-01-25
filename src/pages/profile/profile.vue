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
        <v-flex offset-md1 md2 sm3 xs12 style="padding-top:30px;" justify-center align-center class="text-xs-center">
          <v-avatar :size="100" style="cursor: pointer;" @click="changeAvatar">
            <img :src="user.avatar?user.avatar:'/static/avatar.png'" alt="avatar">
          </v-avatar>
          <p style="padding-top:20px;">
            <span class="headline">{{ user.nickname }}</span>
          </p>
          <p class="subtext text-xs-center">创建时间
            <br/>{{ user.createDate }}</p>
          <v-btn @click.native="setDefaultPassword" outline color="secondary" style="margin-top:20px;">
            <v-icon left dark>vpn_key</v-icon>
            重置密码
          </v-btn>
        </v-flex>
        <v-flex offset-md1 sm8 md6 xs12>
          <v-card style="margin-top:20px;">
            <v-card-title>
              <span class="headline" style="padding-top:0;">个人资料</span>
            </v-card-title>
            <v-card-text style="padding-top:0;padding-bottom:0;">
              <v-form v-model="valid" ref="profileForm" lazy-validation>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="用户名" :loading="usernameLoading" maxlength="30" :error-messages="usernameErrMsg" v-model="user.username"
                        :rules="usernameRules"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="昵称/姓名" :loading="nicknameLoading" maxlength="30" :error-messages="nicknameErrMsg" v-model="user.nickname"
                        :rules="nicknameRules"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="电话号码" :loading="phoneLoading" maxlength="11" :error-messages="phoneErrMsg" v-model="user.phone" :rules="phoneRules"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="email" :loading="emailLoading" maxlength="30" :error-messages="emailErrMsg" v-model="user.email" :rules="emailRules"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <!-- <v-text-field label="部门" v-model="user.department.name"></v-text-field> -->
                      <v-menu :full-width="true" v-model="departSelectOpen" :close-on-content-click="false" offset-y nudge-top="25">
                        <v-text-field label="部门" readonly v-model="user.department.name" slot="activator"></v-text-field>
                        <v-card>
                          <treemenu :data="departments" :isParent="false" @handle="departmentClick" style="padding-bottom:20px !important;"></treemenu>
                        </v-card>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="上次修改密码时间" readonly v-model="user.lastPasswordResetDate"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-select item-text="name" item-value="id" return-object label="角色" :items="roles" v-model="user.roles" multiple chips>
                        <template slot="selection" slot-scope="data">
                          <v-chip color="primary" class="chip--select-multi white--text" :key="data.item.id">
                            {{ data.item.name}}
                          </v-chip>
                        </template>
                      </v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" @click="save">保 存</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
  import treemenu from '../../components/treemenu'
  export default {
    components: {
      treemenu
    },
    data() {
      var self = this;
      return {
        valid: false,
        user: {
          department: {}
        },
        departments: [],
        roles: [],
        departSelectOpen: false,
        breadcrumbsItems: ['个人设置', '个人信息'],
        phoneLoading: false,
        phoneErrMsg: [],
        usernameLoading: false,
        usernameErrMsg: [],
        nicknameLoading: false,
        nicknameErrMsg: [],
        emailLoading: false,
        emailErrMsg: [],
        usernameRules: [
          (v) => !!v || '此项必须填写',
          (v) => v && v.length >= 6 || '长度不能小于6字符',
          (v) => v && v.length <= 30 || '长度不能超过30字符',
          (v) => self.testUsername()
        ],
        nicknameRules: [
          (v) => !!v || '此项必须填写',
          (v) => v && v.length >= 3 || '长度不能小于6字符',
          (v) => v && v.length <= 30 || '长度不能超过30字符',
          (v) => self.testNickname()
        ],
        emailRules: [
          (v) => !v || v.length >= 6 || '长度不能小于6字符',
          (v) => !v || v.length <= 30 || '长度不能超过30字符',
          (v) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '邮件地址不正确',
          (v) => self.testEmail()
        ],
        phoneRules: [
          (v) => !!v || '此项必须填写',
          (v) => /^1[0-9]{10}$/.test(v) || '手机号码不正确',
          (v) => self.testPhone()
        ]
      }
    },
    methods: {
      changeAvatar() {
        alert('a')
      },
      getProfile() {
        this.axios.get('setting/user/current').then(response => {
          if (response.status == 200) {
            this.user = response.data.data;
          }
        })
      },
      getAllDeparts() {
        this.axios.get('setting/departments').then(response => {
          if (response.status == 200) {
            this.departments = response.data.data;
            this.parentDeparts = response.data.data;
          }
        })
      },
      getRoles() {
        this.axios.get('setting/roles').then(response => {
          if (response.status == 200) {
            this.roles = response.data.data;
          }
        })
      },
      testUsername() {
        if (!this.user || !this.user.id) {
          this.user.id = 0;
        }
        if (this.user.username && this.user.username.length >= 6) {
          this.userLoading = 'accent';
          this.axios.get('setting/user/' + this.user.id + '/username/' + this.user.username).then(response => {
            if (response.status == 200) {
              this.usernameErrMsg = response.data.data ? [] : ['用户名已存在'];
              this.usernameLoading = false;
            }
          })
        } else {
          this.usernameErrMsg = [];
          this.usernameLoading = false;
        }
        return true;
      },
      testNickname() {
        if (!this.user || !this.user.id) {
          this.user.id = 0;
        }
        if (this.user.nickname && this.user.nickname.length >= 6) {
          this.userLoading = 'accent';
          this.axios.get('setting/user/' + this.user.id + '/nickname/' + this.user.nickname).then(response => {
            if (response.status == 200) {
              this.nicknameErrMsg = response.data.data ? [] : ['昵称已存在'];
              this.nicknameLoading = false;
            }
          })
        } else {
          this.nicknameErrMsg = [];
          this.nicknameLoading = false;
        }
        return true;
      },
      testPhone() {
        if (!this.user || !this.user.id) {
          this.user.id = 0;
        }
        if (this.user.phone && this.user.phone.length == 11) {
          this.phoneLoading = 'accent';
          this.axios.get('setting/user/' + this.user.id + '/phone/' + this.user.phone).then(response => {
            if (response.status == 200) {
              this.phoneErrMsg = response.data.data ? [] : ['手机号码已存在'];
              this.phoneLoading = false;
            }
          })
        } else {
          this.phoneErrMsg = [];
          this.phoneLoading = false;
        }
        return true;
      },
      testEmail() {
        if (!this.user || !this.user.id) {
          this.user.id = 0;
        }
        if (this.user.email && this.user.email.length > 6) {
          this.emailLoading = 'accent';
          var url = encodeURI('setting/user/' + this.user.id + '/email?email=' + this.user.email);
          this.axios.get(url).then(response => {
            if (response.status == 200) {
              this.emailErrMsg = response.data.data ? [] : ['Email已存在'];
              this.emailLoading = false;
            }
          })
        } else {
          this.emailErrMsg = [];
          this.emailLoading = false;
        }
        return true;
      },
      departmentClick(value) {
        this.user.department = value;
        this.departSelectOpen = false;
      },
      save() {
        this.valid = false;
        if (this.$refs.profileForm.validate()) {
          if (this.user.department.children) {
            this.user.department.children = null;
          }
          if (this.user.department.parent) {
            this.user.department.parent = null;
          }
          let params = {
            user: this.user
          }
          this.axios.post('setting/users', params).then(response => {
            if (response.status == 200) {              
              this.loading = false;
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
            }
          })
        }
      },
      setDefaultPassword() {
        this.axios.post('setting/users/setDefaultPassword', {
          id: this.user.id
        }).then(response => {
          if (response.status == 200) {
            this.loading = false;
            this.store.commit('showSnackbar', {
              msg: '操作成功',
              color: 'success'
            });
          }
        })
      }
    },
    mounted() {
      this.getProfile();
      this.getAllDeparts();
      this.getRoles();
    }
  }

</script>
<style scoped>
  p {
    font-size: 14px !important;
    font-weight: 500;
  }

  .subtext {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, .54);
  }

  .headline {
    font-size: 20px !important;
  }

  .card__title {
    padding-bottom: 20px !important;
  }

  .card__actions {
    padding-top: 0!important;
    padding-bottom: 15px!important;
  }

</style>

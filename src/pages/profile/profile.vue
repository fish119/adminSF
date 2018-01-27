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
    <v-container fluid style="padding:0px!important;">
      <v-layout row wrap>
        <v-flex offset-md1 md2 sm3 xs12 style="padding-top:30px;" justify-center align-center class="text-xs-center">
          <imgUpload :maxSize="1024" :headers="headers" field="avatar" :withCredentials="true" :noRotate="false" @crop-upload-success="cropUploadSuccess"
            ki="255" :url="baseUrl+'setting/profile/setAvatar'" :value="uploadShow" v-model="uploadShow" img-format="png"></imgUpload>
          <v-avatar :size="100" style="cursor: pointer;" @click="toggleUpload">
            <img :src="user.avatar?baseUrl+'avatar/'+user.avatar:'/static/avatar.png'" alt="avatar">
          </v-avatar>
          <p style="padding-top:20px;">
            <span class="headline">{{ user.nickname }}</span>
          </p>
          <p class="subtext text-xs-center">创建时间
            <br/>{{ user.createDate }}</p>
          <v-btn @click.native="showChangePassword=true;" outline color="secondary" style="margin-top:20px;">
            <v-icon left dark>vpn_key</v-icon>
            修改密码
          </v-btn>
        </v-flex>
        <v-flex offset-md1 sm8 md7 xs12>
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
                        readonly></v-text-field>
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
    <v-dialog v-model="showChangePassword" max-width="400px">
      <v-card>
        <v-card-title style="padding-bottom:15px;">
          <span class="headline" style="padding-top:0;">修改密码</span>
        </v-card-title>
        <v-card-text style="padding-top:0;padding-bottom:0;">
          <v-form v-model="passValid" ref="changePasswordForm" lazy-validation>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field maxlength="20" v-model="oldPassword" label="旧密码" :rules="passwordRules" :append-icon="!showPassword ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (showPassword = !showPassword)" :type="showPassword ? 'password' : 'text'"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field maxlength="20" v-model="newPassword" label="新密码" :rules="passwordRules" :append-icon="!showNewPass ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (showNewPass = !showNewPass)" :type="showNewPass ? 'password' : 'text'" :error-messages="passErrMsg"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field maxlength="20" v-model="confirmPassword" label="再次输入新密码" :rules="confirmPasswordRules" :append-icon="!showConfirmPass ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (showConfirmPass = !showConfirmPass)" :type="showConfirmPass ? 'password' : 'text'"
                    :error-messages="passErrMsg"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-top:0;">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="initShowChangePass()">取 消</v-btn>
          <v-btn color="accent" @click="changePassword()">保 存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import treemenu from '../../components/treemenu'
  import myUpload from '../../components/imgUpload/upload.vue';
  import md5 from 'js-md5'
  export default {
    components: {
      treemenu,
      'imgUpload': myUpload
    },
    data() {
      var self = this;
      return {
        passErrMsg: [],
        valid: false,
        passValid: false,
        showChangePassword: false,
        showPassword: true,
        showNewPass: true,
        showConfirmPass: true,
        uploadShow: false,
        headers: {
          Authorization: window.localStorage.getItem("token")
        },
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
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v && v.length >= 6 || 'Password must be more than 6 characters',
          (v) => v && v.length <= 20 || 'Password must be less than 20 characters'
        ],
        confirmPasswordRules: [
          (v) => !!v || 'Password is required',
          (v) => v && v.length >= 6 || 'Password must be more than 6 characters',
          (v) => v && v.length <= 20 || 'Password must be less than 20 characters',
          (v) => self.testConfirmPass()
        ],
        confirmPassword: null,
        oldPassword: null,
        newPassword: null
      }
    },
    computed: {
      baseUrl() {
        return this.axios.baseURL
      }
    },
    methods: {
      cropUploadSuccess: function cropUploadSuccess(data, field) {
        this.user.avatar = data.data + "?t=" + (new Date()).valueOf();
        this.$store.commit('setAvatar', this.baseUrl + 'avatar/' + this.user.avatar);
      },
      toggleUpload() {
        this.uploadShow = !this.uploadShow;
      },
      getProfile() {
        this.axios.get('setting/profile').then(response => {
          if (response.status == 200) {
            this.user = response.data.user;
            if (this.user.avatar) {
              this.$store.commit('setAvatar', this.baseUrl + 'avatar/' + this.user.avatar);
            }
            this.departments = response.data.departments;
            this.parentDeparts = response.data.departments;
            this.roles = response.data.roles;
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
      testConfirmPass() {
        if (this.newPassword && this.newPassword.length >= 6 && this.confirmPassword && this.confirmPassword.length >=
          6) {
          if (this.newPassword === this.confirmPassword) {
            this.passErrMsg = [];
          } else {
            this.passErrMsg = ['两次输入的密码不一致'];
          }
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
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
            }
          })
        }
      },
      changePassword() {
        this.passValid = false;
        if (this.$refs.changePasswordForm.validate()) {
          this.axios.post('setting/profile/changePassword', {
            username: this.user.username,
            oldPassword: md5(this.oldPassword),
            newPassword: md5(this.newPassword)
          }).then(response => {
            if (response.status == 200) {
              this.showChangePassword = false;
              this.store.commit('showSnackbar', {
                msg: '操作成功，请重新登录',
                color: 'success'
              });
              setTimeout(() => {
                window.localStorage.removeItem('token');
                this.$router.push('/login');
              }, 2000);
            }
          })
        }
      },
      initShowChangePass() {
        this.showChangePassword = false;
        this.oldPassword = null;
        this.newPassword = null;
        this.confirmPassword = null;
        this.passErrMsg = [];
      }
    },
    mounted() {
      this.getProfile();
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
    padding-top: 0 !important;
    padding-bottom: 15px !important;
  }

</style>

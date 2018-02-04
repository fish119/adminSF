<template>
  <div class="main-container-div">
    <v-layout row>
      <v-flex hidden-xs-only sm6>
        <v-breadcrumbs class="main-breadcrumbs">
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item v-for="item in breadcrumbsItems" :key="item" :disabled="item.disabled">
            {{ item }}
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex sm6 xs12>
        <v-text-field class="searchbar" style="padding-top: 0;" append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-container>
      <v-data-table :rows-per-page-items="rows_per_page_items" :rows-per-page-text="rows_per_page_text" :loading="loading" :total-items="totalItems"
        :headers="headers" :items="items" :pagination.sync="pagination" item-key="id" class="elevation-1">
        <template slot="headers" slot-scope="props">
          <tr>
            <th class="tb-header" v-for="header in props.headers" :key="header.text" :class="header.text!='头像'?['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']:[]"
              @click="header.text!='头像'?changeSort(header.value):1==1;">
              <v-icon v-show="header.text!='头像'" small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
            <th class="tb-header">操作</th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td class="text-xs-center">
              <v-avatar size="30">
                <img :src="props.item.avatar?baseUrl+'avatar/'+props.item.avatar:'/static/avatar.png'" />
              </v-avatar>
            </td>
            <td class="text-xs-center">{{ props.item.username }}</td>
            <td class="text-xs-center">{{ props.item.nickname }}</td>
            <td class="text-xs-center">{{ props.item.phone }}</td>
            <td class="text-xs-center">{{ props.item.email }}</td>
            <td class="text-xs-center">{{ props.item.department.name }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip top>
                <v-btn icon class="mx-0" @click="openEditDialog(props.item)" slot="activator">
                  <v-icon color="secondary">edit</v-icon>
                </v-btn>
                <span>编辑</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn icon class="mx-0" @click="user=props.item;delDialog=true;" slot="activator">
                  <v-icon color="accent">delete</v-icon>
                </v-btn>
                <span>删除</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <v-layout row>
            <v-icon>warning</v-icon>
            <v-subheader>Sorry, nothing to display here :(</v-subheader>
          </v-layout>
        </template>
      </v-data-table>
      <v-btn style="margin-bottom:40px;" color="accent" @click="openEditDialog(null)" dark small absolute bottom right fab fixed>
        <v-icon>add</v-icon>
      </v-btn>
    </v-container>
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title style="padding-bottom:15px;">
          <span class="headline" style="padding-top:0;">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text style="padding-top:0;padding-bottom:0;">
          <v-form v-model="valid" ref="userForm" lazy-validation>
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
                    <v-text-field label="部门" :rules="departRules" readonly v-model="user.department.name" slot="activator"></v-text-field>
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
        <v-card-actions style="padding-top:0;">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="closeEditDialog">取 消</v-btn>
          <v-btn color="info" @click="setDefaultPassword(user.id)">重置密码</v-btn>
          <v-btn color="accent" @click="save">保 存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="delDialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">确定要删除这条记录吗？删除后不可恢复。</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="delDialog = false">取 消</v-btn>
          <v-btn color="accent" @click.native="deleteUser(user.id)">确 定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  import treemenu from '../../components/treemenu'
  export default {
    components: {
      treemenu
    },
    data: function () {
      var self = this;
      return {
        departments: [],
        parentDeparts: [],
        departSelectOpen: false,
        valid: false,
        user: {
          department: {}
        },
        editDialog: false,
        delDialog: false,
        formTitle: '新增',
        search: '',
        loading: false,
        totalItems: 10,
        breadcrumbsItems: ['人员管理','用户管理'],
        pagination: {
          descending: false,
          page: 1,
          rowsPerPage: 10,
          sortBy: "username"
        },
        rows_per_page_items: [5, 10, 25, 50, 100],
        rows_per_page_text: "每页行数",
        selected: [],
        headers: [{
            text: '头像',
            align: 'center',
            value: 'avatar'
          },
          {
            text: '用户名',
            align: 'center',
            value: 'username'
          }, {
            text: '昵称/姓名',
            align: 'center',
            value: 'nickname'
          }, {
            text: '电话号码',
            align: 'center',
            value: 'phone'
          }, {
            text: 'email',
            align: 'center',
            value: 'email'
          },
          {
            text: '部门',
            align: 'center',
            value: 'department.name'
          }
        ],
        items: [],
        roles: [],
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
          (v) => v && v.length >= 6 || '长度不能小于6字符',
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
        departRules: [
          (v) => !!v || '此项必须填写'
        ]
      }
    },
    computed: {
      baseUrl() {
        return this.axios.baseURL
      }
    },
    methods: {
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
      getUsers() {
        let params = {
          searchStr: this.search,
          page: this.pagination.page - 1,
          size: this.pagination.rowsPerPage,
          sortColumn: this.pagination.sortBy,
          direction: this.pagination.descending ? "DESC" : "ASC"
        }
        this.loading = true;
        this.axios.get('setting/users', params).then(response => {
          if (response.status == 200) {
            this.items = response.data.data.content;
            this.totalItems = response.data.data.totalElements;
            this.loading = false;
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
      save() {
        this.valid = false;
        if (this.$refs.userForm.validate()) {
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
              if (!this.user.id) {
                this.getUsers();
              }
              this.closeEditDialog();
              this.loading = false;
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
            }
          })
        }
      },
      setDefaultPassword(id) {
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
      },
      deleteUser() {
        this.axios.delete('setting/users/' + this.user.id).then(response => {
          if (response.status == 200) {
            this.loading = false;
            this.getUsers();
            this.store.commit('showSnackbar', {
              msg: '操作成功',
              color: 'success'
            });
            this.delDialog = false;
          }
        })
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      openEditDialog(item) {
        this.user = item ? item : {
          id:null,
          department: {},
          roles: []
        };
        this.formTitle = item ? '编辑' : '新增';
        this.editDialog = true;
      },
      departmentClick(value) {
        this.user.department = value;
        this.departSelectOpen = false;
      },
      closeEditDialog() {
        this.editDialog = false;
        this.phoneLoading = false;
        this.phoneErrMsg = [];
      }
    },
    watch: {
      pagination: {
        handler() {
          this.getUsers();
        },
        deep: true
      },
      search: {
        handler() {
          this.getUsers();
        },
      }
    },
    mounted() {
      this.getRoles();
      this.getAllDeparts();
    }
  }

</script>
<style scoped>
  .tb-header {
    font-size: 14px;
    font-weight: 500;
  }

</style>
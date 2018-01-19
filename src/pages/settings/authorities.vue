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
      <v-layout row>
        <v-flex sm3 hidden-xs-only style="padding-right:10px;">
          <v-card class="card">
            <v-flex hidden-sm-only>
              <v-card-actions style="padding-bottom:5px;">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addAuthority">新 增</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="openDel">删 除</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-flex>
            <v-card-text>
              <v-navigation-drawer width="240px;" floating permanent>
                <v-list>
                  <v-list-group v-for="item in items" v-bind:key="item.id" prepend-icon="done" @click.native="menuClick(item,null)">
                    <v-list-tile slot="activator">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-for="subItem in item.children" v-bind:key="subItem.id" @click.native.stop="menuClick(subItem,item)" @click="1==1">
                      <v-list-tile-action class="list-sub-item-icon">
                        <v-icon>sort</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list-group>
                </v-list>
              </v-navigation-drawer>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex sm9>
          <v-card>
            <v-card-text style="padding-bottom:0;">
              <v-form v-model="valid" ref="authorityForm">
                <v-layout row wrap flex align-center justify-center>
                  <v-flex sm5 xs12>
                    <v-layout row wrap flex align-center justify-center>
                      <v-flex xs3>
                        父 级：
                      </v-flex>
                      <v-flex xs9>
                        <v-select clearable item-text="name" v-bind:items="items" v-model="parentAuthority" :rules="[selectRules.parentNotSelf(parentAuthority,authority),selectRules.hasChildren(parentAuthority,authority)]"
                          label="请选择父级" single-line bottom></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                  <v-flex sm2></v-flex>
                  <v-flex sm5 xs12>
                    <v-layout row wrap flex align-center justify-center>
                      <v-flex xs3>
                        方 法：
                      </v-flex>
                      <v-flex xs9>
                        <v-select v-bind:items="methods" v-model="authority.method" single-line bottom :rules="requiredRules" required></v-select>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    名 称：
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="名 称" v-model="authority.name" :rules="requiredRules" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    链 接：
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="链 接" v-model="authority.url"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    描 述：
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="描 述" v-model="authority.description"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    排 序：
                  </v-flex>
                  <v-flex md11>
                    <v-layout row wrap flex align-center justify-center>
                      <v-flex xs1>
                        {{authority.sort}}
                      </v-flex>
                      <v-flex xs11>
                        <v-slider v-model="authority.sort" step="1" max="20" thumb-label></v-slider>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-top:0;">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="saveAuthority">保 存</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="openDel">删 除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">确定要删除这条记录吗？删除后不可恢复。</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="dialog = false">取 消</v-btn>
          <v-btn color="accent" @click.native="delAuthority">确 定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dialog: false,
        valid: true,
        items: [],
        methods: [{
            text: 'ALL',
            value: 'ALL'
          },
          {
            text: 'GET',
            value: 'GET'
          },
          {
            text: 'POST',
            value: 'POST'
          },
          {
            text: 'PUT',
            value: 'PUT'
          },
          {
            text: 'DELETE',
            value: 'DELETE'
          }
        ],
        breadcrumbsItems: [{
            text: '系统设置',
            disabled: false
          },
          {
            text: '权限管理',
            disabled: false
          }
        ],
        authority: {
          id: null,
          description: '',
          name: '',
          sort: 0,
          url: '',
          method: ''
        },
        parentAuthority: null,
        requiredRules: [
          (v) => !!v || '此项必须填写',
          (v) => v && v.length <= 30 || '长度不能超过30字符'
        ],
        selectRules: {
          parentNotSelf(parent, self) {
            if (parent && self && parent.id && self.id && parent.id == self.id) {
              return '不能选择自己为父级';
            } else {
              return true;
            }
          },
          hasChildren(parent, menu) {
            if (menu.children && menu.children.length > 0) {
              if (parent && parent.id) {
                return '该菜单包含下级菜单，请勿为其选择父级菜单';
              }
            }
            return true;
          }
        }
      }
    },
    methods: {
      getAuthoritys() {
        this.axios.get('setting/authorities').then(response => {
          if (response.status == 200) {
            this.items = response.data.data;
          }
        })
      },
      menuClick(obj, parent) {
        this.authority = obj;
        this.parentAuthority = parent;
      },
      addAuthority() {
        this.authority = {
          id: null,
          description: '',
          name: '',
          sort: 0,
          url: '',
          method: ''
        }
      },
      openDel() {
        if (this.authority != null && this.authority.id != null) {
          this.dialog = true;
        }
      },
      delAuthority() {
        if (this.authority != null && this.authority.id != null) {
          if (this.parentAuthority == null) {
            this.axios.delete('setting/authority/' + this.authority.id).then(response => {
              if (response.status == 200) {
                this.items = response.data.data;
                this.store.commit('showSnackbar', {
                  msg: '操作成功',
                  color: 'success'
                });
                this.clear();
              }
            })
          } else {
            this.axios.delete('setting/authorities/' + this.parentAuthority.id + '/authorities/' + this.authority.id).then(
              response => {
                if (response.status == 200) {
                  this.items = response.data.data;
                  this.store.commit('showSnackbar', {
                    msg: '操作成功',
                    color: 'success'
                  });
                  this.clear();
                }
              })
          }
        }
        this.dialog = false;
      },
      saveAuthority() {
        this.valid = false;
        if (this.$refs.authorityForm.validate()) {
          if (!this.authority.url) {
            this.authority.url = "/"
          }
          let params = {
            parentId: this.parentAuthority == null ? null : this.parentAuthority.id,
            authority: this.authority
          }
          this.axios.post('setting/authorities', params).then(response => {
            if (response.status == 200) {
              this.items = response.data.data;
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
              this.clear();
            }
          })
        }
      },
      clear() {
        this.$refs.authorityForm.reset()
      }
    },
    mounted() {
      this.getAuthoritys();
    }
  }

</script>

<template>
  <div class="main-container-div">
    <v-flex>
      <v-breadcrumbs class="main-breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item v-for="item in breadcrumbsItems" :key="item.text" :disabled="item.disabled">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-divider></v-divider>
    </v-flex>
    <v-container fluid style="padding:10px;">
      <v-layout row wrap>
        <v-flex sm3 xs12 style="padding-right:10px;padding-bottom:10px;">
          <v-card class="card">
            <v-flex hidden-sm-only>
              <v-card-actions style="padding-bottom:0;">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addRole">新 增</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="openDel">删 除</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-flex>
            <v-card-text>
              <v-list>
                <v-list-tile v-ripple avatar v-for="item in items" v-bind:key="item.name" @click="roleClick(item)">
                  <v-icon>supervisor_account</v-icon>
                  <v-list-tile-title style="margin-left:10px;">{{ item.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex sm9 xs12>
          <v-card>
            <v-card-text style="padding-bottom:0;">
              <v-form v-model="valid" ref="roleForm">
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    名 称：
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="名 称" v-model="role.name" :rules="requiredRules" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    排 序：
                  </v-flex>
                  <v-flex md11>
                    <v-layout row wrap flex align-center justify-center>
                      <v-flex xs1>
                        {{role.sort}}
                      </v-flex>
                      <v-flex xs11>
                        <v-slider v-model="role.sort" step="1" max="20" thumb-label></v-slider>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-tabs color="cyan" dark fixed-tabs style="background:#fafafa;">
                  <v-tab key="权限" ripple>权限</v-tab>
                  <v-tab-item key="权限" style="padding:10px;">
                    <v-expansion-panel style="margin:0 ,10px!important;">
                      <v-expansion-panel-content v-for="aitem in authorities" :key="aitem.id">
                        <div slot="header">
                          <v-layout row wrap align-center justify-center>
                            <v-flex xs12 sm6 justify-center>{{aitem.name}}
                            </v-flex>
                            <v-flex xs12 sm6 align-center>
                              <v-btn @click.native.stop="selecteAllAuth(aitem)" :outline="!isSelectedAllAuth(aitem)" small color="accent" round>{{isSelectedAllAuth(aitem)?'清空':'全选'}}</v-btn>
                            </v-flex>
                          </v-layout>
                        </div>
                        <v-card>
                          <v-card-text style="padding-bottom:0!important;margin:0!important;" class="grey lighten-3">
                            <v-layout row wrap class="children">
                              <v-flex xs6 sm4 md3 v-for="child in aitem.children" v-bind:key="child.id" style="padding-top:0;">
                                <v-switch :label="child.name" v-model="selectedAuths" :value="selectedAuths.find(o => o.id === child.id)?selectedAuths.find(o => o.id === child.id):child"></v-switch>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-tab-item>
                  <v-tab key="菜单" ripple>菜单</v-tab>
                  <v-tab-item key="菜单" style="padding:10px;">
                    <v-expansion-panel style="margin:0 ,10px!important;">
                      <v-expansion-panel-content v-for="mitem in menus" :key="mitem.id">
                        <div slot="header">
                          <v-layout row wrap align-center justify-center>
                            <v-flex xs12 sm6 justify-center>
                              <v-switch style="width:clear;" @click.native.stop="1==1" :label="mitem.title" v-model="selectedMenus" :value="selectedMenus.find(o => o.id === mitem.id)?selectedMenus.find(o => o.id === mitem.id):mitem"></v-switch>
                            </v-flex>
                            <v-flex xs12 sm6 align-center>
                              <v-btn @click.native.stop="selecteAllMenu(mitem)" :outline="!isSelectedAllMenu(mitem)" small color="accent" round>{{isSelectedAllMenu(mitem)?'清空':'全选'}}</v-btn>
                            </v-flex>
                          </v-layout>
                        </div>
                        <v-card>
                          <v-card-text style="padding-bottom:0!important;margin:0!important;" class="grey lighten-3">
                            <v-layout row wrap class="children">
                              <v-flex xs6 sm4 md3 v-for="child in mitem.children" v-bind:key="child.id" style="padding-top:0;">
                                <v-switch class="my-switch" @click.native="menuClick(child,mitem)" :label="child.title" v-model="selectedMenus" :value="selectedMenus.find(o => o.id === child.id)?selectedMenus.find(o => o.id === child.id):child"></v-switch>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-tab-item>
                </v-tabs>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-top:10px;">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="saveRole">保 存</v-btn>
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
          <v-btn color="accent" @click.native="delRole">确 定</v-btn>
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
        hasAllAuth: false,
        items: [],
        role: {
          id: null,
          sort: 0,
          name: '',
          authorities: []
        },
        authorities: [],
        selectedAuths: [],
        menus: [],
        selectedMenus: [],
        breadcrumbsItems: [{
            text: '系统设置',
            disabled: false
          },
          {
            text: '角色管理',
            disabled: false
          }
        ],
        requiredRules: [
          (v) => !!v || '此项必须填写',
          (v) => v && v.length <= 30 || '长度不能超过30字符'
        ]
      }
    },
    methods: {
      getRoles() {
        this.axios.get('setting/roles').then(response => {
          if (response.status == 200) {
            this.items = response.data.data;
          }
        })
      },
      getMenus() {
        this.axios.get('setting/menus').then(response => {
          if (response.status == 200) {
            this.menus = response.data.data;
          }
        })
      },
      getAuthorities() {
        this.axios.get('setting/authorities').then(response => {
          if (response.status == 200) {
            this.authorities = response.data.data;
          }
        })
      },
      saveRole() {
        this.valid = false;
        if (this.$refs.roleForm.validate()) {
          this.role.authorities = this.selectedAuths;
          this.role.menus = this.selectedMenus;
          let params = {
            role: this.role
          }
          this.axios.post('setting/roles', params).then(response => {
            if (response.status == 200) {
              this.items = response.data.data;
              this.$store.commit('setMenus', response.data.userMenus);
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
            }
          })
        }
      },
      delRole() {
        if (this.role != null && this.role.id != null) {
          this.axios.delete('setting/role/' + this.role.id).then(response => {
            if (response.status == 200) {
              this.items = response.data.data;
              this.$store.commit('setMenus', response.data.userMenus);
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
            }
          })
        }
        this.dialog = false;
      },
      openDel() {
        if (this.role != null && this.role.id != null) {
          this.dialog = true;
        }
      },
      addRole() {
        this.role = {
          id: null,
          sort: 0,
          name: '',
          authorities: [],
          menus: []
        }
        this.selectedAuths = [];
        this.menus = [];
        this.hasAllAuth = false;
      },
      roleClick(item) {
        this.role = item;
        this.selectedAuths = this.role.authorities;
        this.selectedMenus = this.role.menus;
        this.hasAllAuth = false;
      },
      menuClick(menu, parent) {
        if (this.selectedMenus.find(o => o.id === menu.id)) {
          if (this.selectedMenus.indexOf(parent) == -1) {
            this.selectedMenus.push(parent);
          }
        } else {
          if (!this.selectedMenus.some(r => parent.children.indexOf(r) >= 0)) {
            if (this.selectedMenus.find(o => o.id === parent.id)) {
              this.selectedMenus.splice(this.selectedMenus.indexOf(parent), 1)
            }
          }
        }
      },
      isSelectedAllAuth(auth) {
        return auth.children.every(elem => this.selectedAuths.find(o => o.id === elem.id));
      },
      selecteAllAuth(auth) {
        if (this.isSelectedAllAuth(auth)) {
          if (this.selectedAuths.find(o => o.id === auth.id)) {
            this.selectedAuths.splice(this.selectedAuths.indexOf(this.selectedAuths.find(o => o.id === auth.id)), 1);
          }
          auth.children.every(elem => {
            if (this.selectedAuths.find(o => o.id === elem.id)) {
              this.selectedAuths.splice(this.selectedAuths.indexOf(this.selectedAuths.find(o => o.id === elem.id)),
                1);
            }
            return true;
          });
        } else {
          //应该不需要加入父级权限（父级权限一律无url）
          // if (!this.selectedAuths.find(o => o.id === auth.id)) {
          //   this.selectedAuths.push(auth);
          // }
          auth.children.every(elem => {
            if (!this.selectedAuths.find(o => o.id === elem.id)) {
              this.selectedAuths.push(elem);
            }
            return true;
          });
        }
      },
      isSelectedAllMenu(menu) {
        return menu.children.every(elem => this.selectedMenus.find(o => o.id === elem.id));
      },
      selecteAllMenu(menu) {
        if (this.isSelectedAllMenu(menu)) {
          if (this.selectedMenus.find(o => o.id === menu.id)) {
            this.selectedMenus.splice(this.selectedMenus.indexOf(this.selectedMenus.find(o => o.id === menu.id)), 1);
          }
          menu.children.every(elem => {
            if (this.selectedMenus.find(o => o.id === elem.id)) {
              this.selectedMenus.splice(this.selectedMenus.indexOf(this.selectedMenus.find(o => o.id === elem.id)),
                1);
            }
            return true;
          });
        } else {
          if (!this.selectedMenus.find(o => o.id === menu.id)) {
            this.selectedMenus.push(menu);
          }
          menu.children.every(elem => {
            if (!this.selectedMenus.find(o => o.id === elem.id)) {
              this.selectedMenus.push(elem);
            }
            return true;
          });
        }
      }
    },
    mounted() {
      this.getRoles();
      this.getAuthorities();
      this.getMenus();
    }
  }

</script>
<style>
  .list__tile--avatar {
    height: 48px;
  }

  .switch>label {
    font-size: 14px !important;
  }

  .switch>.input-group__details {
    min-height: 5px !important;
  }

  .input-group.input-group--selection-controls {
    display: -webkit-box !important;
    display: -ms-flexbox !important;
    display: -moz-box !important;
  }

  .children {
    padding-bottom: 10px;
  }

</style>

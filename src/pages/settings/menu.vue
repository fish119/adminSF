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
                <v-btn color="primary" @click="addMenu">新 增</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="openDel">删 除</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-flex>
            <v-card-text>
              <v-navigation-drawer width="240px;" floating permanent>
                <v-list>
                  <v-list-group v-for="item in items" v-bind:key="item.id" :prepend-icon="item.icon" @click.native="menuClick(item,null)">
                    <v-list-tile slot="activator">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-for="subItem in item.childrenMenu" v-bind:key="subItem.id" @click.native.stop="menuClick(subItem,item)" @click="1==1">
                      <v-list-tile-action class="list-sub-item-icon">
                        <v-icon>{{ subItem.icon }}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                    </v-list-tile>
                  </v-list-group>
                </v-list>
              </v-navigation-drawer>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex sm9>
          <v-card class="card">
            <v-card-text style="padding-bottom:0;">
              <v-form v-model="valid" ref="menuForm">
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    父 级：
                  </v-flex>
                  <v-flex md11>
                    <v-select item-text="title" v-bind:items="items" v-model="parentMenu" label="请选择父级" single-line bottom></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    名 称：
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="名 称" v-model="menu.title" :rules="requiredRules" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    链 接：
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="链 接" v-model="menu.action"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    图 标：
                  </v-flex>
                  <v-flex md11>
                    <v-layout row wrap flex align-center justify-center>
                      <v-flex xs1>
                        <v-icon>{{menu.icon}}</v-icon>
                      </v-flex>
                      <v-flex xs11>
                        <v-text-field label="图 标" v-model="menu.icon" :rules="requiredRules" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    排 序：
                  </v-flex>
                  <v-flex md11>
                    <v-layout row wrap flex align-center justify-center>
                      <v-flex xs1>
                        {{menu.sort}}
                      </v-flex>
                      <v-flex xs11>
                        <v-slider v-model="menu.sort" step="1" max="20" thumb-label></v-slider>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-top:0;">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="saveMenu">保 存</v-btn>
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
          <v-btn color="accent" @click.native="delMenu">确 定</v-btn>
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
        breadcrumbsItems: [{
            text: '系统设置',
            disabled: false
          },
          {
            text: '菜单管理',
            disabled: false
          }
        ],
        menuSort: 0,
        menu: {
          action: '',
          icon: '',
          id: null,
          sort: 0,
          title: ''
        },
        parentMenu: null,
        requiredRules: [
          (v) => !!v || '此项必须填写',
          (v) => v && v.length <= 30 || '长度不能超过30字符'
        ]
      }
    },
    methods: {
      getMenus() {
        this.axios.get('setting/menus').then(response => {
          if (response.status == 200) {
            this.items = response.data.data;
          }
        })
      },
      menuClick(obj, parent) {
        this.menu = obj;
        this.parentMenu = parent;
      },
      addMenu() {
        this.menu = {
          action: '',
          icon: '',
          id: null,
          sort: 0,
          title: ''
        }
      },
      openDel() {
        if (this.menu != null && this.menu.id != null) {
          this.dialog = true;
        }
      },
      delMenu() {
        if (this.menu != null && this.menu.id != null) {
          if (this.parentMenu == null) {
            this.axios.delete('setting/menu/' + this.menu.id).then(response => {
              if (response.status == 200) {
                this.items = response.data.data;
                this.store.commit('showSnackbar', {
                  msg: '操作成功',
                  color: 'success'
                });
              }
            })
          } else {
            this.axios.delete('setting/menus/' + this.parentMenu.id + '/menus/' + this.menu.id).then(response => {
              if (response.status == 200) {
                this.items = response.data.data;
                this.store.commit('showSnackbar', {
                  msg: '操作成功',
                  color: 'success'
                });
              }
            })
          }
        }
        this.dialog = false;
      },
      saveMenu() {
        this.valid = false;
        if (this.$refs.menuForm.validate()) {
          let params = {
            parentId: this.parentMenu == null ? null : this.parentMenu.id,
            menu: this.menu
          }
          this.axios.post('setting/menus', params).then(response => {
            if (response.status == 200) {
              this.items = response.data.data;
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
            }
          })
        }
      }
    },
    mounted() {
      this.getMenus();
    }
  }

</script>

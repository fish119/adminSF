<template>
  <div class="main-container-div">
    <v-breadcrumbs class="main-breadcrumbs">
      <v-icon slot="divider">chevron_right</v-icon>
      <v-breadcrumbs-item v-for="item in breadcrumbsItems" :key="item.text" :disabled="item.disabled">
        {{ item.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-divider></v-divider>
    <v-container fluid style="padding:10px;">
      <v-layout row>
        <v-flex md3 style="padding-right:10px;">
          <v-card class="card">
            <v-card-actions style="padding-bottom:5px;">
              <v-spacer></v-spacer>
              <v-btn color="accent" @click="addMenu">新 增</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="delMenu">删 除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            <v-card-text>
              <v-navigation-drawer width="240px;" floating permanent>
                <v-list>
                  <v-list-group v-for="item in items" v-bind:key="item.title" :prepend-icon="item.icon" no-action>
                    <v-list-tile slot="activator">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-for="subItem in item.childrenMenu" v-bind:key="subItem.title" @click="menuCLick">
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
        <v-flex md9>
          <v-card class="card">
            <v-card-text>
              <v-form v-model="valid">
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1>
                    <v-text>父 级：</v-text>
                  </v-flex>
                  <v-flex md11>
                    <v-select item-text="title" v-bind:items="items" v-model="e1" label="请选择父级" single-line bottom></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1>
                    <v-text>名 称：</v-text>
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="名 称" v-model="name" :rules="nameRules" :counter="10" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1>
                    <v-text>链 接：</v-text>
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="链 接" v-model="name" :rules="nameRules" :counter="10" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1>
                    <v-text>图 标：</v-text>
                  </v-flex>
                  <v-flex md11>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1>
                    <v-text>排 序：</v-text>
                  </v-flex>
                  <v-flex md11>
                    <v-slider v-model="menuSort" step="1" max="20" thumb-label></v-slider>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" @click="addMenu">新 增</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="delMenu">删 除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
  export default {
    data() {
      return {
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
        menuSort:0
      }
    },
    methods: {
      getMenus() {
        this.axios.post('setting/menus').then(response => {
          console.log(response);
          if (response.data) {
            this.items = response.data.data;
          }
        })
      },
      menuCLick() {

      },
      addMenu() {},
      delMenu() {}
    },
    mounted() {
      this.getMenus();
    }
  }

</script>

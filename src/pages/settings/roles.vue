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
                <v-list-tile v-ripple avatar v-for="item in items" v-bind:key="item.name" @click="1==1">
                  <v-icon>supervisor_account</v-icon>
                  <v-list-tile-title style="margin-left:10px;">{{ item.name }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex sm9>
          <v-card>
            <v-card-text style="padding-bottom:0;">
              <v-form v-model="valid" ref="menuForm">
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
                <v-divider></v-divider>
                <v-subheader style="padding-left:0;height:36px;">权 限</v-subheader>
                <v-layout row wrap align-center v-for="aitem in authorities" v-bind:key="aitem.id" style="padding-top:0;">
                  <v-flex xs12>
                    <h4>{{aitem.name}}</h4>
                  </v-flex>
                  <v-flex xs12>
                    <v-layout row wrap>
                      <v-flex xs6 sm4 md3 v-for="child in aitem.children" v-bind:key="child.id" style="padding-top:0;">
                        <v-switch :label="child.name" v-model="role.authorities" :value="child"></v-switch>
                      </v-flex>
                    </v-layout>
                  </v-flex>                 
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-top:0;">
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        valid: true,
        items: [],
        role: {
          id: null,
          sort: 0,
          name: '',
          authorities: []
        },
        authorities: [],
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
      getAuthorities() {
        this.axios.get('setting/authorities').then(response => {
          if (response.status == 200) {
            this.authorities = response.data.data;
          }
        })
      },
      saveRole() {},
      openDel() {
        if (this.menu != null && this.menu.id != null) {
          this.dialog = true;
        }
      },
      addRole() {
        this.role = {
          id: null,
          sort: 0,
          name: ''
        }
      }
    },
    mounted() {
      this.getRoles();
      this.getAuthorities();
    }
  }

</script>
<style scoped>
  .list__tile--avatar {
    height: 48px;
  }

</style>

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
      <v-layout row wrap>
        <v-flex sm3 xs12 style="padding-right:10px;padding-bottom:10px;">
          <v-card class="card">
            <v-flex hidden-sm-only>
              <v-card-actions style="padding-bottom:5px;">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addDepart">新 增</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="openDel">删 除</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-flex>
            <v-card-text>
              <treemenu :items="items" v-on:nodeClick="departClick">
              </treemenu>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex sm9 xs12>
          <v-card>
            <v-card-text style="padding-bottom:0;">
              <v-form v-model="valid" ref="departForm">
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    父 级：
                  </v-flex>
                  <v-flex md11>
                    <v-menu :full-width=true :close-on-content-click="true" v-model="parentMenu" offset-y nudge-top="25">
                      <v-text-field :rules="[selectRules.parentNotSelf(parent,depart)]" v-model="parent.name" slot="activator"></v-text-field>
                      <v-card>
                        <treemenu :items="items" v-on:nodeClick="parentClick">
                        </treemenu>
                      </v-card>
                    </v-menu>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    名 称：
                  </v-flex>
                  <v-flex md11>
                    <v-text-field label="名 称" v-model="depart.name" :rules="requiredRules" required></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row wrap flex align-center justify-center>
                  <v-flex md1 hidden-xs-only>
                    排 序：
                  </v-flex>
                  <v-flex md11>
                    <v-layout row wrap flex align-center justify-center>
                      <v-flex xs1>
                        {{depart.sort}}
                      </v-flex>
                      <v-flex xs11>
                        <v-slider v-model="depart.sort" step="1" max="20" thumb-label></v-slider>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-top:0;">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="saveDpart">保 存</v-btn>
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
          <v-btn color="accent" @click.native="delDepart">确 定</v-btn>
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
    data() {
      return {
        dialog: false,
        valid: true,
        depart: {
          id: null,
          name: null,
          sort: null,
          children: [],
          parent: null
        },
        parent: {
          id: null,
          name: null,
          sort: null,
          children: [],
          parent: null
        },
        requiredRules: [
          (v) => !!v || '此项必须填写',
          (v) => v && v.length <= 30 || '长度不能超过30字符'
        ],
        breadcrumbsItems: [{
            text: '人员管理',
            disabled: false
          },
          {
            text: '部门管理',
            disabled: false
          }
        ],
        items: [],
        parentMenu: false,
        selectRules: {
          parentNotSelf(parent, self) {
            if (parent && self && parent.id && self.id && parent.id == self.id) {
              return '不能选择自己为父级';
            } else {
              return true;
            }
          }
        }
      }
    },
    methods: {
      departClick(data) {
        console.log(data.item.name);
        this.depart = data.item;
        // this.parent = data.parent ? data.parent : {
        //   id: null,
        //   name: null,
        //   sort: null,
        //   children: [],
        //   parent: null
        // }
      },
      parentClick(data) {
        this.parent = data.item;
      },
      getAllDeparts() {
        this.axios.get('setting/departments').then(response => {
          if (response.status == 200) {
            this.items = response.data.data;
          }
        })
      },
      saveDpart() {
        this.valid = false;
        if (this.$refs.departForm.validate()) {
          let params = {
            parentId: this.parent == null ? null : this.parent.id,
            department: this.depart
          }
          this.axios.post('setting/departments', params).then(response => {
            if (response.status == 200) {
              this.onHttpSuccess(response);
            }
          })
        }
      },
      delDepart() {
        this.axios.delete('setting/department/' + this.depart.id).then(response => {
          if (response.status == 200) {
            this.onHttpSuccess(response);
            this.dialog = false;
          }
        })
      },
      openDel() {
        if (this.depart != null && this.depart.id != null) {
          this.dialog = true;
        }
      },
      addDepart() {
        this.depart = {
          id: null,
          name: null,
          sort: null,
          children: [],
          parent: null
        }
      },
      onHttpSuccess(response) {
        this.items = response.data.data;
        this.store.commit('showSnackbar', {
          msg: '操作成功',
          color: 'success'
        });
      }
    },
    mounted() {
      this.getAllDeparts();
    }
  }

</script>

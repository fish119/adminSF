<template>
  <div class="main-container-div">
    <v-flex hidden-xs-only>
      <v-breadcrumbs class="main-breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item v-for="item in breadcrumbsItems" :key="item" :disabled="item.disabled">
          {{ item }}
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
              <v-navigation-drawer floating permanent width="100%">
                <treemenu :data="items" :isParent="false" @handle="departClick" style="padding-bottom:20px !important;"></treemenu>
              </v-navigation-drawer>
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
                    <v-menu :full-width="true" v-model="selectOpen" :close-on-content-click="false" offset-y nudge-top="25">
                      <v-text-field clearable readonly :rules="[selectRules.parentNotSelf(parent,depart)]" v-model="parentName" slot="activator"></v-text-field>
                      <v-card>
                        <treemenu :data="items" :isParent="true" @handle="parentClick" style="padding-bottom:20px !important;"></treemenu>
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
import treemenu from "../../components/treemenu";
export default {
  components: {
    treemenu
  },
  data() {
    return {
      parentName: null,
      dialog: false,
      valid: true,
      selectOpen: false,
      items: [],
      depart: {
        sort: 0
      },
      parent: {},
      requiredRules: [
        v => !!v || "此项必须填写",
        v => (v && v.length <= 30) || "长度不能超过30字符"
      ],
      breadcrumbsItems: ["人员管理", "部门管理"],
      selectRules: {
        parentNotSelf(parent, self) {
          if (parent && self && parent.id && self.id && parent.id == self.id) {
            return "不能选择自己为父级";
          } else {
            return true;
          }
        }
      }
    };
  },
  methods: {
    departClick(value) {
      this.depart = value;
      this.getParent(this.parents, value.parent);
      this.parentName = this.parent.name;
    },
    parentClick(value) {
      this.parent = value;
      this.parentName = this.parent.name;
      this.selectOpen = false;
    },
    getParent(arr, parentid) {
      this.parent = this.clearDepartObj(this.parent);
      if (parentid) {
        if (!Number.isInteger(parentid)) {
          parentid = parentid.id;
        }
        if (arr && arr.length > 0) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === parentid) {
              this.parent = arr[i];
              return;
            }
            this.parent = this.getParent(arr[i].children, parentid);
          }
        }
      }
    },
    getAllDeparts() {
      this.axios.get("setting/departments").then(response => {
        if (response.status == 200) {
          this.items = response.data.data;
          this.parents = response.data.data;
        }
      });
    },
    saveDpart() {
      if (!this.parentName) {
        this.parent = null;
      }
      this.valid = false;
      if (this.$refs.departForm.validate()) {
        var tmp = this.depart;
        tmp.parent = null;
        tmp.children = null;
        let params = {
          parentId: this.parent == null ? null : this.parent.id,
          department: tmp
        };
        this.axios.post("setting/departments", params).then(response => {
          if (response.status == 200) {
            this.onHttpSuccess(response);
          }
        });
      }
    },
    delDepart() {
      this.axios
        .delete("setting/department/" + this.depart.id)
        .then(response => {
          if (response.status == 200) {
            this.onHttpSuccess(response);
            this.dialog = false;
            this.depart = this.clearDepartObj();
            this.parent = this.clearDepartObj();
          }
        });
    },
    openDel() {
      if (this.depart != null && this.depart.id != null) {
        this.dialog = true;
      }
    },
    addDepart() {
      this.depart = this.clearDepartObj();
      this.parent = this.clearDepartObj();
      if (this.parent) {
        this.parentName = this.parent.name;
      }
    },
    parentSelected(item) {
      this.parent = item;
      this.parentName = item.name;
      this.parentName = this.parent.name;
    },
    onHttpSuccess(response) {
      this.items = response.data.data;
      this.store.commit("showSnackbar", {
        msg: "操作成功",
        color: "success"
      });
    },
    clearDepartObj() {
      return {
        id: null,
        name: null,
        sort: 0,
        children: [],
        parent: null
      };
    }
  },
  mounted() {
    this.getAllDeparts();
    this.parent = this.clearDepartObj();
  }
};
</script>
<style>
.vue-tree-item {
  margin: 10px !important;
}
</style>

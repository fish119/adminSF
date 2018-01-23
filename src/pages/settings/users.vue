<template>
  <div class="main-container-div">
    <v-layout row>
      <v-flex hidden-xs-only sm6>
        <v-breadcrumbs class="main-breadcrumbs">
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item v-for="item in breadcrumbsItems" :key="item.text" :disabled="item.disabled">
            {{ item.text }}
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
                <img :src="props.item.avatar" />
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
                <v-btn icon class="mx-0" slot="activator">
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
    <v-dialog v-model="editDialog"  max-width="500px">
      <v-card>
        <v-card-title style="padding-bottom:15px;">
          <span class="headline" style="padding-top:0;">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text style="padding-top:0;padding-bottom:0;">
          <v-form v-model="valid" ref="userForm">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="用户名" v-model="user.username"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="昵称/姓名" v-model="user.nickname"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="电话号码" v-model="user.phone"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="email" v-model="user.email"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="部门" v-model="user.department.name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="上次修改密码时间" readonly v-model="user.lastPasswordResetDate"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="角色" v-model="user.roles"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-top:0;">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="editDialog=false;">取 消</v-btn>
          <v-btn color="info">重置密码</v-btn>
          <v-btn color="accent" @click="save">保 存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data: () => ({
      valid:false,
      user: {
        department: {}
      },
      editDialog: false,
      formTitle: '新增',
      search: '',
      loading: false,
      totalItems: 10,
      breadcrumbsItems: [{
        text: '人员管理',
        disabled: false
      }, {
        text: '用户管理',
        disabled: false
      }],
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
      items: []
    }),
    methods: {
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
      save() {
        //TODO;
        this.loading = false;
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
          department: {}
        };
        this.formTitle = item ? '编辑' : '新增';
        this.editDialog = true;
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
    }
  }

</script>
<style scoped>
  .tb-header {
    font-size: 14px;
    font-weight: 500;
  }

</style>
<style>
  .searchbar>label {
    top: 0!important;
  }
.input-group{
  padding-top:0;
}
.input-group--text-field label{
  top:0;
}
</style>

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
        <v-layout row>
          <v-flex xs6 style="margin-right:10px;">
            <v-menu :full-width="true" v-model="selectOpen" :close-on-content-click="false" offset-y nudge-top="25">
              <v-text-field clearable placeholder="分类" readonly v-model="categorName" slot="activator"></v-text-field>
              <v-card>
                <treemenu :data="categories" :isParent="true" @handle="categoryClick" style="padding-bottom:20px !important;"></treemenu>
              </v-card>
            </v-menu>
          </v-flex>
          <v-flex xs6>
            <v-text-field class="searchbar" style="padding-top: 0;" append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-container>
      <v-data-table :rows-per-page-items="rows_per_page_items" :rows-per-page-text="rows_per_page_text" :loading="loading" :total-items="totalItems"
        :headers="headers" :items="items" :pagination.sync="pagination" item-key="id" class="elevation-1">
        <template slot="headers" slot-scope="props">
          <tr>
            <th class="tb-header" v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)">
              <v-icon small>arrow_upward</v-icon>
              {{ header.text }}
            </th>
            <th class="tb-header">操作</th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td class="text-xs-center">{{ props.index }}</td>
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.category.name }}</td>
            <td>{{ props.item.author.nickname }}</td>
            <td class="text-xs-center">{{ props.item.createTime }}</td>
            <td class="text-xs-center">{{ props.item.lastChangeTime }}</td>
            <td class="justify-center layout px-0">
              <v-tooltip top>
                <v-btn icon class="mx-0" slot="activator">
                  <v-icon color="secondary">edit</v-icon>
                </v-btn>
                <span>编辑</span>
              </v-tooltip>
              <v-tooltip top>
                <v-btn icon class="mx-0" @click="article=props.item;delDialog=true;" slot="activator">
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
      <v-btn :to="{name:'/article/edit',params: {article:{},categories:categories}}" style="margin-bottom:40px;" color="accent" dark small absolute bottom
        right fab fixed>
        <v-icon>add</v-icon>
      </v-btn>
    </v-container>
    <v-dialog v-model="delDialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">确定要删除记录吗？删除后不可恢复。</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="delDialog = false">取 消</v-btn>
          <v-btn color="accent" @click.native="del();">确 定</v-btn>
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
        selectOpen: false,
        items: [],
        categories: [],
        categorName: '',
        search: '',
        category: {},
        pagination: {
          descending: true,
          page: 1,
          rowsPerPage: 10,
          sortBy: "id"
        },
        headers: [{
          text: '序号',
          align: 'center',
          value: 'id'
        }, {
          text: '标题',
          align: 'center',
          value: 'title'
        }, {
          text: '分类',
          align: 'center',
          value: 'category.id'
        }, {
          text: '作者',
          align: 'center',
          value: 'author.id'
        }, {
          text: '创建时间',
          align: 'center',
          value: 'createTime'
        }, {
          text: '最后修改',
          align: 'center',
          value: 'lastChangeTime'
        }],
        totalItems: 10,
        loading: false,
        breadcrumbsItems: ['内容管理', '内容列表'],
        delDialog: false,
        rows_per_page_items: [5, 10, 25, 50, 100],
        rows_per_page_text: "每页行数"
      }
    },
    methods: {
      getData() {
        let params = {
          categoryId: this.category.id,
          searchStr: this.search,
          page: this.pagination.page - 1,
          size: this.pagination.rowsPerPage,
          sortColumn: this.pagination.sortBy,
          direction: this.pagination.descending ? "DESC" : "ASC"
        }
        this.loading = true;
        this.axios.get('article/articles', params).then(response => {
          if (response.status == 200) {
            this.items = response.data.articles.content;
            this.totalItems = response.data.articles.totalElements;
            this.categories = response.data.categories;
            this.loading = false;
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
      categoryClick(value) {
        this.category = value;
        this.selectOpen = false;
        this.categorName = value.name;
      },
      del() {

      }
    },
    watch: {
      pagination: {
        handler() {
          this.getData();
        },
        deep: true
      },
      search: {
        handler() {
          this.getData();
        }
      },
      category: {
        handler() {
          this.getData();
        }
      },
      categorName: {
        handler() {
          if (!this.categorName) {
            this.category = {
              id: null
            };
            this.getData();
          }
        }
      }
    }
  }

</script>

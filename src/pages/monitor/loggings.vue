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
            <v-select :items="levels" v-model="levelString" label="级别" single-line bottom clearable></v-select>
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
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.selected = !props.selected">
            <td class="text-xs-center">{{ props.item.dateTime }}</td>
            <td class="text-xs-center">{{ props.item.callerFilename }}</td>
            <td class="text-xs-center">{{ props.item.callerMethod }}</td>
            <td class="text-xs-center">{{ props.item.levelString }}</td>
            <td class="text-xs-center">{{ props.item.arg0 }}</td>
            <td class="text-xs-center">{{ props.item.arg1 }}</td>
            <td class="text-xs-center">{{ props.item.arg2 }}</td>
            <td class="text-xs-center">{{ props.item.arg3 }}</td>
          </tr>
        </template>
        <template slot="no-data">
          <v-layout row>
            <v-icon>warning</v-icon>
            <v-subheader>Sorry, nothing to display here :(</v-subheader>
          </v-layout>
        </template>
      </v-data-table>
      <v-btn style="margin-bottom:40px;" color="error" @click="delDialog = true" dark small absolute bottom right fab fixed>
        <v-icon>delete</v-icon>
      </v-btn>
    </v-container>
    <v-dialog v-model="delDialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">确定要删除所有日志吗？删除后不可恢复。</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="delDialog = false">取 消</v-btn>
          <v-btn color="accent" @click.native="deleteLogs()">确 定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        breadcrumbsItems: ['日志管理', '系统日志'],
        items: [],
        search: '',
        levelString: '',
        loading: false,
        totalItems: 10,
        pagination: {
          descending: true,
          page: 1,
          rowsPerPage: 10,
          sortBy: "id"
        },
        rows_per_page_items: [5, 10, 25, 50, 100],
        rows_per_page_text: "每页行数",
        levels: [{
            text: 'INFO'
          },
          {
            text: 'WARN'
          },
          {
            text: 'ERROR'
          }
        ],
        headers: [{
            text: 'DateTime',
            align: 'center',
            value: 'timestmp'
          },{
            text: 'Filename',
            align: 'center',
            value: 'callerFilename'
          },
          {
            text: 'Method',
            align: 'center',
            value: 'callerMethod'
          }, {
            text: 'Level',
            align: 'center',
            value: 'levelString'
          }, {
            text: 'arg0',
            align: 'center',
            value: 'arg0'
          }, {
            text: 'arg1',
            align: 'center',
            value: 'arg1'
          },
          {
            text: 'arg2',
            align: 'center',
            value: 'arg2.name'
          },
          {
            text: 'arg3',
            align: 'center',
            value: 'arg3.name'
          }
        ],
        delDialog: false
      }
    },
    methods: {
      getLogs() {
        let params = {
          level: this.levelString.text,
          searchStr: this.search,
          page: this.pagination.page - 1,
          size: this.pagination.rowsPerPage,
          sortColumn: this.pagination.sortBy,
          direction: this.pagination.descending ? "DESC" : "ASC"
        }
        this.loading = true;
        this.axios.get('logs', params).then(response => {
          if (response.status == 200) {
            this.items = response.data.data.content;
            this.totalItems = response.data.data.totalElements;
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
      deleteLogs() {
        this.loading = true;
        this.axios.delete('logs').then(response => {
          if (response.status == 200) {
            this.items = [];
            this.totalItems = 10;
            this.loading = false;
            this.delDialog = false;
            this.store.commit('showSnackbar', {
              msg: '操作成功',
              color: 'success'
            });
          }
        })
      }
    },
    watch: {
      pagination: {
        handler() {
          this.getLogs();
        },
        deep: true
      },
      search: {
        handler() {
          this.getLogs();
        }
      },
      levelString: {
        handler() {
          console.log(this.levelString.text);
          this.getLogs();
        }
      }
    }
  }

</script>

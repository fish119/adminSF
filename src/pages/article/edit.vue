<template>
  <div class="main-container-div">
    <v-layout row>
      <v-breadcrumbs class="main-breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item :to="{path:item.path}" v-for="item in breadcrumbsItems" :key="item.text" :disabled="item.disabled">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-spacer></v-spacer>
      <a outline color="primary" @click="$router.go(-1)">返回</a>
    </v-layout>
    <v-divider></v-divider>
    <v-container>
      <v-card>
        <v-card-text style="padding-top:20px;">
          <v-form v-model="valid" ref="articleForm" lazy-validation>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-text-field label="标题" :rules="requiredRules" maxlength="30" v-model="article.title"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5 offset-sm1>
                <v-menu style="z-index:9999;" :full-width="true" v-model="selectOpen" :close-on-content-click="false" offset-y nudge-top="25">
                  <v-text-field :rules="requiredRules" clearable placeholder="分类" readonly v-model="categorName" slot="activator"></v-text-field>
                  <v-card>
                    <treemenu :data="categories" :isParent="true" @handle="categoryClick" style="padding-bottom:20px !important;"></treemenu>
                  </v-card>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <vue-html5-editor :content="article.content" @change="updateData" :height="300"></vue-html5-editor>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="$router.go(-1)">返 回</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="accent" @click="save">保 存</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-container>
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
        categoryId:null,
        categorName: '',
        valid: false,
        article: {
          title: ''
        },
        categories: [],
        breadcrumbsItems: [{
          text: '内容管理',
          path: '/article/article'
        }, {
          text: '编辑内容'
        }],
        requiredRules: [
          (v) => !!v || '此项必须填写',
          (v) => v && v.length <= 30 || '长度不能超过30字符'
        ]
      }
    },
    methods: {
      updateData(data) {
        this.article.content = data;
      },
      save() {
        this.valid = false;
        if (this.$refs.articleForm.validate()) {
          this.article.category=null;
          this.article.author = null;
          let params = {
            categoryId:this.categoryId,
            article: this.article
          }
          this.axios.post('article/articles', params).then(response => {
            if (response.status == 200) {
              this.article = response.data.data;
              this.store.commit('showSnackbar', {
                msg: '操作成功',
                color: 'success'
              });
            }
          })
        }
      },
      categoryClick(value) {
        this.categoryId = value.id;
        this.selectOpen = false;
        this.categorName = value.name;
      }
    },
    mounted() {
      this.article = this.$route.params.article;
      this.categories = this.$route.params.categories;
      if (!this.article) {
        this.article = {
          title: ''
        };
      }
      if(this.article.category){
        this.categorName = this.article.category.name;
        this.categoryId = this.article.category.id;
      }
    }
  }

</script>

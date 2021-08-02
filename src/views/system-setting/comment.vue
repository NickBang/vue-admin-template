<template>
  <div class="cont">
    <div class="top">
      <el-input v-model="keyword"
                placeholder="评论过滤词"
                clearable />
      <el-button type="primary"
                 class="add-btn"
                 @click="add">添加</el-button>
    </div>
    <el-table :data="tableData"
              :border="true"
              :stripe="true"
              style="width: 100%">
      <el-table-column prop="keyword"
                       label="过滤词"
                       align="center" />
      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     style="color: red;"
                     size="small"
                     @click.native.prevent="del(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <div>
        <el-pagination background
                       :current-page="pagination.page_num"
                       :page-size="pagination.page_size"
                       layout="total, prev, pager, next, jumper"
                       :total="pagination.total"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { getFilterWord, addFilterWord, delFilterWord } from '@/api/all'
export default {
  name: 'KeyWord',
  data() {
    return {
      keyword: '',
      pagination: {
        page_num: 1,
        page_size: 10,
        max_page: 1,
        total: 0,
      },
      value2: '',
      tableData: [],
    }
  },
  mounted() {
    this.queryList()
  },
  computed: {},
  methods: {
    async queryList() {
      let data = { ...this.pagination }
      const res = await getFilterWord(data)
      if (res.code === 0) {
        if (res.data.items) {
          this.tableData = res.data.items
          this.pagination = res.data.pagination
        } else {
          this.tableData = []
        }
      } else {
        this.$message.error(res.message)
      }
    },
    async add() {
      const data = {
        keyword: this.keyword,
      }
      const res = await addFilterWord(data)
      if (res.code === 0) {
        this.$message.success('添加过滤词成功')
        this.queryList()
      } else {
        this.$message.error(res.message)
      }
    },
    async del(index) {
      const { keyword_id } = this.tableData[index]
      const data = {
        keyword_id,
      }
      const res = await delFilterWord(data)
      if (res.code === 0) {
        this.$message.success('删除过滤词成功')
        this.queryList()
      } else {
        this.$message.error(res.message)
      }
    },
    handleSizeChange() {},
    handleCurrentChange(e) {
      console.log(e)
      this.pagination.page_num = e
      this.queryList()
    },
  },
}
</script>

<style lang="scss" scoped>
.cont {
  width: 90%;
  margin: 0 auto;
  .top {
    width: 50%;
    margin: 30px auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .add-btn {
      margin-left: 20px;
    }
  }

  .page {
    background: #fff;
    padding: 32px 16px;
    text-align: right;
  }
}
</style>

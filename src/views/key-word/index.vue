<template>
  <div class="cont">
    <div class="top">
      <el-input v-model="input"
                placeholder="请输入关键词"
                clearable />
      <el-button type="primary"
                 class="add-btn"
                 @click="add">添加</el-button>
    </div>
    <div v-if="info.total >= 0">关键词数量：{{info.using}}/{{info.total}}</div>
    <el-table :data="tableData"
              :border="true"
              :stripe="true"
              :header-cell-style="headerStyleFn"
              style="width: 100%">
      <el-table-column prop="keyword"
                       label="关键词"
                       align="center" />

      <el-table-column label="使用方"
                       v-if="role_code != '5'"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     @click.native.prevent="checkFrom(scope.$index)">
            查看使用方
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     style="color: red;"
                     @click.native.prevent="deleteRow(scope.$index)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="`【${currentCheckUserName}】：使用方`"
               :visible.sync="dialogVisible"
               width="50%"
               center>
      <span v-if="userList.length > 0">
        <span v-for="item in userList"
              v-bind:key="item.keyword_id"
              style="margin-right:30px;font-size:20px;">{{item.using_name}}</span>

      </span>
      <span v-else
            style="font-size:20px;">此关键词暂无使用方哦！</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
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
import {
  videoWordList,
  deleteVideoWord,
  addVideoWord,
  getVideoWordDownList,
} from '@/api/all'
import { getCookie } from '@/utils/auth'
export default {
  name: 'KeyWord',
  data() {
    return {
      pagination: {
        page_num: 1,
        page_size: 10,
        max_page: 1,
        total: 0,
      },
      input: '',
      currentCheckUserName: '',
      tableData: [],
      info: {
        total: 0,
        using: 0,
      },
      userList: [],
      dialogVisible: false,
      role_code: '',
    }
  },
  mounted() {
    this.role_code = getCookie('role_code')
    this.queryList()
  },
  computed: {},
  methods: {
    async queryList() {
      this.loading = true
      let data = { ...this.pagination }
      const res = await videoWordList(data)
      this.loading = false
      if (res.code === 0) {
        if (res.data.items) {
          this.tableData = res.data.items
          this.pagination = res.data.pagination
          this.info = res.data.info
        } else {
          this.tableData = []
        }
      } else {
        this.$message.error(res.message)
      }
    },
    async checkFrom(index) {
      const data = {
        keyword_id: this.tableData[index].keyword_id,
      }
      console.log(this.tableData[index])
      const res = await getVideoWordDownList(data)
      if (res.code === 0) {
        if (res.data && res.data.items) {
          this.userList = res.data.items
          this.currentCheckUserName = this.tableData[index].keyword
          this.dialogVisible = true
        } else {
          this.userList = []
          this.currentCheckUserName = this.tableData[index].keyword
          this.dialogVisible = true
        }
      } else {
        this.$message.error(res.message)
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.userList = []
    },
    async add() {
      let data = {
        keyword: this.input,
      }
      const res = await addVideoWord(data)
      if (res.code === 0) {
        this.$message.success('添加成功')
        this.queryList()
      } else {
        this.$message.error(res.message)
      }
    },
    async deleteRow(index) {
      this.$confirm(
        `确认删除【 ${this.tableData[index].keyword} 】关键词么, 请确认关键词与使用方的关系再确定操作`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          let data = {
            keyword_id: this.tableData[index].keyword_id,
          }
          const res = await deleteVideoWord(data)
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.queryList()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '再检查检查',
          })
        })
    },
    headerStyleFn() {
      return `font-weight:bold;color:#606266;font-size:16px;background: #eef1f6;`
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
    width: 500px;
    margin: 30px 0;
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

<template>
  <div class="cont">
    <div class="top">
      <el-date-picker v-model="time"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="选择日期">
      </el-date-picker>
      <el-input v-model="input"
                placeholder="请输入操作人"
                style="width: 200px;"
                clearable />
      <el-button type="primary"
                 class="add-btn"
                 @click="queryList('search')">查询</el-button>
    </div>
    <el-table :data="tableData"
              :border="true"
              :stripe="true"
              :header-cell-style="headerStyleFn"
              style="width: 100%">
      <el-table-column prop="company_time"
                       label="时间"
                       align="center" />
      <el-table-column prop="operator_name"
                       label="操作人"
                       align="center" />
      <el-table-column prop="typeformat"
                       label="操作类型"
                       align="center" />
      <el-table-column prop="value"
                       label="日志"
                       align="center" />

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
import { getLog } from '@/api/all'
export default {
  name: 'Log',
  data() {
    return {
      input: '',
      time: '',
      pagination: {
        page_num: 1,
        page_size: 10,
        max_page: 1,
        total: 0,
      },
      tableData: [],
    }
  },
  mounted() {
    this.queryList()
  },
  computed: {},
  methods: {
    async queryList(type) {
      if (type === 'search') {
        this.pagination = {
          page_num: 1,
          page_size: 10,
          max_page: 1,
          total: 0,
        }
      }
      const data = {
        begin_time: this.time,
        operator: this.input,
        ...this.pagination,
      }
      const res = await getLog(data)
      if (res.code === 0) {
        if (res.data.items) {
          res.data.items.forEach((val) => {
            switch (val.type) {
              case 1:
                val.typeformat = '添加用户'
                break
              case 2:
                val.typeformat = '更新用户'
                break
              case 3:
                val.typeformat = '下线'
                break
              case 4:
                val.typeformat = '上线'
                break
              case 5:
                val.typeformat = '删除用户'
                break
              case 6:
                val.typeformat = '添加企业'
                break
              case 7:
                val.typeformat = '更新'
                break
              case 8:
                val.typeformat = '删除'
                break
              case 21:
                val.typeformat = '修改密码'
                break
              case 22:
                val.typeformat = '重置密码'
                break
              default:
                val.typeformat = '未知'
                break
            }
          })
          this.tableData = res.data.items
          this.pagination = res.data.pagination
        } else {
          this.tableData = []
        }
      } else {
        this.$message.error(res.message)
      }
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
    width: 90%;
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

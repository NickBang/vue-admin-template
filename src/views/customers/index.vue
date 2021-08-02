<template>
  <div class="cont">
    <div class="top">
      <el-date-picker v-model="pickerData"
                      type="daterange"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary"
                 class="btn"
                 @click="queryList">查询</el-button>
    </div>

    <el-table :data="tableData"
              :border="true"
              :stripe="true"
              v-loading="loading"
              :header-cell-style="headerStyleFn"
              style="width: 100%">
      <el-table-column prop="review_time"
                       label="评论时间"
                       align="center"
                       width="180" />
      <el-table-column prop="video_keyword"
                       label="关键词"
                       align="center"
                       width="180" />
      <el-table-column prop="review_content"
                       header-align="center"
                       align="left"
                       label="评论" />
      <el-table-column prop="review_user_id"
                       align="center"
                       label="用户id" />
      <el-table-column prop="review_user_nickname"
                       align="center"
                       label="用户昵称">
        <template slot-scope="scope">
          <div style="margin-bottom:10px;">{{scope.row.review_user_nickname}}</div>
          <el-popover placement="left"
                      width="300"
                      trigger="click">
            <img style="width:280px"
                 :src="qrcodeUrl"
                 alt="">
            <div style="text-align:center;font-size: 24px;">打开抖音扫一扫</div>
            <el-button slot="reference"
                       type="success"
                       @click="onClickQrcode(scope.$index, scope.row)"
                       size="mini">二维码</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       label="视频源">
        <template slot-scope="scope">
          <a :href="scope.row.video_url"
             target="_blank"
             style="margin-right:10px;">
            <el-button type="text">
              查看
            </el-button>
          </a>

          <el-popover placement="left"
                      width="300"
                      trigger="click">
            <img style="width:280px"
                 :src="scope.row.video_author_qr"
                 alt="">
            <div style="text-align:center;font-size: 24px;">打开抖音扫一扫</div>
            <el-button slot="reference"
                       type="text">关注</el-button>
          </el-popover>

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
import { reviewPageList, qrGenerate } from '@/api/all'
export default {
  name: 'Customers',
  data() {
    return {
      pagination: {
        page_num: 1,
        page_size: 10,
        max_page: 1,
        total: 0,
      },
      pickerData: '',
      qrcodeUrl: '',
      tableData: [],
      loading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
    }
  },
  mounted() {
    this.queryList()
  },
  computed: {},
  methods: {
    onClickQrcode(index, row) {
      let data = {
        review_id: row.review_id,
      }
      qrGenerate(data).then((res) => {
        this.qrcodeUrl =
          'data:image/jpeg;base64,' + this.arrayBufferToBase64(res)
        console.log(this.qrcodeUrl)
      })
    },
    queryList() {
      this.loading = true
      let data = { ...this.pagination }
      if (this.pickerData) {
        data = {
          begin_time: this.pickerData[0],
          end_time: this.pickerData[1],
          ...this.pagination,
        }
      }
      console.log(data)
      reviewPageList(data).then((res) => {
        this.loading = false
        if (res.code === 0) {
          if (res.data.items) {
            this.tableData = res.data.items
            this.pagination = res.data.pagination
          } else {
            this.tableData = []
            this.pagination = {
              page_num: 1,
              page_size: 10,
              max_page: 1,
              total: 0,
            }
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleSizeChange() {
      console.log(123)
    },
    handleCurrentChange(e) {
      console.log(e)
      this.pagination.page_num = e
      this.queryList()
    },
    headerStyleFn() {
      return `font-weight:bold;color:#606266;font-size:16px;background: #eef1f6;`
    },
    arrayBufferToBase64(buffer) {
      var binary = ''
      var bytes = new Uint8Array(buffer)
      var len = bytes.byteLength
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    },
  },
}
</script>

<style lang="scss" scoped>
.cont {
  width: 90%;
  margin: 0 auto;
  .top {
    margin: 30px 0;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    align-items: left;
    .btn {
      width: 200px;
    }
  }

  .page {
    background: #fff;
    padding: 32px 16px;
    text-align: right;
  }
}
.table-header {
  font-weight: 800;
  color: #000;
}
</style>

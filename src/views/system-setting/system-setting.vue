<template>
  <div class="cont">
    <el-card class="card">
      <div>套餐类型: {{systemInfo.formattype}}</div>
      <div>套餐到期时间: {{systemInfo.expire_date}}</div>
      <div>最大查询次数: {{systemInfo.max_query}}</div>
      <div>已使用流量: {{systemInfo.used_query}}</div>
      <div>剩余流量: {{systemInfo.enable_query}}</div>
    </el-card>
    <div class="top">
      <div class="time">
        <div>定时任务 抓取视频查询频率(单位/分钟)</div>
        <el-input v-model="video_rate"
                  type="number"
                  class="input" />
        <div>定时任务 抓取评论查询频率(单位/分钟)</div>
        <el-input v-model="review_rate"
                  type="number"
                  class="input" />
        <div>评论拉取时间范围，当前时间前多少天 不得小于3天 (单位/天)</div>
        <el-input v-model="review_invalid_time"
                  @change="inputChange"
                  type="number"
                  class="input" />
      </div>
      <div class="btn">
        <el-button type="primary"
                   @click="setSystemRate()">保 存</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import { getSystemInfo, getSystemRate, setSystemRate } from '@/api/all'
export default {
  name: 'KeyWord',
  data() {
    return {
      labelPosition: 'right',
      systemInfo: {},
      video_rate: 0,
      review_rate: 0,
      review_invalid_time: 3,
    }
  },
  mounted() {
    this.getSystemRate()
    this.getSystemInfo()
  },
  computed: {},
  methods: {
    async getSystemInfo() {
      const res = await getSystemInfo()
      console.log(res)
      if (res.code === 0 && res.data) {
        this.systemInfo = res.data
        if (this.systemInfo.type === 'package') {
          this.systemInfo.formattype = '流量包'
        } else if (this.systemInfo.type === 'monthly') {
          this.systemInfo.formattype = '包月'
        }
      } else {
        this.$message.error(res.message)
      }
    },
    async getSystemRate() {
      const res = await getSystemRate()
      if (res.code === 0 && Object.keys(res.data).length > 0) {
        this.video_rate = res.data.video_rate
        this.review_rate = res.data.review_rate
        this.review_invalid_time = res.data.review_invalid_time || 3
      } else {
        this.$message.error(res.message)
      }
    },
    async setSystemRate() {
      if (Number(this.review_invalid_time) < 3) {
        this.$message.error('评论拉取时间不得小于3天')
        return
      }
      const data = {
        video_rate: this.video_rate,
        review_rate: this.review_rate,
        review_invalid_time: this.review_invalid_time
      }
      const res = await setSystemRate(data)
      if (res.code === 0) {
        this.$message.success('设置成功')
      } else {
        this.$message.success(res.message)
      }
    },
    inputChange(e){
      console.log(typeof e)
      if (Number(e) < 3) {
        this.review_invalid_time = 3
      }
    },
    handleSizeChange() {},
    handleCurrentChange() {},
  },
}
</script>

<style lang="scss" scoped>
.cont {
  width: 90%;
  margin: 0 auto;

  .card {
    width: 500px;
    margin: 30px auto;
    font-size: 18px;
    div {
      margin-bottom: 10px;
    }
  }
  .top {
    width: 80%;
    margin: 30px auto;
    text-align: center;
    .input {
      width: 400px;
      margin: 20px auto 30px;
    }
    .time {
      width: 100%;
    }
    .btn {
      width: 100%;
      margin: 0 auto;
    }
  }

  .page {
    background: #fff;
    padding: 32px 16px;
    text-align: right;
  }
}
</style>

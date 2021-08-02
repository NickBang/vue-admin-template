<template>
  <div class="cont">
    <div class="input-cont">
      <div class="input-item">
        <div>公司名称</div>
        <el-input v-model="queryOption.company_name"
                  placeholder="请输入公司名称"
                  class="custom-i"
                  clearable />
      </div>
    </div>
    <div class="top">
      <el-button type="success"
                 style="width: 150px"
                 @click="getCompanyList('query')"
                 class="add-btn">查询</el-button>
      <el-button type="primary"
                 class="add-btn"
                 @click="onClickRoot()">添加公司</el-button>

    </div>

    <el-table :data="companyList"
              v-loading="loading"
              :border="true"
              :stripe="true"
              :header-cell-style="headerStyleFn"
              style="width: 100%">
      <el-table-column prop="create_time"
                       label="添加日期"
                       align="center" />
      <el-table-column prop="company_name"
                       label="公司名称"
                       align="center" />
      <el-table-column prop="company_host"
                       label="host"
                       align="center" />
      <el-table-column prop="company_keyword_count"
                       label="关键词数"
                       width="100"
                       align="center" />
      <el-table-column prop="company_logo"
                       width="100"
                       label="logo"
                       align="center">
        <template slot-scope="scope">
          <img style="width:50px"
               :src="scope.row.company_logo"
               alt="">
        </template>
      </el-table-column>
      <!-- <el-table-column prop="company_status"
                       label="公司状态"
                       width="100"
                       align="center" /> -->

      <el-table-column label="操作"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     @click.native.prevent="editCompany(scope)">
            修改
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

    <el-dialog title="编辑公司信息"
               :visible.sync="dialogFormRoot"
               :close-on-click-modal="false">
      <el-form :model="rootForm"
               :rules="rules">
        <el-form-item label="公司名"
                      prop="company_name"
                      :label-width="formLabelWidth">
          <el-input v-model="rootForm.company_name"
                    class="index-input"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司域名"
                      :label-width="formLabelWidth">
          <el-input v-model="rootForm.company_host"
                    class="index-input"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司Logo"
                      :label-width="formLabelWidth">
          <div style="display:flex;">
            <el-input v-model="rootForm.company_logo"
                      class="index-input"
                      autocomplete="off"></el-input>
            <img :src="rootForm.company_logo"
                 width="50px"
                 alt="">
          </div>

        </el-form-item>
        <el-form-item label="关键词数量"
                      :label-width="formLabelWidth">
          <el-input v-model="rootForm.company_keyword_count"
                    class="index-input"
                    type="number"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormRoot = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveRootUser">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  userPageList,
  addCompany,
  getCompanyList,
  updateCompany,
} from '@/api/all'
import { addUser, updateUser } from '@/api/user'
import { getCookie } from '@/utils/auth'
export default {
  name: 'UserManage',
  data() {
    return {
      pagination: {
        page_num: 1,
        page_size: 10,
        max_page: 1,
        total: 0,
      },
      queryOption: {
        company_name: '',
      },
      dialogFormRoot: false,
      rootForm: {
        company_keyword_count: 5,
        company_name: '',
        company_host: '',
        company_logo: '',
      },
      editType: 'add',
      formLabelWidth: '120px',
      tableData: [],
      role_code: '',
      companyList: [],
      loading: false,
      rules: {
        company_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur',
          },
        ],
        phone_number: [
          {
            required: true,
            message: '请输入正确的手机号',
            pattern: /^[1]([3-9])[0-9]{9}$/,
          },
        ],
      },
    }
  },
  mounted() {
    this.getCompanyList()
  },
  methods: {
    async editCompany(scope) {
      this.rootForm = scope.row
      this.editType = 'edit'
      this.dialogFormRoot = true
    },
    async getCompanyList(type) {
      this.loading = true
      if (type === 'query') {
        this.pagination = {
          page_num: 1,
          page_size: 10,
          max_page: 1,
          total: 0,
        }
      }
      const data = {
        ...this.pagination,
        ...this.queryOption,
      }
      const res = await getCompanyList(data)
      this.loading = false
      if (res.code === 0) {
        if (res.data.items) {
          this.companyList = res.data.items
          this.pagination = res.data.pagination
        } else {
          this.companyList = []
        }
      } else {
        this.$message.error(res.message)
      }
    },
    onClickRoot() {
      this.dialogFormRoot = true
      this.editType = 'add'
    },
    async saveRootUser() {
      if (this.rootForm.company_name.length === 0) return
      if (this.editType === 'add') {
        const res = await addCompany(this.rootForm)
        if (res.code === 0) {
          this.dialogFormRoot = false
          this.$message.success('添加公司成功')
        } else {
          this.$message.error(res.message)
        }
      } else {
        const res = await updateCompany(this.rootForm)
        if (res.code === 0) {
          this.dialogFormRoot = false
          this.$message.success('修改公司信息成功')
          this.getCompanyList()
        } else {
          this.$message.error(res.message)
        }
      }
    },
    headerStyleFn() {
      return `font-weight:bold;color:#606266;font-size:16px;background: #eef1f6;`
    },
    handleSizeChange() {},
    handleCurrentChange(e) {
      this.pagination.page_num = e
      this.getCompanyList()
    },
  },
}
</script>

<style lang="scss" scoped>
.cont {
  width: 90%;
  margin: 0 auto;
  .top {
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .add-btn {
      margin-left: 30px;
    }
  }
  .input-cont {
    width: 100%;
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .input-item {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;
      > div {
        width: 80px;
        text-align: center;
      }
      .custom-i {
        width: 300px;
      }
    }
  }
  .page {
    background: #fff;
    padding: 32px 16px;
    text-align: right;
  }
  .index-input {
    width: 300px;
  }
}
</style>

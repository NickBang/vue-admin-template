<template>
  <div class="cont">
    <div class="input-cont">
      <div class="input-item"
           v-if="role_code === '1'">
        <div>角色</div>
        <el-select v-model="queryOption.role_code"
                   class="custom-i"
                   clearable
                   placeholder="请选择角色">
          <el-option v-for="item in roleList3"
                     :key="item.role"
                     :label="item.value"
                     :value="item.role">
          </el-option>
        </el-select>
      </div>
      <div class="input-item"
           v-if="role_code === '1'">
        <div>代理商</div>
        <el-select v-model="queryOption.company_name"
                   class="custom-i"
                   clearable
                   placeholder="请选择代理商">
          <el-option v-for="item in companyList"
                     :key="item.company_id"
                     :label="item.company_name"
                     :value="item.company_id">
          </el-option>
        </el-select>
      </div>
      <div class="input-item">
        <div>手机</div>
        <el-input v-model="queryOption.phone_number"
                  placeholder="请输入手机号"
                  class="custom-i"
                  clearable />
      </div>
      <div class="input-item">
        <div>用户名</div>
        <el-input v-model="queryOption.username"
                  placeholder="请输入用户名"
                  class="custom-i"
                  clearable />
      </div>
      <div class="input-item">
        <div>在效</div>
        <el-select v-model="queryOption.status"
                   clearable
                   class="custom-i"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="top">
      <el-button type="success"
                 style="width: 150px"
                 @click="queryList('query')"
                 class="add-btn">查询</el-button>
      <!-- <el-button type="primary"
                 v-if="role_code === '1'"
                 class="add-btn"
                 @click="onClickRoot">添加公司</el-button> -->
      <el-button type="primary"
                 class="add-btn"
                 @click="onClickAdd('add')">添加用户</el-button>

    </div>

    <el-table :data="tableData"
              v-loading="loading"
              :border="true"
              :stripe="true"
              :header-cell-style="headerStyleFn"
              style="width: 100%">
      <el-table-column prop="create_time"
                       label="添加日期"
                       align="center" />
      <el-table-column prop="username"
                       label="用户"
                       align="center" />
      <el-table-column prop="company_name"
                       v-if="role_code === '1'"
                       label="代理商名称"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="medium"
                     @click.native.prevent="companyQuery(scope.row.company_name)">
            {{ scope.row.company_name }}
          </el-button>
        </template>

      </el-table-column>
      <el-table-column prop="role_name"
                       label="角色"
                       align="center" />
      <el-table-column label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     v-if="scope.row.status === 1 && role_code === '1'"
                     @click.native.prevent="onlineUser(scope)">
            审核
          </el-button>
          <div v-else-if="scope.row.status === 1">审核中</div>
          <el-button type="text"
                     size="small"
                     v-if="checkRole(scope.$index)"
                     @click.native.prevent="resetPassword(scope)">
            重置密码
          </el-button>
          <el-button type="text"
                     style="color: red;"
                     size="small"
                     v-if="checkRole(scope.$index)"
                     @click.native.prevent="onClickAdd('edit', scope.$index)">
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

    <el-dialog title="添加/编辑用户"
               :close-on-click-modal="false"
               :visible.sync="dialogFormVisible">
      <el-form :model="editForm"
               :rules="rules">
        <el-form-item label="用户名"
                      prop="username"
                      :label-width="formLabelWidth">
          <el-input v-model="editForm.username"
                    class="index-input"
                    v-if="editType === 'add'"
                    type="text"
                    autocomplete="off"></el-input>
          <div v-else-if="editType === 'edit'">{{editForm.username}}</div>
        </el-form-item>
        <el-form-item label="手机号"
                      prop="phone_number"
                      :label-width="formLabelWidth">
          <el-input v-model="editForm.phone_number"
                    class="index-input"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      v-if="editType === 'add'"
                      prop="password"
                      :label-width="formLabelWidth">
          <el-input v-model="editForm.password"
                    class="index-input"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色"
                      :label-width="formLabelWidth">
          <el-select v-model="editForm.role_code"
                     placeholder="请选择">
            <el-option v-for="item in finalRoleList"
                       :key="item.role"
                       :label="item.value"
                       :value="item.role">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司"
                      :label-width="formLabelWidth"
                      v-if="role_code == 1 && editType === 'add'">
          <el-select v-model="editForm.company_id"
                     placeholder="请选择">
            <el-option v-for="item in companyList"
                       :key="item.company_id"
                       :label="item.company_name"
                       :value="item.company_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期"
                      :label-width="formLabelWidth">
          <el-date-picker v-model="editForm.invalid_time"
                          type="datetime"
                          value-format="yyyy-MM-dd hh:mm:ss"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关键词数量"
                      :label-width="formLabelWidth">
          <el-input v-model="editForm.keyword_count"
                    class="index-input"
                    type="number"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址"
                      :label-width="formLabelWidth">
          <el-input v-model="editForm.address"
                    class="index-input"
                    autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveUser">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加公司"
               :close-on-click-modal="false"
               :visible.sync="dialogFormRoot">
      <el-form :model="rootForm"
               :rules="rules">
        <el-form-item label="公司名"
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
          <el-input v-model="rootForm.company_logo"
                    class="index-input"
                    autocomplete="off"></el-input>
          <img :src="rootForm.company_logo"
               width="50px"
               alt="">
        </el-form-item>
        <el-form-item label="关键词数量"
                      :label-width="formLabelWidth">
          <el-input v-model="rootForm.keyword_count"
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
  addVideoWord,
  getCompanyList,
  onlineUser,
  resetPassword,
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
      companyPagination: {
        page_num: 1,
        page_size: 100, //默认先查询100个公司
        max_page: 1,
        total: 0,
      },
      queryOption: {
        status: '',
        phone_number: '',
        username: '',
        company_name: '',
        role_code: '',
      },
      options: [
        {
          value: '1',
          label: '审核中',
        },
        {
          value: '2',
          label: '生效',
        },
        {
          value: '3',
          label: '失效',
        },
      ],
      roleList4: [
        {
          role: 2,
          value: '代理商超级管理员',
        },
        {
          role: 3,
          value: '代理商管理员',
        },
        {
          role: 5,
          value: '商户',
        },
      ],
      roleList3: [
        {
          role: 3,
          value: '代理商管理员',
        },
        {
          role: 5,
          value: '商户',
        },
      ],
      roleList2: [
        {
          role: 5,
          value: '商户',
        },
      ],
      roleList1: [
        {
          role: 5,
          value: '商户',
        },
      ],
      finalRoleList: [
        {
          role: 5,
          value: '商户',
        },
      ],
      dialogFormVisible: false,
      dialogFormRoot: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      editForm: {
        role_code: 5,
        username: '',
        password: '',
        phone_number: '',
        invalid_time: '',
        keyword_count: 5,
        address: '',
        company_id: '',
      },
      rootForm: {
        role_code: 2,
        keyword_count: 5,
        company_name: '',
        company_host: '',
        company_logo: '',
      },
      editType: 'add',
      formLabelWidth: '120px',
      input: '',
      value1: '',
      tableData: [],
      role_code: '',
      companyList: [],
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 4,
            max: 20,
            message: '长度在 4 到 20 个字符',
            trigger: 'blur',
          },
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
    this.queryList()
    this.role_code = getCookie('role_code')
    if (this.role_code == 1) {
      this.getCompanyList()
    }
    if (this.role_code == 1 || this.role_code == 2) {
      this.finalRoleList = this.roleList3
    } else if (this.role_code == 3) {
      this.finalRoleList = this.roleList2
    }
  },
  methods: {
    async queryList(type) {
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
      const res = await userPageList(data)
      this.loading = false
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
    async getCompanyList() {
      const list = await getCompanyList(this.companyPagination)
      if (list.code === 0) {
        this.companyList = list.data.items
      }
    },
    companyQuery(name) {
      this.queryOption.company_name = name
      this.queryList('query')
    },
    onClickAdd(type, index) {
      console.log(this.tableData[index])
      if (type === 'add') {
        this.editType = 'add'
        this.editForm = {
          role_code: 5,
          username: '',
          password: '',
          phone_number: '',
          invalid_time: '',
          keyword_count: 5,
          address: '',
        }
      } else if (type === 'edit') {
        this.editType = 'edit'
        this.editForm = { ...this.tableData[index], password: '' }
      }
      this.dialogFormVisible = true
    },
    onClickRoot() {
      this.dialogFormRoot = true
    },
    async saveUser() {
      console.log(this.editForm)
      if (this.editType === 'add') {
        const res = await addUser(this.editForm)
        if (res.code === 0) {
          this.$message.success('添加成功')
          this.dialogFormVisible = false
          this.queryList()
        } else {
          this.$message.error(res.message)
        }
      } else if (this.editType === 'edit') {
        const res = await updateUser(this.editForm)
        if (res.code === 0) {
          this.$message.success('保存成功')
          this.dialogFormVisible = false
          this.queryList()
        } else {
          this.$message.error(res.message)
        }
      }
    },
    async saveRootUser() {
      console.log(this.rootForm)
      const res = await addCompany(this.rootForm)
      if (res.code === 0) {
        this.dialogFormRoot = false
        this.$message.success('添加公司成功')
      } else {
        this.$message.error(res.message)
      }
    },
    checkRole(index) {
      if (this.tableData[index].role_code < getCookie('role_code')) {
        return false
      } else {
        return true
      }
    },
    async onlineUser(e) {
      const data = {
        uid: e.row.uid,
      }
      await onlineUser(data)
      this.queryList()
    },
    async resetPassword(e) {
      const username = e.row.username
      this.$confirm(
        `确定要给用户：【${username}】重置密码为 123456 ?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          const data = {
            username: e.row.username,
            password: '123456',
          }
          resetPassword(data)
            .then((res) => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '重置密码成功!',
                })
              } else {
                this.$message({
                  type: 'error',
                  message: '重置密码失败！',
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '重置密码失败！',
              })
            })
        })
        .catch(() => {})
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

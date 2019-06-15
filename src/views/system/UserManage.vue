<template>
  <div class="sm-user sm-page">
    <div class="sm-user__aside">
      <div class="sm-user__aside-header">
        <h4>组织机构</h4>
        <div class="sm-user__aside-header__icon">
          <i
            class="el-icon-edit-outline"
            title="管理机构"
            @click="$router.push({name: 'DepartManage'})"
          ></i>
          <i class="el-icon-arrow-up" title="折叠机构" @click="isExpend = !isExpend"></i>
          <i class="el-icon-refresh" title="刷新" @click="onFreshen"></i>
        </div>
      </div>
      <div class="sm-user__aside-main">
        <el-input
          placeholder="请搜索"
          suffix-icon="el-icon-search"
          size="small"
          v-model="searchForm.departName"
        ></el-input>
        <el-tree
          :data="tableTreeList"
          :props="{
              children: 'children',
              label: 'departName'
          }"
          highlight-current
          :default-expand-all="isExpend"
          empty-text="暂无部门"
          :render-content="renderContent"
          :filter-node-method="filterNode"
          @node-click="nodeClick"
          ref="tree"
          :key="!+isExpend"
        ></el-tree>
      </div>
    </div>
    <div class="sm-user__section">
      <transition name="sm-zoom-in-left">
        <el-form inline size="small" v-if="selectedData.length === 0">
          <el-form-item label="员工名称：">
            <el-input
              placeholder="请输入员工名称"
              v-model="searchForm.userName"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" @keyup.enter.native="onSearch" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
          <el-form-item class="sm-user__section-form__plus">
            <el-button type="primary" icon="el-icon-plus" @click="onAdd">新建用户</el-button>
          </el-form-item>
        </el-form>
        <sm-delete-pane v-else :total="selectedData.length">
          <el-button size="small" @click="setUserById(3)">禁止登录</el-button>
          <el-button size="small" @click="setUserById(1)">允许登录</el-button>
          <el-button size="small">重置密码</el-button>
          <el-button size="small" @click="setUserById(2)">停用</el-button>
          <el-button size="small" @click="dialogVisible = true">编辑</el-button>
        </sm-delete-pane>
      </transition>
      <el-table
        :data="tableList"
        tooltip-effect="dark"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="昵称（系统名）" prop="userName"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="主属部门" prop="departName"></el-table-column>
        <el-table-column label="附属部门">
          <template slot-scope="scope">
            <span>{{arrToStr(scope.row.subs,'subName',',')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="职位" prop="post"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <sm-dot :color="colorObj(scope.row.status)">{{scope.row.status | statusFilter}}</sm-dot>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="onUpdate(scope)"
              :disabled="selectedData&&selectedData.length > 0"
            >编辑</el-button>
            <el-button
              type="text"
              @click="onChangeStatus(scope,3)"
              :disabled="selectedData&&selectedData.length > 0"
            >禁止登陆</el-button>
            <el-button
              type="text"
              @click="onReset(scope)"
              :disabled="selectedData&&selectedData.length > 0"
            >重置密码</el-button>
            <el-button
              type="text"
              @click="onChangeStatus(scope,2)"
              :disabled="selectedData&&selectedData.length > 0"
            >停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-sizes="[10, 20, 30, 40]"
        @size-change="onLimitChanged"
        @current-change="onPageChanged"
        :current-page="pagination.page"
        :page-size="pagination.limit"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px"
      ></el-pagination>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      @closed="clearDialog"
      @open="getUsers"
      :title="dialogTitle"
    >
      <el-form size="small" ref="dialogForm" :model="dialogForm" label-width="130px" inline>
        <template v-if="selectedData&&selectedData.length === 0">
          <h4>账户信息</h4>
          <el-form-item label="昵称（系统名）：">
            <el-input v-model="dialogForm.userName" placeholder="请输入昵称（系统名）"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名：">
            <el-input v-model.trim="dialogForm.realName" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model.trim="dialogForm.mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="初始密码：">
            <el-input placeholder="请输入初始密码" v-model="dialogForm.pwd"></el-input>
          </el-form-item>
          <el-form-item label="性别：">
            <el-radio-group v-model="dialogForm.sex" placeholder="请选择性别">
              <el-radio v-for="item in sexOptions" :key="item.id" :label="item.id">{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <h4>组织关系</h4>
        <el-form-item label="主属部门：">
          <el-cascader
            :options="tableTreeList"
            :props="{ checkStrictly: true ,value: 'id',label: 'departName',emitPath:false}"
            clearable
            :show-all-levels="false"
            v-model="dialogForm.departId"
            placeholder="请选择主属部门"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="附属部门：">
          <el-cascader
            v-model="dialogForm.subs"
            :options="tableTreeList"
            :props="{ checkStrictly: true ,multiple: true ,value: 'id',label: 'departName' ,emitPath:false}"
            collapse-tags
            clearable
            placeholder="请选择附属部门"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="汇报对象：">
          <el-select v-model="dialogForm.reporter" placeholder="请选择">
            <el-option
              v-for="item in reporterOptions"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            >
              <span>{{item.departName}} | {{ item.userName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="selectedData&&selectedData.length === 0">
          <el-form-item label="职位：">
            <el-input v-model.trim="dialogForm.post" placeholder="请输入职位"></el-input>
          </el-form-item>

          <el-form-item label="入职日期：">
            <el-date-picker v-model="dialogForm.employ " type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="就业日期：">
            <el-date-picker v-model="dialogForm.join" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </template>

        <template v-if="selectedData&&selectedData.length === 0">
          <h4>个人信息</h4>
          <el-form-item label="邮箱：">
            <el-input v-model="dialogForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：">
            <el-input v-model="dialogForm.idCard" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="QQ:">
            <el-input v-model="dialogForm.qq" placeholder="请输入QQ"></el-input>
          </el-form-item>
          <el-form-item label="电话:">
            <el-input v-model="dialogForm.tel" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="生日:">
            <el-input v-model="dialogForm.birth" placeholder="请输入生日"></el-input>
          </el-form-item>
          <el-form-item label="微信:">
            <el-input v-model="dialogForm.chart" placeholder="请输入微信"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/http/api/depart.js'
import UserAPI from '@/http/api/user.js'
import SmDot from '@/components/sm-dot'
import SmDeletePane from '@/components/sm-delete-pane'
import { arrToStr } from '@/utils/tools'

const sexOptions = [
  { id: 1, name: '男' },
  { id: 2, name: '女' },
  { id: 3, name: '其他' }
]

const statusOptions = [
  { id: 1, name: '正常' },
  { id: 2, name: '停用' },
  { id: 3, name: '禁止登录' }
]
export default {
  name: 'SmUser',

  components: {
    SmDot,
    SmDeletePane
  },

  data() {
    return {
      dialogVisible: false,
      isExpend: true,
      dialogForm: {
        userName: '',
        realName: '',
        mobile: '',
        pwd: '',
        sex: 1,
        departId: '',
        post: '',
        reporter: '',
        employ: '',
        join: '',
        email: '',
        idCard: '',
        qq: '',
        tel: '',
        birth: '',
        chart: '',
        subs: []
      },
      selectedData: [],
      tableList: [],
      tableTreeList: [],
      sexOptions: sexOptions,
      statusOptions: statusOptions,
      reporterOptions: [],
      searchForm: {
        departName: '',
        userName: '',
        status: ''
      },
      selectedNode: null,
      pagination: {
        //当前页
        page: 1,
        //每页显示条数
        limit: 10,
        //总条数
        total: 0
      }
    }
  },

  computed: {
    dialogTitle() {
      return this.dialogForm.id
        ? this.selectedData && this.selectedData.length > 0
          ? '批量编辑员工'
          : '编辑员工'
        : '新建员工'
    }
  },

  watch: {
    'searchForm.departName'(val) {
      this.$refs.tree.filter(val)
    }
  },

  created() {
    this.getDepartTrees()
    this.getTableList()
  },

  filters: {
    statusFilter(value) {
      switch (value) {
        case 1:
          return '正常'
        case 2:
          return '停用'
        case 3:
          return '禁止登录'
      }
    }
  },

  methods: {
    arrToStr,
    colorObj(value) {
      switch (value) {
        case 0:
          return '#409EFF'
        case 1:
          return '#67C271'
        case 2:
          return '#d32323'
        case 3:
          return '#909399'
        case 4:
          return '#67C23A'
      }
    },

    renderContent(h, { node }) {
      return (
        <span>
          <i class="el-icon-document" />
          <span>{node.label}</span>
        </span>
      )
    },

    filterNode(value, data) {
      if (!value) return true
      return data.departName.indexOf(value) !== -1
    },

    handleSelectionChange(selection) {
      this.selectedData = selection.map(item => item.id)
      console.log(this.selectedData)
    },

    //获取树节点
    nodeClick(data) {
      if (data && data.id) {
        this.selectedNode = data
        this.$nextTick(() => {
          this.getTableList()
        })
      }
    },

    onPageChanged(val) {
      this.pagination.page = val
      this.getTableList()
    },

    onLimitChanged(val) {
      this.pagination.page = 1
      this.pagination.limit = val
      this.getTableList()
    },

    //查询
    onSearch() {
      this.getTableList()
    },

    //重置
    onReset() {
      Object.keys(this.searchForm).forEach(key => (this.searchForm[key] = ''))
      this.getTableList()
    },

    // 分页列表
    async getTableList() {
      let data = Object.assign({}, this.searchForm, this.pagination)
      if (this.selectedNode && this.selectedNode.id) {
        data.departId = this.selectedNode.id
      }
      let result = await UserAPI.getUser(data)
      this.tableList = result.data
      this.pagination.total = result.total
    },

    async getUsers() {
      let result = await UserAPI.getUser({
        page: '1',
        limit: '999999'
      })
      this.reporterOptions = result.data
    },

    // 树形列表
    async getDepartTrees() {
      let result = await API.getDepartTrees()
      this.tableTreeList = result.data
    },

    // 查询ID
    async getUserById(id) {
      let result = await UserAPI.getUserById(id)
      return result.data[0]
    },

    // 批量设置人员状态
    async setUserById(status) {
      let data = {
        ids: this.selectedData,
        status
      }
      await UserAPI.setUserById(data)
      this.getTableList()
    },

    //打开弹窗
    handleOpen() {
      if (!this.dialogVisible) {
        this.dialogVisible = true
      }
    },

    //关闭弹窗
    handleClose() {
      if (this.dialogVisible) {
        this.dialogVisible = false
      }
    },

    //编辑
    async onUpdate(scope) {
      if (scope && scope.row) {
        const dialogForm = await this.getUserById(scope.row.id)
        this.dialogForm = dialogForm
        this.dialogForm.departId = String(dialogForm.departId)
      }
      this.handleOpen()
    },

    //新建
    onAdd() {
      if (!this.selectedNode || !this.selectedNode.id) {
        return this.$message({
          message: `哎呀 ♧♡♂♀♠♣♥❤ , 请先选择部门哟`,
          type: 'warning'
        })
      }
      this.dialogForm.departId = this.selectedNode.id
      this.handleOpen()
    },

    //新增
    async addDialogForm() {
      let data = this.dialogForm

      await UserAPI.addUser(data)
      this.handleClose()
    },

    //更新
    async updateDialogForm() {
      let data = this.dialogForm

      await UserAPI.updateUser(data)

      this.handleClose()
    },

    //批量更新
    async batchUser() {
      let data = {
        reporter: this.dialogForm.reporter,
        subs: this.dialogForm.subs,
        departId: this.dialogForm.departId,
        ids: this.selectedData
      }

      await UserAPI.batchUser(data)

      this.handleClose()
    },

    //提交
    onSubmit() {
      if (this.dialogForm.id) {
        return this.updateDialogForm()
      }
      if (this.selectedData.length > 0) {
        return this.batchUser()
      }
      this.addDialogForm()
    },

    /*
     * 1：正常
     * 2：停用
     * 3：禁止登录
     */
    async onChangeStatus(scope, status) {
      if (scope && scope.row) {
        let data = Object.assign({}, scope.row)
        data.status = status

        await UserAPI.updateUser(data)
        this.getTableList()
      }
    },

    //关闭弹窗时清空
    clearDialog() {
      Object.keys(this.dialogForm).forEach(key => {
        return (this.dialogForm[key] = '')
      })
      if (this.dialogVisible) {
        this.dialogVisible = false
      }
      this.dialogForm.sex = 1
      this.dialogForm.subs = []
      this.getTableList()
    },

    onFreshen() {
      this.selectedNode = null
      this.$nextTick(() => {
        this.getDepartTrees()
        this.getTableList()
      })
    }
  }
}
</script>

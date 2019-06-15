<template>
  <div class="sm-page sm-page--bg">
    <el-tabs v-model="selectedPane">
      <el-tab-pane label="组织架构管理" name="0">
        <template>
          <el-form inline size="small" :model="searchForm">
            <el-form-item label="组织名称：">
              <el-input
                placeholder="请输入组织名称"
                v-model="searchForm.departName"
                @keyup.enter.native="onSearch"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="searchForm.status"
                @keyup.enter.native="onSearch"
                placeholder="请选择"
              >
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
              <el-button
                @click="handleOpen"
                v-if="!tableTreeList || tableTreeList.length === 0"
              >新建集团</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableTreeList"
            :row-key="paginationVisible?'':'id'"
            :key="!+paginationVisible"
          >
            <el-table-column prop="departName" label="组织机构层级"></el-table-column>
            <el-table-column label="分类">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  effect="dark"
                  :color="colorObj(scope.row.categoryId)"
                >{{scope.row.categoryId | categoryFilter}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="userName" label="主负责人"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="nums" label="人数"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <sm-dot :color="colorObj(scope.row.status)">{{scope.row.status | statusFilter}}</sm-dot>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onUpdate(scope)">编辑</el-button>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="onAddSibil(scope)"
                      v-if="String(scope.row.parentId) != '0'"
                    >新建平级部门</el-dropdown-item>
                    <el-dropdown-item @click.native="onAddChild(scope)">新建下级部门</el-dropdown-item>

                    <el-dropdown-item
                      @click.native="onStop(scope)"
                      v-if="String(scope.row.parentId) != '0'"
                    >停用</el-dropdown-item>
                    <el-dropdown-item
                      @click.native="onDelete(scope)"
                      v-if="String(scope.row.parentId) != '0'"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="paginationVisible"
            :page-sizes="[10, 20, 30, 40]"
            @size-change="onLimitChanged"
            @current-change="onPageChanged"
            :current-page="pagination.page"
            :page-size="pagination.limit"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            style="margin-top: 20px"
          ></el-pagination>
        </template>
      </el-tab-pane>
      <el-tab-pane label="组织架构图" name="1">
        <div id="myDiagramDiv" style="min-width:800px; height: 800px;"></div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="dialogVisible"
      width="600px"
      :title="dialogTitle"
      @closed="clearDialog"
      @open="getUserList"
    >
      <el-form size="small" ref="dialogForm" :model="dialogForm" label-width="130px">
        <el-form-item label="上级部门：" v-if="String(dialogForm.parentId) != '0'">
          <el-cascader
            :options="tableTreeList"
            :props="{ checkStrictly: true ,value: 'id',label: 'departName',emitPath:false}"
            clearable
            :show-all-levels="false"
            v-model="dialogForm.parentId"
            placeholder="请选择上级部门"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称：">
          <el-input placeholder="请输入部门名称" v-model.trim="dialogForm.departName"></el-input>
        </el-form-item>
        <el-form-item label="负责人：">
          <el-select v-model="dialogForm.chargeId" placeholder="请选择">
            <el-option
              v-for="item in userOptions"
              :key="item.value"
              :label="item.userName"
              :value="item.id"
            >
              <span style="float: left">{{ item.departName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input placeholder="请输入手机号" v-model="dialogForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="分类：">
          <el-select v-model="dialogForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示排序：">
          <el-input-number v-model="dialogForm.sort" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="部门状态：">
          <el-radio-group v-model="dialogForm.status">
            <el-radio v-for="item in statusOptions" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="dialogForm.remark"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
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
import draw from './drawDepart'

const categoryOptions = [
  { id: 1, name: '集团' },
  { id: 2, name: '区域' },
  { id: 3, name: '分公司' },
  { id: 4, name: '部门' },
  { id: 5, name: '工作组' }
]
const statusOptions = [{ id: 1, name: '正常' }, { id: 2, name: '停用' }]
export default {
  name: 'SmDepart',

  components: {
    SmDot
  },

  data() {
    return {
      selectedPane: '0',
      dialogVisible: false,
      paginationVisible: false,
      searchForm: {
        departName: '',
        status: ''
      },
      dialogForm: {
        parentId: '',
        departName: '',
        chargeId: '',
        mobile: '',
        categoryId: '',
        sort: '',
        /*
         * 1：正常
         * 2：停用
         * 3：删除
         */
        status: 1,
        remark: ''
      },
      tableTreeList: [],
      userOptions: [],
      categoryOptions: categoryOptions,
      statusOptions: statusOptions,
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
    clearSearch() {
      return this.searchForm.departName + this.searchForm.status
    },

    dialogTitle() {
      return this.dialogForm.id ? '编辑部门' : '新建部门'
    }
  },

  watch: {
    clearSearch(newValue) {
      if (newValue === '') {
        this.getDepartTrees()
      }
    },

    async selectedPane(newValue) {
      if (newValue === '1') {
        const result = await API.getDepart()
        draw(result.data)
      }
    }
  },

  created() {
    this.getDepartTrees()
  },

  filters: {
    categoryFilter(value) {
      switch (value) {
        case 1:
          return '集团'
        case 2:
          return '区域'
        case 3:
          return '分公司'
        case 4:
          return '部门'
        case 5:
          return '工作组'
      }
    },

    statusFilter(value) {
      switch (value) {
        case 1:
          return '正常'
        case 2:
          return '停用'
      }
    }
  },

  methods: {
    colorObj(value) {
      switch (value) {
        case 1:
          return '#409EFF'
        case 2:
          return '#67C271'
        case 3:
          return '#d32323'
        case 4:
          return '#909399'
        case 5:
          return '#67C23A'
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
      this.getDepartTrees()
    },

    // 树形列表
    async getDepartTrees() {
      let result = await API.getDepartTrees()
      this.tableTreeList = result.data

      this.paginationVisible = false
    },

    // 分页列表
    async getTableList() {
      let data = Object.assign({}, this.searchForm, this.pagination)
      let result = await API.getDepart(data)
      this.tableTreeList = result.data
      this.pagination.total = result.total
      this.paginationVisible = true
    },

    // 查询ID
    async getDepartById(id) {
      let result = await API.getDepartById(id)
      return result.data
    },

    //用户列表
    async getUserList() {
      let data = {
        page: '1',
        limit: '100000'
      }
      let result = await UserAPI.getUser(data)

      this.userOptions = result.data
    },

    //打开弹窗
    handleOpen() {
      if (this.selectedPane === '0' && !this.dialogVisible) {
        this.dialogVisible = true
      }
    },

    //关闭弹窗
    handleClose() {
      if (this.selectedPane === '0' && this.dialogVisible) {
        this.dialogVisible = false
      }
    },

    //编辑
    async onUpdate(scope) {
      if (scope && scope.row) {
        const dialogForm = await this.getDepartById(scope.row.id)
        this.dialogForm = dialogForm

        this.dialogForm.parentId = String(dialogForm.parentId)
      }
      this.handleOpen()
    },

    //新建平级
    onAddSibil(scope) {
      if (scope && scope.row) {
        const dialogForm = Object.assign({}, scope.row)

        this.dialogForm.parentId = String(dialogForm.parentId)
      }
      this.handleOpen()
    },

    //新建下级
    onAddChild(scope) {
      if (scope && scope.row) {
        const dialogForm = Object.assign({}, scope.row)

        this.dialogForm.parentId = String(dialogForm.id)
      }
      this.handleOpen()
    },

    //新增
    async addDialogForm() {
      let data = this.dialogForm
      data.parentId = data.parentId || '0'
      await API.addDepart(data)
      this.handleClose()
    },

    //编辑
    async updateDialogForm() {
      let data = this.dialogForm
      data.parentId = data.parentId || '0'

      await API.updateDepart(data)
      this.handleClose()
    },

    //提交
    onSubmit() {
      if (this.dialogForm.id) {
        return this.updateDialogForm()
      }
      this.addDialogForm()
    },

    // 停用
    async onStop(scope) {
      if (scope && scope.row) {
        let data = Object.assign({}, scope.row)
        data.status = 2

        await API.updateDepart(data)
        this.getDepartTrees()
      }
    },

    //删除
    async onDelete(scope) {
      if (scope && scope.row) {
        await API.deleteDepart(scope.row.id)
        this.getDepartTrees()
      }
    },

    //关闭弹窗时清空
    clearDialog() {
      Object.keys(this.dialogForm).forEach(key => (this.dialogForm[key] = ''))
      this.dialogForm.status = 1
      this.dialogVisible = false
      this.getDepartTrees()
    }
  }
}
</script>
<style lang="scss">
.sm-page {
  .el-tabs__nav {
    margin-left: 30px;
  }
  .el-form-item__content {
    width: 300px;
  }
  .el-cascader {
    width: 300px;
  }
  .el-select {
    width: 300px;
  }
}
.el-dropdown-link {
  margin-left: 10px;
  color: #409eff;
  cursor: pointer;
}
</style>





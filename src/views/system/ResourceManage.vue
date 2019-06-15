<template>
  <div class="sm-page sm-page--bg">
    <el-form inline size="small">
      <el-form-item label="菜单名称：">
        <el-input
          placeholder="请输入菜单名称"
          v-model="searchForm.resourceName"
          @keyup.enter.native="onSearch"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-input placeholder="请输入状态" v-model="searchForm.status" @keyup.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
        <el-button @click="handleOpen" v-if="!tableTreeList || tableTreeList.length === 0">新建主目录</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableTreeList" :row-key="paginationVisible?'':'id'" :key="!+paginationVisible">
      <el-table-column prop="resourceName" label="菜单名称"></el-table-column>
      <el-table-column prop="type" label="层级" :formatter="typeFormatter"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            effect="dark"
            :color="colorObj(scope.row.type)"
          >{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="请求地址"></el-table-column>
      <el-table-column prop="identify" label="权限标识"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <sm-dot :color="colorObj(scope.row.status)">{{scope.row.status | statusFilter}}</sm-dot>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="onUpdate(scope)">编辑</el-button>
          <el-dropdown>
            <span class="sm-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="String(scope.row.parentId) != '0'"
                @click.native="onAddSibil(scope)"
              >新建平级菜单</el-dropdown-item>
              <el-dropdown-item
                @click.native="onAddChild(scope)"
                v-if="String(scope.row.type) != '3'"
              >新建子集菜单</el-dropdown-item>
              <el-dropdown-item
                v-if="String(scope.row.parentId) != '0'"
                @click.native="onDelete(scope)"
              >删除</el-dropdown-item>
              <el-dropdown-item
                v-if="String(scope.row.parentId) != '0'"
                @click.native="handleDetailOpen(scope.row.id)"
              >详情</el-dropdown-item>
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
    <el-dialog :visible.sync="dialogVisible" width="600px" @closed="clearDialog" @open="getRoles">
      <el-form size="small" ref="dialogForm" :model="dialogForm" label-width="130px">
        <el-form-item label="上级菜单：" v-if="String(dialogForm.parentId) !== '0'">
          <el-cascader
            :options="tableTreeList"
            :props="{ checkStrictly: true ,value: 'id',label: 'resourceName',emitPath:false}"
            clearable
            :show-all-levels="false"
            v-model="dialogForm.parentId"
            placeholder="请选择上级菜单"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="菜单类型：">
          <el-radio-group
            v-model="dialogForm.type"
            placeholder="请选择菜单类型"
            :disabled="String(dialogForm.parentId) === ''||String(dialogForm.parentId) === '0'"
          >
            <el-radio v-for="item in typeOptions" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称：">
          <el-input v-model.trim="dialogForm.resourceName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="请求地址：">
          <el-input placeholder="请输入请求地址" v-model="dialogForm.url"></el-input>
        </el-form-item>
        <el-form-item label="授权标识：">
          <el-input v-model="dialogForm.identify" placeholder="请输入授权标识"></el-input>
        </el-form-item>
        <el-form-item label="显示排序：">
          <el-input-number v-model="dialogForm.sort" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="图标:">
          <el-input v-model="dialogForm.icon" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型:">
          <el-radio-group v-model="dialogForm.status" placeholder="请选择菜单类型">
            <el-radio v-for="item in statusOptions" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属角色" v-if="dialogForm.parentId != 0">
          <el-select v-model="dialogForm.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
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
    <el-dialog :visible.sync="dialogDetailVisible" title="菜单详情" @closed="clearDetailDialog">
      <el-tabs v-model="selectedPane">
        <el-tab-pane label="基础信息" name="0">
          <el-row>
            <ul class="detaile-resource">
              <el-col :span="12">
                <li>
                  <span>菜单名称：</span>
                  <span>{{detailForm.resourceName | emptyFilter}}</span>
                </li>
                <li>
                  <span>排序：</span>
                  <span>{{detailForm.sort | emptyFilter}}</span>
                </li>
                <li>
                  <span>请求地址：</span>
                  <span>{{detailForm.url | emptyFilter}}</span>
                </li>
                <li>
                  <span>状态：</span>
                  <span>
                    <sm-dot
                      :color="colorObj(detailForm.status)"
                    >{{detailForm.status | statusFilter}}</sm-dot>
                  </span>
                </li>
                <li>
                  <span>所属角色：</span>
                  <span
                    style="color:blue; cursor: pointer;"
                    @click="selectedPane = '1'"
                    :class="{disabled:!detailForm.roles.length}"
                  >{{detailForm.roles.length | emptyFilter}}</span>
                </li>
              </el-col>
              <el-col :span="12">
                <li>
                  <span>层级：</span>
                  <span>{{detailForm.type | emptyFilter}}级</span>
                </li>
                <li>
                  <span>类型：</span>
                  <el-tag
                    size="mini"
                    effect="dark"
                    :color="colorObj(detailForm.type)"
                  >{{detailForm.type | typeFilter}}</el-tag>
                </li>
                <li>
                  <span>权限标识：</span>
                  <span>{{detailForm.identify | emptyFilter}}</span>
                </li>
                <li>
                  <span>备注：</span>
                  <span>{{detailForm.remark | emptyFilter}}</span>
                </li>
              </el-col>
            </ul>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="所属角色" name="1">
          <el-table :data="detailForm.roles">
            <el-table-column label="角色名" prop="roleName"></el-table-column>
            <el-table-column label="菜单名称" prop="resourceName"></el-table-column>
            <el-table-column label="创建人"></el-table-column>
            <el-table-column label="创建日期" prop="createAt"></el-table-column>
            <el-table-column label="描述" prop="description"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDetailVisible = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ResourceAPI from '@/http/api/resource.js'
import RoleAPI from '@/http/api/role.js'
import SmDot from '@/components/sm-dot'

const typeOptions = [
  { id: 1, name: '目录' },
  { id: 2, name: '菜单' },
  { id: 3, name: '按钮' }
]
const statusOptions = [{ id: 1, name: '显示' }, { id: 2, name: '隐藏' }]
export default {
  name: 'SmDepart',

  components: {
    SmDot
  },

  data() {
    return {
      dialogVisible: false,
      dialogDetailVisible: false,
      paginationVisible: false,
      selectedPane: '0',
      dialogForm: {
        parentName: '',
        type: 1,
        resourceName: '',
        url: '',
        identify: '',
        sort: '',
        icon: '',
        status: 1,
        remark: '',
        parentId: '',
        roleIds: []
      },
      searchForm: {
        resourceName: '',
        status: ''
      },
      detailForm: {
        parentName: '',
        type: '',
        resourceName: '',
        url: '',
        identify: '',
        sort: '',
        icon: '',
        status: '',
        remark: '',
        parentId: '',
        roles: []
      },
      tableList: [],
      tableTreeList: [],
      typeOptions: typeOptions,
      statusOptions: statusOptions,
      roleOptions: [],
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
      return this.searchForm.resourceName + this.searchForm.status
    }
  },

  watch: {
    clearSearch(newValue) {
      if (newValue === '') {
        this.getResourceTrees()
      }
    }
  },

  created() {
    this.getResourceTrees()
  },

  filters: {
    typeFilter(value) {
      switch (value) {
        case 1:
          return '目录'
        case 2:
          return '菜单'
        case 3:
          return '按钮'
      }
    },

    statusFilter(value) {
      switch (value) {
        case 1:
          return '可见'
        case 2:
          return '不可见'
      }
    },

    emptyFilter(value) {
      if (!value) return '————'
      return value
    }
  },

  methods: {
    typeFormatter(row, column, cellValue, index) {
      return `${cellValue} 级`
    },

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
      this.getResourceTrees()
    },

    async getRoles() {
      let result = await RoleAPI.getRole()
      this.roleOptions = result.data
    },

    // 树形列表
    async getResourceTrees() {
      let result = await ResourceAPI.getResourceTrees()
      this.tableTreeList = result.data

      this.paginationVisible = false
    },

    // 分页列表
    async getTableList() {
      let data = Object.assign({}, this.searchForm, this.pagination)
      let result = await ResourceAPI.getResource(data)
      this.tableTreeList = result.data
      this.pagination.total = result.total
      this.paginationVisible = true
    },

    // 查询ID
    async getResourceById(id) {
      let result = await ResourceAPI.getResourceById(id)
      if (result.data[0].roles && result.data[0].roles.length > 0) {
        result.data[0].roleIds = result.data[0].roles
          .map(item => item.roleId)
          .filter(item => item)
      }
      return result.data[0]
    },

    //详情
    async getResourceDetail(id) {
      let result = await ResourceAPI.getResourceById(id)
      if (result.data[0].roles && result.data[0].roles.length > 0) {
        result.data[0].roles = result.data[0].roles.filter(item => item.roleId)
      }
      return result.data[0]
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
      if (!this.dialogVisible) {
        this.dialogVisible = true
      }
    },

    //打开详情弹窗
    async handleDetailOpen(id) {
      if (!this.dialogDetailVisible) {
        this.dialogDetailVisible = true
        if (id) {
          this.detailForm = await this.getResourceDetail(id)
        }
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
        const dialogForm = await this.getResourceById(scope.row.id)
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
        this.dialogForm.type = dialogForm.type
      }
      this.handleOpen()
    },

    //新建下级
    onAddChild(scope) {
      if (scope && scope.row) {
        const dialogForm = Object.assign({}, scope.row)

        this.dialogForm.parentId = String(dialogForm.id)
        this.dialogForm.type = this.selectType(dialogForm.type)
      }
      this.handleOpen()
    },

    selectType(type) {
      switch (Number(type)) {
        case 1:
          return 2
        case 2:
          return 3
      }
    },

    //新增
    async addDialogForm() {
      let data = this.dialogForm
      data.parentId = data.parentId || '0'

      await ResourceAPI.addResource(data)
      this.handleClose()
    },

    //编辑
    async updateDialogForm() {
      let data = this.dialogForm
      data.parentId = data.parentId || '0'

      await ResourceAPI.updateResource(data)
      this.handleClose()
    },

    //提交
    onSubmit() {
      if (this.dialogForm.id) {
        return this.updateDialogForm()
      }
      this.addDialogForm()
    },

    //删除
    async onDelete(scope) {
      if (scope && scope.row) {
        await ResourceAPI.deleteResource(scope.row.id)
        this.getResourceTrees()
      }
    },

    //关闭弹窗时清空
    clearDialog() {
      Object.keys(this.dialogForm).forEach(key => (this.dialogForm[key] = ''))
      this.dialogForm.status = 1
      this.dialogForm.type = 1
      this.dialogForm.roleIds = []
      this.dialogVisible = false
      this.getResourceTrees()
    },

    //关闭弹窗时清空
    clearDetailDialog() {
      Object.keys(this.detailForm).forEach(key => (this.detailForm[key] = ''))
      this.detailForm.roles = []
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.detaile-resource li span:first-child {
  display: inline-block;
  padding: 10px 20px 10px 0;
}
.disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>





<template>
  <div class="sm-page sm-page--padding is-between sm-fun">
    <el-tabs v-model="selectedPane">
      <el-tab-pane label="用户角色分配" name="0">
        <div class="sm-fun__aside">
          <h5 @click="handleClickRole(null)">
            <span>全部余行用户</span>
            <span>5/100</span>
          </h5>
          <el-menu>
            <el-menu-item-group v-for="group in roleTreeList" :key="group.id" :index="group.id">
              <template slot="title">
                <div
                  class="group"
                  @mouseenter="onMouseEnter(group.groupName)"
                  @mouseleave="onMouseLeave"
                >
                  <font>{{group.groupName}}</font>
                  <div class="group-right" v-show="group.groupName === isShowIcon">
                    <i class="el-icon-edit" @click.prevent.stop="onUpdateGroup(group)"></i>
                    <i
                      class="el-icon-remove-outline"
                      @click.prevent.stop="handleDeleteGroup(group)"
                    ></i>
                    <i class="el-icon-plus" @click.prevent.stop="onAdd(group)"></i>
                  </div>
                </div>
              </template>
              <template v-if="group.roles && group.roles.length > 0">
                <el-menu-item
                  v-for="role in group.roles"
                  :key="role.id"
                  :index="role.id"
                  @click="handleClickRole(role.id)"
                >
                  <template slot="title">
                    <div
                      class="role"
                      @mouseenter="onMouseEnter(role.roleName)"
                      @mouseleave="onMouseLeave"
                    >
                      <font>{{role.roleName}}</font>
                      <div class="role-right" v-show="role.roleName === isShowIcon">
                        <i
                          class="el-icon-edit"
                          @click.prevent.stop="onUpdateRole(role,group.groupName)"
                        ></i>
                        <i
                          class="el-icon-remove-outline"
                          @click.prevent.stop="handleDeleteRole(role)"
                        ></i>
                      </div>
                    </div>
                  </template>
                </el-menu-item>
              </template>

              <el-menu-item :index="group.id" v-else>此分类暂无角色</el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </div>
        <div class="sm-fun__section">
          <el-form inline size="small">
            <el-form-item label="选择部门">
              <el-select
                v-model="searchForm.departId"
                placeholder="请选择"
                @keyup.enter.native="onSearch"
              >
                <el-option
                  v-for="item in departOptions"
                  :key="item.id"
                  :label="item.departName"
                  :value="item.id"
                ></el-option>
              </el-select>
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
            </el-form-item>
            <el-form-item class="sm-fun__section-form__plus">
              <el-button type="primary" icon="el-icon-plus" @click="dialogUerVisible = true">添加用户</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="tableList">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="昵称（系统名）" prop="userName"></el-table-column>
            <el-table-column label="主属部门" prop="departName"></el-table-column>
            <el-table-column label="职位" prop="post"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <sm-dot :color="colorObj(scope.row.status)">{{scope.row.status | statusFilter}}</sm-dot>
              </template>
            </el-table-column>
            <el-table-column label="角色" prop="roleName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text">删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="角色权限设置" name="1">
        <div class="sm-fun__aside">
          <el-menu>
            <el-menu-item-group v-for="group in roleTreeList" :key="group.id" :index="group.id">
              <template slot="title">
                <div
                  class="group"
                  @mouseenter="onMouseEnter(group.groupName)"
                  @mouseleave="onMouseLeave"
                >
                  <font>{{group.groupName}}</font>
                </div>
              </template>
              <template v-if="group.roles && group.roles.length > 0">
                <el-menu-item
                  v-for="role in group.roles"
                  :key="role.id"
                  :index="role.id"
                  @click="handleClickRole(role.id)"
                >
                  <template slot="title">
                    <div
                      class="role"
                      @mouseenter="onMouseEnter(role.roleName)"
                      @mouseleave="onMouseLeave"
                    >
                      <font>{{role.roleName}}</font>
                    </div>
                  </template>
                </el-menu-item>
              </template>

              <el-menu-item :index="group.id" v-else>此分类暂无角色</el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </div>
        <div class="sm-fun__section">
          <h5>舟余观察者</h5>
          <span class="sm-fun__section__tip">舟余观察者预设所有对象的查看列表及详情权限</span>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>人员管理</span>
              <el-button type="text" class="sm-card__right">设置字段权限</el-button>
            </div>
            <template>
              <el-checkbox>全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <!-- <el-checkbox-group>
                <el-checkbox
                  v-for="item in userOptions"
                  :label="item.name"
                  :key="item.name"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>-->
            </template>
          </el-card>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>组织架构管理</span>
              <el-button type="text" class="sm-card__right">设置字段权限</el-button>
            </div>
            <template>
              <el-checkbox>全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <!-- <el-checkbox-group>
                <el-checkbox
                  v-for="item in departOptions"
                  :label="item.name"
                  :key="item.name"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>-->
            </template>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogGroupVisible" width="600px" @closed="clearGroupDialog">
      <el-form size="small" ref="dialogGroupForm" :model="dialogGroupForm" label-width="130px">
        <el-form-item label="角色分类：">
          <el-autocomplete
            class="inline-input"
            v-model.trim="dialogGroupForm.groupName"
            :fetch-suggestions="querySearchAsync"
            :placeholder="isShow?'请输入内容':'重命名'"
            value-key="groupName"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <template v-if="isShow">
          <el-form-item label="角色名称：">
            <el-input placeholder="请输入角色名称" v-model="dialogGroupForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="dialogGroupForm.description"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="dialogGroupForm.id">
          <el-form-item label="显示排序：">
            <el-input-number v-model="dialogGroupForm.sort" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="创建人：">
            <span>{{dialogGroupForm.createdAt}}</span>
          </el-form-item>
          <el-form-item label="创建日期：">
            <span>{{dialogGroupForm.createdAt}}</span>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item class="copy-item">
            <el-checkbox v-model="isCopy">复制</el-checkbox>
            <el-select placeholder="请选择" :disabled="!isCopy">
              <el-option-group
                v-for="group in roleTreeList"
                :key="group.id"
                :label="group.groupName"
              >
                <el-option
                  v-for="item in group.roles"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-option-group>
            </el-select>的角色权限
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGroupVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="onGroupSubmit" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogUerVisible"
      width="600px"
      title="添加员工"
      @open="getUsers"
      @closed="clearUserDialog"
    >
      <el-form
        size="small"
        ref="dialogUserForm"
        :model="dialogUserForm"
        label-width="130px"
        style="padding:0 40px;"
      >
        <p>说明：新添加的角色会与员工的原有角色进行合并</p>
        <el-form-item class="cascader-full">
          <el-select v-model="dialogUserForm.userIds" placeholder="请选择" multiple>
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            >
              <span>{{item.departName}} | {{ item.userName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <h4>用户角色配置</h4>
        <el-divider></el-divider>
        <el-checkbox-group v-model="dialogUserForm.roleIds">
          <el-form-item
            v-for="group in roleTreeList"
            :key="group.id"
            :label="`${group.groupName}：`"
          >
            <el-checkbox
              v-for="role in group.roles"
              :key="role.id"
              :label="role.id"
            >{{role.roleName}}</el-checkbox>
          </el-form-item>
        </el-checkbox-group>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUerVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="setUserRole" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/http/api/role.js'
import GroupAPI from '@/http/api/group.js'
import UserAPI from '@/http/api/user.js'
import DepartAPI from '@/http/api/depart.js'
import SmDot from '@/components/sm-dot'

const userOptions = [
  { id: 1, name: '查看列表' },
  { id: 2, name: '查看详情' },
  { id: 3, name: '停用' },
  { id: 4, name: '新建用户' },
  { id: 5, name: '编辑' },
  { id: 6, name: '禁止登录' },
  { id: 7, name: '恢复' },
  { id: 8, name: '允许登录' },
  { id: 9, name: '重置密码' }
]
// const departOptions = userOptions.slice(0)
const dialogGroupForm = {
  groupName: '',
  roleName: '',
  description: '',
  sort: '',
  createdAt: ''
}
const dialogUserForm = {
  userIds: [],
  roleIds: []
}
const statusOptions = [
  { id: 1, name: '正常' },
  { id: 2, name: '停用' },
  { id: 3, name: '禁止登录' }
]
export default {
  name: 'SmFun',

  components: {
    SmDot
  },

  data() {
    return {
      statusOptions,
      selectedPane: '0',
      selectedRoleId: '',
      dialogGroupVisible: false,
      dialogUerVisible: false,
      isShow: false,
      isCopy: false,
      isShowIcon: '',
      roleTreeList: [],
      tableList: [],
      departOptions: [],
      userOptions: [],
      dialogGroupForm,
      dialogUserForm,
      searchForm: {
        departId: '',
        status: ''
      },
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

  created() {
    this.getDeparts()
    this.getGroup()
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
    async querySearchAsync(queryString, cb) {
      let result = await API.getGroup()
      cb(result.data)
    },

    handleSelect(item) {
      if (item.id) {
        this.dialogGroupForm.groupName = item.groupName
      }
    },

    onMouseEnter(name) {
      this.isShowIcon = name
    },

    onMouseLeave() {
      this.isShowIcon = ''
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

    isIndeterminate() {},

    //获取用户下拉框
    async getUsers() {
      let result = await UserAPI.getUser({
        page: '1',
        limit: '999999'
      })
      this.userOptions = result.data
    },

    // 获取部门列表
    async getDeparts() {
      let result = await DepartAPI.getDepart({ page: '1', limit: '9999999' })
      this.departOptions = result.data
    },

    //获取详细角色分类ID详情
    async getGroupById(id) {
      const result = await GroupAPI.getGroupById(id)
      return result.data
    },

    handleClickRole(id) {
      this.selectedRoleId = id
      Object.keys(this.searchForm).forEach(key => (this.searchForm[key] = ''))
      this.getTableList()
    },

    async getTableList() {
      let data = Object.assign({}, this.searchForm, this.pagination, {
        roleId: this.selectedRoleId
      })
      let result = await UserAPI.getUser(data)
      this.tableList = result.data
      this.pagination.total = result.total
    },

    //获取详细角色ID详情
    async getRoleById(id) {
      let result = await API.getRoleById(id)
      return result.data
    },

    //编辑角色组
    async onUpdateGroup(group) {
      if (group) {
        const result = await this.getGroupById(group.id)
        this.dialogGroupForm.sort = result.sort
        this.dialogGroupForm.createdAt = result.createdAt
        this.dialogGroupForm.id = group.id
        this.isShow = false
        this.handleOpenGroup()
      }
    },

    handleDeleteGroup(group) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h(
            'span',
            null,
            '删除此角色分类，其下角色将自动分类到 "未分类角色" 里，是否继续？'
          )
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            await GroupAPI.deleteGroup(group.id)
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        }
      }).then(() => {
        this.getGroup()
      })
    },
    handleDeleteRole(role) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('p', { style: 'color: teal' }, '确定删除本角色？'),
          h('p', '删除角色后，本角色下员工所具有的权限会受到影响。')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            await API.deleteRole(role.id)
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 3000)
          } else {
            done()
          }
        }
      }).then(() => {
        this.getGroup()
      })
    },

    //新建角色
    async onAdd(group) {
      if (group) {
        this.dialogGroupForm.groupName = group.groupName
        this.isShow = true
        this.handleOpenGroup()
      }
    },

    //编辑角色
    async onUpdateRole(role, groupName) {
      if (role) {
        const result = await this.getRoleById(role.id)
        this.dialogGroupForm.sort = result.sort
        this.dialogGroupForm.id = result.id
        this.dialogGroupForm.createdAt = result.createdAt
        this.dialogGroupForm.roleName = result.roleName
        this.dialogGroupForm.description = result.description
        this.dialogGroupForm.groupName = groupName
        this.isShow = true
        this.handleOpenGroup()
      }
    },

    handleOpenGroup() {
      if (!this.dialogGroupVisible) {
        this.dialogGroupVisible = true
      }
    },
    handleCloseGroup() {
      if (this.dialogGroupVisible) {
        this.dialogGroupVisible = false
      }
    },

    handleOpenUser() {
      if (!this.dialogUerVisible) {
        this.dialogUerVisible = true
      }
    },
    handleCloseUser() {
      if (this.dialogUerVisible) {
        this.dialogUerVisible = false
      }
    },

    async setUserRole() {
      await UserAPI.setUserRole(this.dialogUserForm)
      this.dialogUerVisible = false
      this.getTableList()
    },

    //新增
    async addDialogForm() {
      let data = this.dialogGroupForm

      await API.addRole(data)
      this.handleCloseGroup()
    },

    //更新
    async updateDialogForm() {
      let data = this.dialogGroupForm

      await API.updateRole(data)

      this.handleCloseGroup()
    },

    //更新角色组
    async updateGroupDialogForm() {
      let { id, groupName, sort } = this.dialogGroupForm

      await GroupAPI.updateGroup({ id, groupName, sort })

      this.handleCloseGroup()
    },

    //提交角色
    onGroupSubmit() {
      if (this.dialogGroupForm.roleName) {
        if (this.dialogGroupForm.id) {
          return this.updateDialogForm()
        } else {
          return this.addDialogForm()
        }
      }
      this.updateGroupDialogForm()
    },
    async getGroup() {
      let result = await API.getGroup()
      this.roleTreeList = result.data
    },

    //清空角色弹窗
    clearGroupDialog() {
      Object.keys(this.dialogGroupForm).forEach(
        key => (this.dialogGroupForm[key] = '')
      )
      if (this.dialogGroupVisible) {
        this.dialogGroupVisible = false
      }

      this.getGroup()
    },

    clearUserDialog() {
      Object.keys(this.dialogUserForm).forEach(
        key => (this.dialogUserForm[key] = [])
      )
      if (this.dialogUserVisible) {
        this.dialogUserVisible = false
      }
      this.getGroup()
    }
  }
}
</script>
<style lang="scss" scoped>
.sm-page--padding {
  background: #ffffff;
  /* padding: 20px; */
  padding: 20px 20px 20px 0;
}
.group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 14px;
  .group-right {
    cursor: pointer;
    i {
      margin-right: 8px;
    }
  }
}
.el-menu-item {
  padding: 0 0 0 50px !important;
  height: 46px !important;
  line-height: 46px !important;
  &.is-active {
    border-right: 4px solid rgb(16, 142, 233);
    background: rgb(230, 247, 255);
  }
  &:hover {
    background: rgb(230, 247, 255);
    color: rgb(16, 142, 233);
    border-right: 2px solid rgb(16, 142, 233);
  }
  .role {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .role-right {
      cursor: pointer;
      i {
        font-size: 14px !important;
      }
    }
  }
}
.copy-item {
  .el-select {
    width: 150px;
  }
  .el-checkbox {
    margin-right: 5px;
  }
}
</style>
<style lang="scss">
.cascader-full {
  .el-form-item__content {
    margin: 0 !important;
  }
  .el-cascader,
  .el-form-item__content {
    width: 100% !important;
  }
}
</style>





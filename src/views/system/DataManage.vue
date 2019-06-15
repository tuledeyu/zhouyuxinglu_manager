<template>
  <div class="sm-page sm-page--bg sm-data">
    <el-tabs v-model="selectedPane">
      <el-tab-pane label="基础数据权限" name="0">
        <el-card class="sm-data-card">
          <span>说明</span>
          <br>
          <span>1、私有：对象中所有数据遵循相关团队成员（包括负责人）及其上级对数据可见，且对这条数据具备同样的权限[只读、可编辑]；上级部门的部门负责人可以看到下级部门的所有数据。</span>
          <br>
          <span>2、公开只读：对象中所有数据对全公司公开。单条数据的负责人及其上级、以及相关团队具备编辑权限的成员可以编辑该数据。</span>
          <br>
          <span>3、公开读写：对象中所有数据对全公司公开，全员可编辑。</span>
          <br>
        </el-card>
        <el-table :data="tableList">
          <el-table-column label="数据类型" prop="resourceName"></el-table-column>
          <el-table-column label="权限">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.b">
                <el-radio :label="3">私有</el-radio>
                <el-radio :label="6">公开只读</el-radio>
                <el-radio :label="9">公开读、写</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="sm-data--right">
          <el-button type="primary" size="small">保存</el-button>
          <el-button size="text">恢复默认</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据权限共享" name="1" class="sm-tab-pane">
        <div class="sm-data__aside">
          <sm-bar-item show>
            全部数据共享
            <span slot="icon">1</span>
          </sm-bar-item>
          <sm-bar>
            <sm-bar-item>校色</sm-bar-item>
            <sm-bar-item>asdasdasd</sm-bar-item>
            <sm-bar-item>校dsaas色</sm-bar-item>
            <sm-bar-item>sadasdasdsadsa</sm-bar-item>
          </sm-bar>
        </div>
        <div class="sm-data__section">
          <el-form inline size="small">
            <el-form-item label="共享范围：">
              <el-input placeholder="搜索或选择用户、组织、角色组或角色"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-plus"
                class="sm-data_section-form__plus"
              >新建共享规则</el-button>
            </el-form-item>
          </el-form>
          <el-table>
            <el-table-column label="数据来源" prop></el-table-column>
            <el-table-column label="共享数据" prop></el-table-column>
            <el-table-column label="共享范围" prop></el-table-column>
            <el-table-column label="共享权限" prop></el-table-column>
            <el-table-column label="状态" prop></el-table-column>
            <el-table-column label="操作" prop>
              <template slot-scope="scope">
                <el-button type="text">停用</el-button>
                <el-button type="text">启用</el-button>
                <el-button type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SmBarItem from './components/sm-bar-item'
import SmBar from './components/sm-bar'
import ResourceAPI from '@/http//api/resource.js'

export default {
  name: 'SmData',

  components: {
    SmBarItem,
    SmBar
  },

  data() {
    return {
      selectedPane: '0',
      tableList: []
    }
  },

  created() {
    this.getList()
  },

  methods: {
    async getList() {
      let result = await ResourceAPI.getResource()
      this.tableList = result
    }
  }
}
</script>




<template>
  <div class="sm-page sm-page--bg">
    <transition name="sm-zoom-in-left">
      <el-form inline size="small" v-if="selectedData.length === 0">
        <el-form-item label="操作人员：">
          <el-input placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="操作内容">
          <el-input placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="操作时间：">
          <el-date-picker
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <sm-delete-pane v-else :total="selectedData.length">
        <el-button size="small">删除</el-button>
      </sm-delete-pane>
    </transition>
    <el-table
      :data="tableData"
      show-overflow-tooltip
      tooltip-effect="dark"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="昵称（系统名）" prop="a">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row.id)">{{scope.row.a}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="日志编号" prop="a"></el-table-column>
      <el-table-column label="操作模块" prop="a"></el-table-column>
      <el-table-column label="操作结果" prop="a"></el-table-column>
      <el-table-column label="操作人员" prop="a"></el-table-column>
      <el-table-column label="IP" prop="a"></el-table-column>
      <el-table-column label="操作时间" prop="a"></el-table-column>
      <el-table-column label="操作内容" prop="a"></el-table-column>
    </el-table>
    <el-dialog title="用户信息" :visible.sync="dialogVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SmDeletePane from '@/components/sm-delete-pane'

export default {
  name: 'SmOperation',

  components: {
    SmDeletePane
  },

  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },

      tableData: [
        { a: '1', b: '2', id: 1 },
        { a: '1', b: '2', id: 2 },
        { a: '1', b: '2' }
      ],
      selectedData: [],
      dialogVisible: false
    }
  },

  methods: {
    handleSelectionChange(selection) {
      this.selectedData = selection
    },

    handleClick(id) {
      if (id) {
        this.dialogVisible = true
      }
    }
  }
}
</script>



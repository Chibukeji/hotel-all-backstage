<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button class="filter-item" type="danger" size="mini" icon="el-icon-close">删除</el-button>
      <el-button class="filter-item" size="mini" icon="el-icon-arrow-down" @click="treeOpen('1')">展开</el-button>
      <el-button class="filter-item" size="mini" icon="el-icon-arrow-up" @click="treeOpen('2')">折叠</el-button>
      <el-input v-model="listQuery.nickname" placeholder="输入用户名称或真实姓名" style="width: 300px;margin-left:20px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-if="refreshTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      row-key="id"
      :default-expand-all="expandIf"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="菜单名称" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <el-input v-model="row.password_show" />
        </template>
      </el-table-column>
      <el-table-column label="真实密码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次登陆时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.last_login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">开启</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="dataForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item label="用户名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="角色" prop="group_id">
          <el-input v-model="editForm.name" placeholder="请输入用户名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        nickname: '',
        page: 1,
        size: 0
      },
      total: 0,
      listLoading: false,
      list: [
        {
          id: 1,
          children: [{
            id: 31
          }, {
            id: 32
          }]
        }
      ],
      multipleSelection: [],
      rules: {},
      editForm: {
        name: ''
      },
      editDialogVisible: false,
      dialogTitle: '',
      expandIf: true,
      refreshTable: true
    }
  },
  methods: {
    // 点击搜索
    handleFilter() {

    },
    // 点击翻页
    paginHandle() {

    },
    // 点击展开和折叠
    treeOpen(flag) {
      this.refreshTable = false
      if (flag == '1') {
        this.expandIf = true
      } else {
        console.log(flag)
        this.expandIf = false
      }
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 点击编辑
    handleUpdate() {
      this.editDialogVisible = true
      this.dialogTitle = '编辑'
    },
    // 点击修改状态
    handleStatus(row) {
      if (this.btnAry.findIndex(x => x.id == '44') == -1) {
        this.$message({
          type: 'warning',
          message: '您没有权限修改'
        })
        return
      }
      let text
      if (row.status == 1) {
        text = '禁用'
      } else if (row.status == 0) {
        text = '开启'
      }
      this.$confirm('确定要改为' + text + '状态吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let status
        if (row.status == 0) {
          status = 1
        } else if (row.status == 1) {
          status = 0
        }
        const params = {
          uid: row.uid,
          status: status
        }
        getUserEdit(params).then(res => {
          if (res.code == 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

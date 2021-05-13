<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore">删除</el-button>
      <!-- <el-input v-model="listQuery.nickname" placeholder="输入用户名称或真实姓名" style="width: 300px;margin-left:20px" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.truename }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">开启</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.group_id == 2" type="primary" size="mini"  @click="handleRelated(row)">
            关联酒店
          </el-button>
          <el-button v-if="row.is_current == undefined" size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名称" :disabled="editFlag"/>
        </el-form-item>
        <el-form-item label="登陆密码" prop="password">
          <el-input v-model="editForm.password" placeholder="请输入登陆密码" />
        </el-form-item>
        <el-form-item label="角色" prop="group_id">
          <el-select v-model="editForm.group_id" class="filter-item" placeholder="请选择角色" style="width:100%;">
            <el-option v-for="item in rolelist" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联会员" prop="member_id">
           <el-select  v-model="editForm.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
            :remote-method="remoteMethod" :loading="loadingSearch" style="width:100%">
            <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id">
                <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
                <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="truename">
          <el-input v-model="editForm.truename" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="0">禁用</el-radio>
            <el-radio label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 关联酒店 -->
    <related-hotel ref="relatedHotelChild" />
  </div>
</template>

<script>
import { getUserList, getUserAdd, getUserEdit, getUserDel,getNickNameMemberList } from '@/api/system-manage/user-list'
import { getBackstageRoleList } from '@/api/system-manage/role-list'
import Pagination from '@/components/Pagination'
import RelatedHotel from './components/related-hotel'
import mix from '@/mixs/mix'
export default {
  components: { Pagination,RelatedHotel},
  mixins: [mix],
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^1[0-9]{10}$/
      if (reg.test(value)) {
        return callback()
      }
      callback('请输入正确的手机号')
    }
    return {
      listQuery: {
        // nickname: '',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      rules: {
        username: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        group_id: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        nickname: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        truename: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkPhone, required: true,  trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        member_id:[
          { required: true, message: '请选择', trigger: 'change' }
        ],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        username: '',
        password: '',
        group_id: '',
        nickname: '',
        truename: '',
        mobile: '',
        status: '1',
        member_id:'',
      },
      editId: '',
      rolelist:[],
      editFlag:false,
      loadingSearch: false,
      memberList: [],
    }
  },
  mounted() {
    this.getList()
    this.getRoleListInit()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
    //刷新
    refresh(){
      this.listQuery = {
        page: 1,
        size: 20,
      }
      this.getList();
    },
    // 获取角色列表
    getRoleListInit() {
      getBackstageRoleList({page:1,size:9999,status:1}).then(res => {
        this.rolelist = res.data.data.data
      })
    },
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editFlag = false
      this.editForm = {
        username: '',
        password: '',
        group_id: '',
        nickname: '',
        truename: '',
        mobile: '',
        status: '1',
        member_id:'',
      }
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getList()
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索会员
    remoteMethod(query) {
      if (query == '' || query == null) {
        this.memberList = []
      } else {
        this.loadingSearch = true
        getNickNameMemberList({ keyword: query, page: 1, size: 20,}).then(res => {
          this.loadingSearch = false
          this.memberList = res.data
        })
      }
    },
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = '编辑'
      this.editId = item.id
      this.editFlag = true
      for (const key in item) {
        if (this.editForm[key] != undefined) {
          this.editForm[key] = item[key]
        }
      }
      this.editForm.member_id = item.member_id
      this.remoteMethod(item.member_name)
      this.editForm.status = item.status.toString()
      this.editForm.password = item.password_show
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle == '添加') {
            const params = this.editForm
              getUserAdd(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          } else if (this.dialogTitle == '编辑') {
            const params = Object.assign(this.editForm, { id: this.editId })
             getUserEdit(params).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.getList()
                this.editDialogVisible = false
              }
            })
          }
        }
      })
    },
    //关联酒店
    handleRelated(row){
      this.$refs.relatedHotelChild.init(row)
    },
    // 删除单个
    handleDelete(row, index) {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: row.id
          }
          getUserDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    //删除多个
    delMore() {
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idArr = this.multipleSelection.map(x => { return x.id })
          const params = {
            id: idArr.join(',')
          }
          getUserDel(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 点击修改状态
    handleStatus(row) {
      // if (this.btnAry.findIndex(x => x.id == '44') == -1) {
      //   this.$message({
      //     type: 'warning',
      //     message: '您没有权限修改'
      //   })
      //   return
      // }
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
          id: row.id,
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

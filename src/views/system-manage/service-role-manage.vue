<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <!-- <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button> -->
      <!-- <el-button class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore">删除</el-button> -->
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
      <el-table-column label="角色名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
       <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col">
        <template slot-scope="{row}" v-if=" row.id != 1">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">开启</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
        <template slot-scope="{row,$index}" v-if=" row.id != 1">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status" style="width:100%;text-align: left;">
            <el-radio label="0">禁用</el-radio>
            <el-radio label="1">开启</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="普通操作" >
          <el-button size="mini" @click="selectItem('1')">全选</el-button>
          <el-button size="mini" @click="selectItem('2')">全不选</el-button>
          <el-button size="mini" @click="expandItem('1')">全部展开</el-button>
          <el-button size="mini" @click="expandItem('2')">全部隐藏</el-button>
        </el-form-item>
        <el-form-item label="选择权限" >
          <div v-loading="rolePopLoading" class="tree-wrap-box">
            <el-tree
              v-if="refreshTree"
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="id"
              :default-expand-all="expandStatus"
              :props="defaultProps"
              :default-checked-keys="defaultCheckedTreeShow"
              @check-change="handleCheckChange"
              @check="handleCheck"
              :check-strictly="true"
            />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getServiceRoleList, getRoleAdd, getRoleEdit, getRoleDel,getTreeList } from '@/api/system-manage/role-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
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
        title: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      editForm: {
        title: '',
        status: '1'
      },
      editDialogVisible: false,
      dialogTitle: '',
      rolePopLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      defaultCheckedTreeShow: [],
      defaultCheckedTree: [],
      checkoutTree:[],
      expandStatus: true,
      refreshTree: true,
      editId: '',
      clickFlag:false
    }
  },
  mounted() {
    this.getList();
    this.getTreeData()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getServiceRoleList(this.listQuery).then(res => {
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
    // 点击添加
    handleCreate() {
      this.editDialogVisible = true
      this.dialogTitle = '添加'
      this.editForm = {
        title: '',
        status: '1'
      }
      this.$refs.tree.setCheckedKeys([])
      this.defaultCheckedTree = []
      this.checkoutTree = []
      this.clickFlag = false
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
    // 点击编辑
    handleUpdate(item) {
      this.editDialogVisible = true
      this.dialogTitle = '编辑'
      this.editId = item.id
      this.clickFlag = false
      this.defaultCheckedTree = []
      this.defaultCheckedTreeShow = []
      for (const key in item) {
        if (this.editForm[key] != undefined) {
          this.editForm[key] = item[key]
        }
      }
      this.editForm.status = item.status.toString()
      let arr=[]
      let treeArr = item.rules.split(',')
      for (var i = 0; i < treeArr.length; i++) {
        treeArr[i] = parseInt(treeArr[i])
        arr.push(treeArr[i])
      }
      this.defaultCheckedTree = arr
      // console.log(this.defaultCheckedTree)
      this.$nextTick(()=>{
        this.$refs.tree.setCheckedKeys([]);
        this.getTreeCheck(item.menus)
        // console.log(item.menus)
        // console.log(this.defaultCheckedTreeShow)
      })
    },
    getTreeCheck(arr){
      if(arr.length>0){
        arr.map((item1,i)=>{
          if(item1.children){
            this.defaultCheckedTreeShow.push(item1.id)
            this.getTreeCheck(item1.children)
          }else{
            this.defaultCheckedTreeShow.push(item1.id)
          }
        })
      }
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let rule_ids
          if (this.clickFlag) {
            if( this.checkoutTree.length>0){
              rule_ids = this.checkoutTree.join(',')
            }else{
              rule_ids = ''
            }
          } else {
            if(this.defaultCheckedTree.length>0){
              rule_ids = this.defaultCheckedTree.join(',')
            }else{
              rule_ids = ''
            }
          }
          if (this.dialogTitle == '添加') {
            const params = {
              title:this.editForm.title,
              status:this.editForm.status,
              rules:rule_ids,
              platform:'service',
            }
            getRoleAdd(params).then(res => {
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
            const params = {
              id: this.editId,
              title:this.editForm.title,
              status:this.editForm.status,
              rules:rule_ids,
            }
            getRoleEdit(params).then(res => {
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
          getRoleDel(params).then(res => {
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
      if(this.multipleSelection.length==0){
        this.$message({
          type: 'warning',
          message: '请选择要删除的项'
        })
        return
      }
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
          getRoleDel(params).then(res => {
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
    //获取树形菜单
    getTreeData(){
      getTreeList({menu_type:'service'}).then(res=>{
        this.treeData = res.data.data
      })
    },
     // 点击树节点
    handleCheckChange(data) {
      this.clickFlag = true
      const res = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      this.checkoutTree = res
    },
    handleCheck(data) {
      this.clickFlag = true
      const node = this.$refs.tree.getNode(data.id)
      this.setNode(node)
    },
    //递归设置子节点和父节点
    setNode(node) {
      if (node.checked) {
      //如果当前是选中checkbox,则递归设置父节点和父父节点++选中
        this.setParentNode(node)
      } else {
      //如果当前是取消选中checkbox,则递归设置子节点全部取消选中
        this.setChildNode(node)
      }
    },
    //递归设置父节点全部选中
    setParentNode(node) {
      if (node.parent) {
        for (const key in node) {
          if (key === 'parent') {
            node[key].checked = true
            this.setParentNode(node[key])
          }
        }
      }
    },
    //递归设置子节点全部取消选中
    setChildNode(node) {
      if (node.childNodes && node.childNodes.length) {
        node.childNodes.forEach(item => {
          item.checked = false
          this.setChildNode(item)
        })
      }
    },
    // 点击全选还是全不选
    selectItem(flag) {
      this.clickFlag = true
      if (flag == '1') {
        let list = []
        let arr = this.getTreeCheckAll(this.treeData,list)
        this.$refs.tree.setCheckedKeys(arr)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    getTreeCheckAll(arr,list){
      list = list || []
      arr.forEach(item=>{
        (item.id || item.id == 0) && list.push(item.id)
        item.children && this.getTreeCheckAll(item.children,list)
      })
      return list
    },
    // 点击全部展开还是全部隐藏
    expandItem(flag) {
      this.refreshTree = false
      if (flag == '1') {
        this.expandStatus = true
      } else {
        this.expandStatus = false
      }
      this.$nextTick(() => {
        this.refreshTree = true
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
        getRoleEdit(params).then(res => {
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

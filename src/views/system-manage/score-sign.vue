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
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提示" align="center">
        <template slot-scope="{row}">
          <span>{{ row.prompt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未开通" align="center">
        <template slot-scope="{row}">
          <img :src="row.close_image_url" class="sign-img">
        </template>
      </el-table-column>
      <el-table-column label="已开通" align="center">
        <template slot-scope="{row}">
            <img :src="row.open_image_url" class="sign-img">
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
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
    <!-- <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" /> -->
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="80px" style="width:80%;margin-bottom:50px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="editForm.title" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="提示" prop="prompt">
          <el-input v-model="editForm.prompt" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="未开通" prop="close_image_id">
          <el-button type="primary" size="small" @click="selectImg('1')" class="select-img-btn">选择图片</el-button>
          <span v-if="close_image_url== '' || close_image_url== null"></span>
          <el-image v-else class="img-certificate" :src="close_image_url"></el-image>
        </el-form-item>
        <el-form-item label="已开通" prop="open_image_id">
          <el-button type="primary" size="small" @click="selectImg('2')" class="select-img-btn">选择图片</el-button>
            <span v-if="open_image_url== '' || open_image_url== null"></span>
            <el-image v-else class="img-certificate" :src="open_image_url"></el-image>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="editForm.sort" placeholder="请输入排序" oninput="value=value.replace(/[^\d]/g,'')"/>
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
    <!-- 图片库 -->
    <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
  </div>
</template>

<script>
import { getMemberRightList, getMemberRightAdd, getMemberRightEdit, getMemberRightDel } from '@/api/system-manage/score-sign'
import Pagination from '@/components/Pagination'
import ImgGallery from '@/components/ImgGallery'

import mix from '@/mixs/mix'
export default {
  components: { Pagination,ImgGallery },
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
        title: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        prompt: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        open_image_id: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        close_image_id: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      editForm: {
        name: ''
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        title:'',
        prompt:'',
        sort:0,
        open_image_id:'',
        close_image_id:'',
        status: '1'
      },
      editId: '',
      rolelist:[],
      editFlag:false,
      close_image_url:'',
      open_image_url:'',
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getMemberRightList(this.listQuery).then(res => {
        this.list = res.data.data
        // this.total = res.data.data.total
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
      this.editFlag = false
      this.editForm = {
        title:'',
        prompt:'',
        sort:0,
        open_image_id:'',
        close_image_id:'',
        status: '1'
      }
      this.close_image_url =''
      this.open_image_url = ''
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
    //选择图片
    selectImg(flag){
      this.$refs.imgGalleryChild.init(flag,0)
    },
    //获取选择的图片
    selectImgList(data){
      console.log(data)
      if(data.flag == '1'){
        this.close_image_url = data.item[0].file_url
        this.editForm.close_image_id = data.item[0].id
      }else if(data.flag == '2'){
        this.open_image_url = data.item[0].file_url
        this.editForm.open_image_id = data.item[0].id
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
      this.editForm.status = item.status.toString()
      this.close_image_url = item.close_image_url
      this.open_image_url = item.open_image_url
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle == '添加') {
            const params = this.editForm
              getMemberRightAdd(params).then(res => {
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
             getMemberRightEdit(params).then(res => {
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
          getMemberRightDel(params).then(res => {
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
          getMemberRightDel(params).then(res => {
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
        getMemberRightEdit(params).then(res => {
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
.sign-img{
  width: 30px;
  height: 30px;
}
.img-certificate{
  width: 80px;
  margin-top: 10px;
}
.select-img-btn{
  // position: relative;
  // top: -11px;
  display: block;
}
</style>

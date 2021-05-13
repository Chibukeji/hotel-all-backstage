<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <!-- <el-button class="filter-item" type="primary" size="mini" icon="el-icon-plus" @click="handleCreate">添加</el-button>
      <el-button class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore">删除</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="等级名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价" align="center" width="90">
        <template slot-scope="{row}">
          <span>{{ row.original_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动价" align="center"  width="90">
        <template slot-scope="{row}">
          <span>{{ row.activity_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未开通提示语" align="center">
        <template slot-scope="{row}">
          <span>{{ row.close_text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡片图片" align="center">
        <template slot-scope="{row}">
          <img :src="row.card_img_url" class="card-img">
        </template>
      </el-table-column>
       <el-table-column label="个人中心图片" align="center">
        <template slot-scope="{row}">
          <img :src="row.icon_url" class="card-img">
        </template>
      </el-table-column>
      <el-table-column label="状态颜色" align="center">
        <template slot-scope="{row}">
          <div class="color-block" :style="{background:row.status_color}"></div>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-button v-if="row.status==1" type="primary" size="mini" @click="handleStatus(row)">开启</el-button>
          <el-button v-if="row.status==0" type="danger" size="mini" @click="handleStatus(row)">禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini"  @click="handleConfig(row)">
            权益配置
          </el-button>
          <!-- <el-button size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="120px" style="width:80%;margin-bottom:50px">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入等级名称" />
        </el-form-item>
        <el-form-item label="活动价" prop="activity_price">
          <el-input v-model="editForm.activity_price" placeholder="请输入活动价" />
        </el-form-item>
        <el-form-item label="原价" prop="original_price">
          <el-input v-model="editForm.original_price" placeholder="请输入原价" />
        </el-form-item>
        <el-form-item label="未开通提示语" prop="close_text">
          <el-input type="textarea" rows="3" v-model="editForm.close_text" placeholder="请输入未开通提示语" />
        </el-form-item>
        <el-form-item  prop="status_color">
          <span slot="label">
            <span style="color:red">*</span>
            <span>状态颜色</span>
          </span>
          <el-color-picker v-model="editForm.status_color"></el-color-picker>
        </el-form-item>
        <el-form-item label="卡片图片" prop="card_img_id">
          <el-button type="primary" size="small" @click="selectImg('1')" style="display:block" >选择图片</el-button>
          <span v-if="card_img_url== '' || card_img_url== null"></span>
          <el-image v-else class="img-certificate" :src="card_img_url"></el-image>
        </el-form-item>
         <el-form-item label="个人中心图片" prop="icon_id">
          <el-button type="primary" size="small" @click="selectImg('2')" style="display:block" >选择图片</el-button>
          <span v-if="icon_url== '' || icon_url== null"></span>
          <el-image v-else class="img-certificate" style="width:68px" :src="icon_url"></el-image>
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
    <!-- 配置弹窗 -->
     <el-dialog :visible.sync="configDialogVisible" title="权益配置" class="right-dialog" custom-class="left">
      <el-tabs v-model="activeName">
        <el-tab-pane label="设置" name="first">
          <el-form ref="configForm" :model="configForm" label-position="left" label-width="120px" style="width:80%;margin-bottom:50px;margin-top:10px">
            <div  v-for="(item,index) in configItem" :key="index">
              <el-form-item v-if="item.is_show == 1">
                  <span slot="label" >
                    <span style="color:red">*</span>
                    <span>{{item.name}}</span>
                  </span>
                  <el-input  v-model="item.value" placeholder="请输入内容" />
              </el-form-item>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="选择权益" name="second">
          <el-form ref="configImgForm" :model="configImgForm" label-position="left" label-width="80px" style="width:100%;margin-bottom:50px;margin-top:10px">
            <el-form-item label="权益图标">
              <!-- <el-radio-group v-for="(item,index) in configImgList" :key="index" v-model="item.choose_img_url" class="my-radio-group"> -->
                <span v-for="(item,index) in configImgList" :key="index" class="my-radio-group">
                <span class="template-box" >
                  <img :src="item.choose_img_url" class="template-item" @click="clickImg(item)">
                  <!-- <el-radio  label="1"> -->
                    <span class="text-overflow" style="font-size:14px">{{item.title}}</span>
                    <div class="text-overflow" style="font-size:12px;margin-top: -12px;">{{item.prompt}}</div>
                  <!-- </el-radio> -->
                </span>
                </span>
              <!-- </el-radio-group> -->
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="configDialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="configHandle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 图片库 -->
    <img-gallery ref="imgGalleryChild" @selectImgList="selectImgList"/>
  </div>
</template>

<script>
import { getMemeberLevelList, getMemeberLevelAdd, getMemeberLevelEdit, getMemeberLevelDel,getMemeberRightList } from '@/api/member-level/member-level-list'
import Pagination from '@/components/Pagination'
import ImgGallery from '@/components/ImgGallery'

import mix from '@/mixs/mix'
export default {
  components: { Pagination,ImgGallery },
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
        name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        close_text: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        card_img_id: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        icon_id: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        original_price: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }
        ],
        activity_price: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入数字,可保留两位小数' }
        ],
      },
      editDialogVisible: false,
      dialogTitle: '',
      editForm: {
        name: '',
        close_text:'',
        status_color:'',
        card_img_id:'',
        status: '1',
        original_price:'',
        activity_price:'',
        icon_id:'',
      },
      editId: '',
      rolelist:[],
      editFlag:false,
      configItem:[],
      configDialogVisible:false,
      configDialogTitle:'',
      configForm:{},
      itemDetail:'',
      card_img_url:'',
      activeName:'first',
      configImgForm:{},
      configImgList:[],
      icon_url:'',
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getMemeberLevelList(this.listQuery).then(res => {
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
      this.editFlag = false
      this.editForm = {
        username: '',
        password: '',
        group_id: '',
        nickname: '',
        truename: '',
        mobile: '',
        status: '1',
        original_price:'',
        activity_price:'',
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
    //选择图片
    selectImg(flag){
      this.$refs.imgGalleryChild.init(flag,0)
    },
    //获取选择的图片
    selectImgList(data){
      // console.log(data)
      if(data.flag == '1'){
        this.card_img_url = data.item[0].file_url
        this.editForm.card_img_id = data.item[0].id
      }else if(data.flag == '2'){
        this.icon_url = data.item[0].file_url
        this.editForm.icon_id = data.item[0].id
      }
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
      this.editFlag = true
      for (const key in item) {
        if (this.editForm[key] != undefined) {
          this.editForm[key] = item[key]
        }
      }
      this.editForm.status = item.status.toString()
      this.editForm.card_img_id = item.card_img_id
      this.editForm.close_text = item.close_text
      this.icon_url = item.icon_url
      this.editForm.icon_id = item.icon_id
      this.editForm.status_color = item.status_color
      this.card_img_url = item.card_img_url
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if(this.editForm.status_color == '' || this.editForm.status_color == null){
            this.$message({
              type: 'warning',
              message: '请选择状态颜色!'
            })
            return
          }
          if (this.dialogTitle == '添加') {
            const params = this.editForm
              getMemeberLevelAdd(params).then(res => {
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
             getMemeberLevelEdit(params).then(res => {
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
    //修改配置
    handleConfig(item){
      this.itemDetail = item
      let str = item.config
      this.configItem = eval('(' + str + ')')
      this.configDialogVisible = true
      // console.log(this.configItem)
      //获取权益图片
      getMemeberRightList({id:item.id}).then(res=>{
        // console.log(res.data)
        this.configImgList = res.data
      })
    },
    //点击图片
    clickImg(item){
      if(item.choose_img_url == item.open_image_url){
        item.choose_img_url = item.close_image_url
      }else{
        item.choose_img_url = item.open_image_url
      }
      if(item.isActivation == 1){
        item.isActivation = 0
      }else{
        item.isActivation = 1
      }
    },
    configHandle(){
      let params
      if(this.activeName == 'first'){
        params={
          id: this.itemDetail.id,
          config:JSON.stringify(this.configItem)
        }
      }else if(this.activeName == 'second'){
        let arr = []
        this.configImgList.map(item=>{
          let json ={id:item.id,choose_img_url:item.choose_img_url,title:item.title,prompt:item.prompt,isActivation:item.isActivation}
          arr.push(json)
        })
        params={
          id: this.itemDetail.id,
          rights:JSON.stringify(arr)
        }
      }
      getMemeberLevelEdit(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.getList()
          this.configDialogVisible = false
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
          getMemeberLevelDel(params).then(res => {
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
          getMemeberLevelDel(params).then(res => {
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
        getMemeberLevelEdit(params).then(res => {
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
.img-certificate{
  width: 150px;
  margin-top: 10px;
}
.config-img-wrap{
  display: flex;
  flex-wrap: wrap;
  .config-img-box{
    
  }
}
.my-radio-group{
  margin-right: 10px;
  margin-bottom: 10px;
}
.template-box{
  text-align: center;
  display: inline-block;
  margin-right: 10px;
  width: 16%;
  .template-item{
    display: block;
    margin: 0 auto;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  // /deep/.el-radio__input{
  //   top: 70px;
  //   left: -20px;
  // }
  /deep/.el-radio__label{
    padding-left: 2px;
  }
  .text-overflow{
    display: inline-block;
    width: 100%;
    overflow: hidden;
    white-space:nowrap ;
    text-overflow: ellipsis;
  }
}
.card-img{
  height: 30px;
}
.color-block{
  width:30px;
  height:30px;
  margin: 0 auto;
}
</style>

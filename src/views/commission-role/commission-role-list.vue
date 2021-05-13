<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <span class="filter-item top-span" >当前系统可分佣：{{rate}}%，</span>
      <span class="filter-item">可分配佣金：{{userRate}}%（公式：{{rate}}%*{{userRate}}%={{multiplyRate}}%）</span>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基数" align="center">
        <template slot-scope="{row}">
          <span>{{multiplyRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="分佣比例" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低提现额度" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lowest_withdraw }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="right-dialog" custom-class="left">
      <el-form ref="editForm" :rules="rules" :model="editForm" label-position="left" label-width="110px" style="width:100%;margin-bottom:50px">
        <el-form-item label="名称" prop="name" style="width:80%;">
          <el-input v-model="editForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="分佣百分比" prop="rates" style="width:80%;">
          <el-input v-model="editForm.rates" placeholder="请输入分佣百分比" oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
        <el-form-item label="最低提款额度" prop="lowest_withdraw" style="width:80%;">
          <el-input v-model="editForm.lowest_withdraw" placeholder="请输入最低提款额度" oninput="value=value.replace(/[^\d]/g,'')" />
        </el-form-item>
        <el-form-item label="提现手续费">
          <el-button type="primary" size="small" @click="addCashList">添加</el-button>
          <el-table :data="cashList" border fit highlight-current-row style="width: 100%;margin-top:10px">
            <!-- <el-table-column label="ID" prop="id" align="center" width="60"/> -->
            <el-table-column label="区间" align="center">
              <template slot-scope="{row}">
                <el-input v-model="row.min" class="input-section" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                ~
                <el-input v-model="row.max" class="input-section" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="动态比例(千分比)" align="center" width="90">
              <template slot-scope="{row,$index}">
                <el-input v-model="row.rate" class="input-section" @change="changeDynamic($event,$index)" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="固定收取(元)" align="center" width="90">
              <template slot-scope="{row,$index}">
                <el-input v-model="row.money" class="input-section" @change="changeFixed($event,$index)" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="{row,$index}">
                <el-button v-if="$index>0" type="danger" size="small" @click="delCashList(row,$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
import { getCommissionsRateList, getCommissionsRateEdit,getCommissionsRateNum } from '@/api/commission-role/commission-role-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
import { number } from 'echarts/lib/export'
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
      rules: {
        name: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        rates: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        lowest_withdraw: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
      },
      editForm: {
        name: '',
        rates:'',
        lowest_withdraw:'',
      },
      editDialogVisible: false,
      dialogTitle: '',
      editId: '',
      editFlag:false,
      cashList:[],
      rate:'',
      userRate:'',
      multiplyRate:'',
    }
  },
  mounted() {
    this.getList()
    this.getCommissionsRatePercent()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getCommissionsRateList(this.listQuery).then(res => {
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
    //获取分佣百分比
    getCommissionsRatePercent(){
      getCommissionsRateNum().then(res=>{
        this.rate = res.data.commission
        this.userRate= res.data.commission_rate
        this.multiplyRate= (Number(this.rate)  * Number(this.userRate) )/100
      })
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
      this.cashList = item.charges
    },
    //增加提现手续费
    addCashList(){
      let json={min:'',max:'',rate:1,money:0}
      this.cashList.push(json)
    },
    //删除提现手续费
    delCashList(row,i){
      this.$confirm('确认要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         this.cashList.splice(i,1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    //修改动态比例
    changeDynamic(rate,i){
      this.cashList[i].money = 0
    },
    //修改
    changeFixed($event,i){
      this.cashList[i].rate = 0
    },
    // 弹窗确定
    submitHandle() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
         if (this.dialogTitle == '编辑') {
           for(let i = 0;i<this.cashList.length;i++){
             let item = this.cashList[i]
              if(item.min == null || item.min == '' || item.max == null || item.max == ''){
                this.$message({
                  type: 'warning',
                  message: '请填写区间!'
                })
                return
             }
             if(Number(item.min)  < Number(item.money)){
                this.$message({
                  type: 'warning',
                  message: '固定收取数不能大于区间最小数!'
                })
                return
             }
             if(i<this.cashList.length-1){
              // console.log(item.max,this.cashList[i+1].min)
              if(Number(item.max) >= Number(this.cashList[i+1].min)){
                this.$message({
                  type: 'warning',
                  message: '各区间的数不能重叠!'
                })
                return
              }
             }
            //  let condition1 = (item.rate == null || item.rate == '')
            //  let condition2 = (item.money == null || item.money == '')
            //  if(item.rate == '' && item.money == ''){
            //    this.$message({
            //       type: 'warning',
            //       message: '请填写动态比例或固定收取!'
            //     })
            //     return
            //  }
           }
            let params = {
              id: this.editId,
              name:this.editForm.name,
              rates:this.editForm.rates,
              lowest_withdraw:this.editForm.lowest_withdraw,
              charges:JSON.stringify(this.cashList)
            }
            getCommissionsRateEdit(params).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
.input-section{
  display: inline-block;
  width:60px;
  /deep/.el-input__inner{
    padding: 0 5px;
  }
}
.top-span{
  display: inline-block;
  margin-left: 20px;
}
</style>

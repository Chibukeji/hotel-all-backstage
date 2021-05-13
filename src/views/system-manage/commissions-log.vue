<template>
  <div>
    <div class="filter-container">
      <span class="filter-item">
        <span class="select-title">会员：</span>
        <el-select  v-model="listQuery.member_id" filterable clearable remote placeholder="请输入会员昵称搜索"
          :remote-method="remoteMethod" :loading="loadingSearch" style="width:250px">
          <el-option v-for="item in memberList" :key="item.id" :label="item.nickname" :value="item.id" >
            <img :src="item.head_pic" style="width:20px;height:20px;vertical-align: middle;margin-right:2px">
            <span style="vertical-align: middle;">{{item.nickname}}(id:{{item.id}})</span>
          </el-option>
        </el-select>
      </span>
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <!-- <el-button  class="filter-item" type="danger" size="mini" icon="el-icon-close" @click="delMore()">删除</el-button> -->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="订单号" align="left" >
        <template slot-scope="{row}">
          <span>{{ row.order_sn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员" align="left"   :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <div style="display:flex">
            <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
            <img v-else :src="row.head_pic" class="heder-img">
            <span class="member-name">{{row.member_name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="佣金" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.moneys }}</span>
        </template>
      </el-table-column>
       <el-table-column label="分佣级别" align="center" >
          <template slot-scope="{row}">
            <span>{{ row.rate_name }}</span>
          </template>
        </el-table-column>
       <el-table-column label="时间" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" width="150" class-name="fixed-width">
        <template slot-scope="{row,$index}">
          <el-button  size="mini" type="danger" icon="el-icon-close" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
  </div>
</template>

<script>
import { getCommissionsLogList,getCommissionsLogDel} from '@/api/system-manage/commissions-log'
import { getAllMemberList } from '@/api/system-manage/user-list'
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        member_id: '',
        page: 1,
        size: 20
      },
      total: 0,
      listLoading: false,
      list: [],
      multipleSelection: [],
      btnAry:[],
      loadingSearch:false,
      memberList:[],
    }
  },
  mounted () {
    this.getList();
    // this.$store.dispatch('user/showBtn', { id: 619 }).then(res => {
    //   // console.log('res', res)
    //   this.btnAry = res.children
    // })
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      getCommissionsLogList(this.listQuery).then(res => {
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      })
    },
     //刷新
    refresh(){
      this.listQuery = {
        member_id: '',
        page: 1,
        size: 20,
      }
      this.getList();
    },
    // 搜索会员
    remoteMethod(query) {
      if (query !== '') {
        this.loadingSearch = true
        getAllMemberList({ keyword: query, page: 1, size: 20,}).then(res => {
          this.loadingSearch = false
          this.memberList = res.data.data.data
        })
      } else {
        this.memberList = []
      }
    },
    // 勾选表格内容
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    //搜索
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
    // 删除单条数据
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
          getCommissionsLogDel(params).then(res => {
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
     //删除多条数据
    delMore() {
      if(this.multipleSelection.length == 0){
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
          getCommissionsLogDel(params).then(res => {
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
  }
}
</script>

<style lang="scss" scoped>
.heder-img{
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.member-name{
  vertical-align: middle;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;
}
</style>

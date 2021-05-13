<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="95%" class="center-dialog">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="房型订单" name="first"></el-tab-pane>
        <el-tab-pane label="会员订单" name="second"></el-tab-pane>
        <div class="filter-container">
            <span class="filter-item">
                <span class="select-title">时间：</span>
                <el-date-picker v-model="dateRange" type="monthrange" range-separator="至" start-placeholder="开始日期" 
                end-placeholder="结束日期" style="width: 280px"  value-format="yyyy-MM" :picker-options="pickerOptionsStart">
                </el-date-picker>
            </span>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
             <el-table-column v-if="activeName == 'second'" label="会员ID" align="center" width="80">
                <template slot-scope="{row}">
                <span>{{ row.member_id }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="activeName == 'second'" label="会员" align="left" >
                <template slot-scope="{row}">
                    <div style="display:flex"> 
                        <img :src="row.head_pic" class="heder-img">
                        <span class="member-name">{{row.nickname}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="房型ID" align="center" width="80">
                <template slot-scope="{row}">
                <span>{{ row.room_id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="房型名称" align="left">
                <template slot-scope="{row}">
                <span>{{ row.room_name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单数" align="center" width="120">
                <template slot-scope="{row}">
                  <span class="link-type" @click="orderDetail(row)">{{ row.num }}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
      </el-tabs>
    </el-dialog>
    <order-detail ref="orderDetailChild"/>
  </div>
</template>

<script>
import { getRoomByOrder,getMemberOrder } from '@/api/hotel-data/list'
// import { getMemberOrder} from "@/api/member-data/list";
import Pagination from '@/components/Pagination'
import OrderDetail from './order-detail'
export default {
  components: { Pagination,OrderDetail },
  data() {
    return {
      dialogTitle: "",
      detailDialogVisible: false,
      activeName: "first",
      detailItem:'',
      dateRange:[],
      listQuery:{
        hotel_id:'',
        start_time:'',
        end_time:'',
        page: 1,
        size: 10,
      },
      total: 0,
      list: [],
      listLoading:false,
      dateRange:[],
      pickerOptionsStart: {
          disabledDate: time => {
              var times = Date.now()
              return time.getTime() > times;
          }
      },
      room_id:'',
    };
  },
  mounted() {

  },
  methods: {
    init(item,dateRange) {
        this.room_id = ''
        this.detailDialogVisible = true
        this.detailItem = item
        this.dialogTitle = `${item.title}`
        this.listQuery.page = 1
        this.listQuery.hotel_id = item.hotel_id
        if(dateRange == null){
          var today = new Date()
          var year1=today.getFullYear();
          var month1= today.getMonth()+1;
          let month2 = '',year2 = ''
          if(month1 == 1){
              month2 = 12
              year2 = year1-1
          }else{
              month2 = month1 - 1
              year2 = year1
          }
          let month3 = month1<10 ? "0"+month1 :month1
          let month4 = month2<10 ? "0"+month2 : month2
          let time1 =  `${year1}-${month3}`
          let time2 =  `${year2}-${month4}`
          this.dateRange =[time2,time1]
        }else{
          this.dateRange = dateRange
        }
        this.handleClick()
    },
    handleClick(){
      if(this.activeName == "first"){
        this.roomList()
      }else if(this.activeName == "second"){
        this.room_id = ''
        this.memberList()
      }
    },
    //获取订单信息
    roomList(){
      this.listLoading = true
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] 
        this.listQuery.end_time = this.dateRange[1] 
      }
      getRoomByOrder(this.listQuery).then(res=>{
        this.list = res.data.data
        this.total = res.data.total
        this.listLoading = false
      })
    },
    //获取会员信息
    memberList(){
      this.listLoading = true
      if (this.dateRange == null || this.dateRange.length == 0) {
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      } else {
        this.listQuery.start_time = this.dateRange[0] 
        this.listQuery.end_time = this.dateRange[1] 
      }
      let params = Object.assign(this.listQuery,{room_id:this.room_id})
      getMemberOrder(params).then(res=>{
        this.list = res.data.data
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.handleClick()
    },
    //点击订单数
    orderDetail(row){
      if(this.activeName == 'first'){
        this.room_id = row.room_id
        this.activeName = 'second'
        this.memberList()
      }else if(this.activeName == 'second'){
        this.$refs.orderDetailChild.init(row,this.listQuery.hotel_id)
      }
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.handleClick()
    },
  },
};
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
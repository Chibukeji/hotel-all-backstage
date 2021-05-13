<template>
  <div>
    <el-dialog :visible.sync="detailDialogVisible" :title="dialogTitle" width="95%" class="center-dialog">
        <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="订单号" fixed align="center" >
                <template slot-scope="{row}">
                <span >{{ row.order_sn }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center" >
                <template slot-scope="{row}">
                <span>{{row.link_phone}}</span>
                </template>
            </el-table-column>
            <el-table-column label="下单日期/离店日期" align="center" >
                <template slot-scope="{row}">
                <div>{{ row.create_time }}</div>
                <div>
                    <span v-if="row.finish_time == null || row.finish_time == ''">-</span>
                    <span v-else>{{row.finish_time}}</span>
                </div>
                </template>
            </el-table-column>
            <el-table-column label="数量" align="center" width="100">
                <template slot-scope="{row}">
                <div>{{row.total_num}}间房</div>
                <div>{{row.booking_num}}晚</div>
                </template>
            </el-table-column>
            <el-table-column label="总价" align="center" width="80">
                <template slot-scope="{row}">
                <span>{{row.total_price}}</span>
                </template>
            </el-table-column>
            <el-table-column label="实收金额/积分" align="center" width="110">
                <template slot-scope="{row}">
                <span>{{row.total_pay_price}}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单状态" align="center"  width="110">
                <template slot-scope="{row}">
                    <span v-if="row.status == 0" >待处理</span>
                    <span v-if="row.status == 1" >待付款</span>
                    <span v-if="row.status == 2" >待酒店接受</span>
                    <span v-if="row.status == 3" >订单取消</span>
                    <span v-if="row.status == 4" >已退款</span>
                    <span v-if="row.status == 5" >已接受待入住</span>
                    <span v-if="row.status == 6" >已入住</span>
                    <span v-if="row.status == 7" >交易完成</span>
                    <span v-if="row.status == 8" >退款申请</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getMemberOrderDetail } from '@/api/hotel-data/list'
export default {
  components: { Pagination },
  data() {
    return {
      dialogTitle: "",
      detailDialogVisible: false,
      detailItem:'',
      dateRange:[],
      listQuery:{
        page: 1,
        size: 10,
        hotel_id:'',
        room_id:'',
        status:7,
        member_id:'',
      },
      total: 0,
      list: [],
      listLoading:false,
      time:'',
    };
  },
  mounted() {},
  methods: {
    init(item,hotel_id) {
        this.detailDialogVisible = true
        this.detailItem = item
        this.dialogTitle = `${item.nickname}-订单`
        this.listQuery.page = 1
        this.listQuery.hotel_id = hotel_id
        if(item.room_id != undefined){
          this.listQuery.room_id = item.room_id
        }
        this.listQuery.member_id = item.member_id
        this.orderList()
    },
    //获取会员订单信息
    orderList(){
      this.listLoading = true
      getMemberOrderDetail(this.listQuery).then(res=>{
        this.list = res.data.data.data
        this.total = res.data.data.total
        this.listLoading = false
      });
    },
    // 点击搜索
    handleFilter() {
      this.listQuery.page = 1
      this.orderList()
    },
    // 点击翻页
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.orderList()
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
<template>
    <div>
        <el-dialog :visible.sync="merchantDialogVisible" title="关联酒店列表" width="90%" class="center-dialog">
            <div style="margin-bottom:30px">
                <el-radio-group v-model="radioType" @change="changeType">
                    <el-radio :label="1">全部</el-radio>
                    <el-radio :label="2">关联酒店</el-radio>
                </el-radio-group>
            </div>
            <div v-show="radioType == 2">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="已关联酒店" name="first">
                        <div class="filter-container">
                            <el-input v-model="listQuery.hotel_name" placeholder="酒店名称" style="width: 350px" class="filter-item" />
                            <span class="filter-item" style="margin-right:20px">
                                <span class="select-title">时间：</span>
                                <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
                                end-placeholder="结束日期" style="width: 280px"  value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </span>
                            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                        </div>
                        <div class="content-box">
                            <!-- <div class="filter-container" style="margin:5px 0px">
                                    <div class="right-font">
                                        <span  style="margin-right:10px">统计：</span>
                                    <span  style="margin-right:10px">酒店：<span class="top-num">{{totalData.hotel_count}}</span>个</span>
                                    <span  style="margin-right:10px">佣金：<span class="top-num">￥{{totalData.commission_sum}}</span>元</span>
                                </div>
                            </div> -->
                            <el-table v-loading="listLoading" ref="multipleTable" :data="list" border fit row-key="id" highlight-current-row style="width: 100%;margin-bottom:20px" @selection-change="handleDelChange">
                                <el-table-column type="selection" width="55" :reserve-selection="true" align="center" />
                                <el-table-column label="酒店ID" prop="id" align="center" width="80" />
                                <el-table-column label="酒店名称" align="left">
                                    <template slot-scope="{row}">
                                        <span>{{ row.title }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="所属商家" prop="merch_name" align="left" />
                                <!-- <el-table-column label="到期时间" align="center" width="200">
                                    <template slot-scope="{row}">
                                        <el-date-picker v-model="row.service_expire_time" type="date" placeholder="选择日期" style="width:160px"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions0" @change="setAgentTime(row)" />
                                    </template>
                                </el-table-column> -->
                                <el-table-column label="佣金" prop="commission_sum" align="center" width="160" />
                                <el-table-column label="绑定时间" prop="service_set_time" align="center" width="160"/>
                                <el-table-column label="操作" align="center" width="180">
                                    <template slot-scope="{row}">
                                        <!-- <el-button type="primary" size="mini" @click="rateDetail(row)" >分佣明细</el-button> -->
                                        <el-button size="mini" type="danger" @click="handleDelBookCode(row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination  :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size"  @pagination="paginHandle" style="margin-bottom: 40px;" />
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="选择酒店" name="second"></el-tab-pane>
                </el-tabs>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center;" v-show="radioType == 2">
                <el-button size="small" @click="merchantDialogVisible = false">取消</el-button>
                <el-button size="small" type="danger" @click="delBookListCode">批量删除</el-button>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: center;" v-show="radioType == 1">
                <el-button size="small" @click="merchantDialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleSure">确定</el-button>
            </div>
        </el-dialog>
        <!-- 佣金详情 -->
        <!-- <rate-detail ref="rateDetailChild" /> -->
        <!-- 选择酒店 -->
        <select-hotel ref="selectHotelChild" @successPoP="successPoP"/>
    </div>
</template>

<script>
// import { getHotelList,getHotelCate,getRelatedHotelList,delRelatedHotel } from '@/api/service-manage/service-list'
import { getUserEdit,getAdminHotelList,unsetAdminHotel} from '@/api/system-manage/user-list'
import Pagination from '@/components/Pagination'
// import RateDetail from './rate-detail'
import SelectHotel from './select-hotel'
    export default {
        components: { Pagination,SelectHotel},
        data() {
            return {
                merchantDialogVisible: false,
                listQuery: {
                    admin_id:'',
                    hotel_name:'',
                    start_time:'',
                    end_time:'',
                    page: 1,
                    size: 10,
                },
                total:0,
                loadingSearch:false,
                hotelList:[],
                listLoading:false,
                list:[],
                multipleSelection: [],
                detailItem:'',
                hotelCateList:[],
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                    }
                },
                dateRange:[],
                totalData: {
                    commission_sum: 0, 
                    hotel_count: 0
                },
                radioType:1,
                activeName:'first',
            }
        },
        methods: {
            // 搜索酒店
            init(item){
                this.merchantDialogVisible = true
                this.detailItem = item
                this.listQuery.admin_id = item.id
                this.listQuery.page = 1
                this.activeName = 'first'
                if(this.radioType == 2){
                    this.getHotel()
                }
            },
            changeType(){
                if(this.radioType == 2){
                    this.getHotel()
                }
            },
            handleDelChange(val) {
                this.multipleSelection = val
            },
            getHotel(){
                this.listLoading = true
                if (this.dateRange == null || this.dateRange.length == 0) {
                    this.listQuery.start_time = ''
                    this.listQuery.end_time = ''
                } else {
                    this.listQuery.start_time = this.dateRange[0] 
                    this.listQuery.end_time = this.dateRange[1] 
                }
                getAdminHotelList(this.listQuery).then(res=>{
                    this.list = res.data.data
                    this.total = res.data.total
                    // this.totalData = res.data.totalData
                    this.listLoading = false
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getHotel()
            },
            // 翻页
            paginHandle(val) {
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery.page = parseInt(json.page)
                    this.listQuery.size = parseInt(json.limit)
                }
                this.getHotel()
            },
            //删除单条关联数据
            handleDelBookCode(row) {
                this.$confirm('确认要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const params = {
                        admin_id: this.detailItem.id,
                        hotel_ids: row.id
                    }
                    unsetAdminHotel(params).then(res => {
                        if (res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            })
                            this.getHotel()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            // 批量删除关联酒店
            delBookListCode() {
                if (this.multipleSelection.length == 0) {
                    this.$message({
                        type: 'warning',
                        message: '请先选择要删除的酒店'
                    })
                    return
                }
                this.$confirm('确认要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const idArr = this.multipleSelection.map(x => { return x.id })
                    const params = {
                        admin_id: this.detailItem.id,
                        hotel_ids: idArr.join(',')
                    }
                    unsetAdminHotel(params).then(res => {
                        if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.getHotel()
                        this.multipleSelection = []
                        this.$refs.multipleTable.clearSelection()
                        }
                    })
                }).catch(() => {
                    this.$message+({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            //切换tab
            handleClick(){
                if(this.activeName == 'first'){
                   
                }else if(this.activeName == 'second'){
                    this.$refs.selectHotelChild.init(this.detailItem)
                }
            },
            //点击选择酒店确定按钮
            successPoP(){
                this.activeName = 'first'
                this.listQuery.page = 1
                this.getHotel()
            },
            //点击确定
            handleSure(){
                let params = {
                    id: this.detailItem.id,
                    all_hotel:'1'
                }
                getUserEdit(params).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        })
                    }
                })
            },
            // 查看佣金
            rateDetail(row) {
                let params = {
                    hotelItem:row,
                    serviceItem:this.detailItem
                }
                this.$refs.rateDetailChild.init(params)
            },
            // 修改时间
            setAgentTime(row) {
                const params = {
                    admin_id: this.detailItem.id,
                    infos: [{ hotel_id: row.id, service_expire_time: row.service_expire_time }]
                }
                getRelatedHotelList(params).then((res) => {
                    if (res.code == 0) {
                        // this.merchantDialogVisible = false
                        this.$message.success('修改成功')
                        this.$emit('successPoP')
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
.nove-type{
  /deep/ .el-radio-button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
   /deep/.el-radio-button:first-child .el-radio-button__inner{
       border-radius: 0;
  }
  /deep/.el-radio-button:last-child .el-radio-button__inner{
        border-radius: 0; 
  } 
  /deep/.el-radio-button__inner{
      border-left: 1px solid #DCDFE6;
  }
  /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
      border-left: 1px solid #1890ff;
  }
}
.filter-container{
    display: flex;
    // justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .right-font{
        // font-size: 14px;
        margin-left: 10px;
        margin-right: 30px;
        .top-num{
            color:red;
            margin-right: 2px;
        }
    }
}
</style>
<template>
    <div class="member-active-page">
        <el-tabs type="card" v-model="activeType" @tab-click="handleClickPie">
            <el-tab-pane label="个数" name="first"></el-tab-pane>
            <el-tab-pane label="金额" name="second"></el-tab-pane>
        </el-tabs>
        <div class="top-box">
            <div class="echarts-wrap">
                <!-- <div class="big-title">财务</div> -->
                <div style="margin-bottom:10px">总数：
                    <span></span>
                    <span>{{totalNum}}</span>
                    <span v-if="activeType == 'first'">个</span>
                    <span v-if="activeType == 'second'">元</span>
                </div>
                <div ref="echarts1" class="my-echarts"></div>
            </div>
            <div class="echarts-wrap">
                <div style="margin-bottom:10px">&nbsp;</div>
                <!-- <div class="big-title">订单来源</div> -->
                <div ref="echarts2" class="my-echarts"></div>
            </div>
        </div>
        <div class="table-wrap">
            <div class="filter-container">
                <span class="filter-item">
                    <span class="select-title">时间：</span>
                    <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" 
                    end-placeholder="结束日期" style="width: 280px"  value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </span>
                <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="first"></el-tab-pane>
                <el-tab-pane label="未结算" name="second"></el-tab-pane>
                <el-tab-pane label="待审核 " name="third"></el-tab-pane>
                <el-tab-pane label="已结算" name="fourth"></el-tab-pane>
                <el-tab-pane label="未通过" name="fifth"></el-tab-pane>
            </el-tabs>
            <div class="table-box">
                <el-table v-loading="listLoading1" :data="list1" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="ID" align="center" width="80">
                        <template slot-scope="{row}">
                        <span>{{ row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结算时间" align="center" width="120">
                        <template slot-scope="{row}">
                        <span>{{ row.time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商家名称" align="left" :show-overflow-tooltip="true">
                        <template slot-scope="{row}">
                        <span>{{ row.merch_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="酒店名称" align="left" :show-overflow-tooltip="true">
                        <template slot-scope="{row}">
                        <span>{{ row.hotel_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总金额" align="center" width="120">
                        <template slot-scope="{row}">
                        <span>{{ row.all_amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="实收金额" align="center" width="120">
                        <template slot-scope="{row}">
                        <span>{{ row.total_amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="酒店结算金额" align="center" width="120">
                        <template slot-scope="{row}">
                        <span>{{ row.hotel_amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="提现状态" align="center" width="120">
                        <template slot-scope="{row}">
                        <span v-if="row.status == 0">未结算</span>
                        <span v-if="row.status == 1">待审核</span>
                        <span v-if="row.status == 2">已结算</span>
                        <span v-if="row.status == 3">未通过</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="平台抽佣" align="center" width="120">
                        <template slot-scope="{row}">
                        <span>{{ row.profit_amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="会员佣金" align="center" width="120">
                        <template slot-scope="{row}">
                        <span>{{ row.member_amount }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="total1" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
            </div>
        </div>
    </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入饼图
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
import Pagination from '@/components/Pagination'
import { getFincesPie,getFincesList } from "@/api/finance-data/list";
    export default {
        components: { Pagination },
        data() {
            return {
                listLoading1:false,
                list1:[],
                total1:0,
                listQuery:{
                   page:1, 
                   size:20,
                   start_time:'',
                   end_time:'',
                },
                activeMemberList:{
                    legendData: ['未结算', '已结算', '待审核'],
                    data: [{value: 335, name: '未结算'},{value: 310, name: '已结算'},{value: 234, name: '待审核'}]
                },
               timeQuantumList:{
                    legendData: ['月', '季度', '年度'],
                    data: [{value: 335, name: '月'},{value: 310, name: '季度'},{value: 234, name: '年度'}]
                },
                activeName:'first',
                activeType:'first',
                dateRange:[],
                totalNum:0,
                obj:'count'
            }
        },
        mounted () {
            this.$nextTick(()=>{
                let dom = this.$refs.echarts1
                this.getPieData('status',dom)
                let dom2 = this.$refs.echarts2
                this.getPieData('time',dom2)
                this.getList()
            })
        },
        methods: {
            //切换饼图
            handleClickPie(){
                if(this.activeType == 'first'){
                    this.obj = 'count'
                }else if(this.activeType == 'second'){
                    this.obj = 'sum'
                }
                let dom = this.$refs.echarts1
                this.getPieData('status',dom)
                let dom2 = this.$refs.echarts2
                this.getPieData('time',dom2)
            },
            // 获取饼图数据
            getPieData(type,dom){
                this.totalNum = 0
                let params={
                    type:type,
                    obj:this.obj
                }
                getFincesPie(params).then(res=>{
                    if(res.code == 0){
                        let json= {
                            legendData: [],
                            data: []
                        }
                        res.data.map((item2)=>{
                            json.legendData.push(item2.type)
                            json.data.push({value: item2.num, name: item2.type})
                            if(type == 'status'){
                                this.totalNum = (this.totalNum*100+ item2.num*100)/100
                            }
                        })
                        //饼图
                        this.init(json,dom)
                    }
                })
            },
            //初始化数据
            init(activeMemberList,dom){
                let unit = ''
                if(this.activeType == 'first'){
                    unit = '个'
                }else if(this.activeType == 'second'){
                    unit = '元'
                }
                let myChart = this.$echarts.init(dom);
                let option = {
                    title: {
                        text: '',
                        subtext: '',
                        left: 'center'
                    },
                    tooltip: {
                        show: false,
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        show:false,
                        orient: 'vertical',
                        left: 'right',
                        data: activeMemberList.legendData
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '70%',
                            center: ['35%', '55%'],
                            data:activeMemberList.data,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                normal: {
                                    show:true,
                                    formatter: '{a} {b} : {c}'+unit+'  ({d}%)',   //设置标签显示内容 ，默认显示{b}
                                }
                            }

                        }
                    ]
                };
                // myChart.setOption(option,window.onresize = myChart.resize)
                myChart.setOption(option)
            },
            getList(){
                this.listLoading1 = true
                let type = ''
                if(this.activeName == 'first'){
                    type = ''
                }else if(this.activeName == 'second'){
                    type = '0'
                }else if(this.activeName == 'third'){
                    type = '1'
                }else if(this.activeName == 'fourth'){
                    type = '2'
                }else if(this.activeName == 'fifth'){
                    type = '3'
                }
                if (this.dateRange == null || this.dateRange.length == 0) {
                    this.listQuery.start_time = ''
                    this.listQuery.end_time = ''
                } else {
                    this.listQuery.start_time = this.dateRange[0] / 1000
                    this.listQuery.end_time = this.dateRange[1] / 1000
                }
                let params={
                    page:this.listQuery.page, 
                    size:this.listQuery.size,
                    start_time:this.listQuery.start_time,
                    end_time:this.listQuery.end_time,
                    status:type
                }
                getFincesList(params).then(res=>{
                    this.list1 = res.data.data.data
                    this.total1 = res.data.data.total
                    this.listLoading1 = false
                })
            },
            handleFilter(){
                this.listQuery.page = 1
                this.getList()
            },
            handleClick(){
                this.listQuery.page = 1
                this.getList()
            },
            paginHandle(val){
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery.page = parseInt(json.page)
                    this.listQuery.size = parseInt(json.limit)
                }
                this.getList()
            }
        },
    }
</script>

<style lang="scss" scoped>
.member-active-page{
    .top-box{
        display: flex;
        // width: 80%;
        box-shadow: 0px 0px 5px 5px rgba(0,21,41,0.08);
        padding: 15px;
        .big-title{
            font-size: 24px;
        }
    }
    .table-wrap{
        // display: flex;
        // justify-content: space-between;
        // flex-wrap: wrap;
        margin-top: 20px;
        .table-box{
            
        }
    }
     .echarts-wrap{
        width: 50%;
        border-right: 1px solid #dedede;
        .my-echarts{
            height: 160px;
            width: 100%;
            margin: 0px 0 20px;
            padding-right: 20px;
            box-sizing: border-box;
            text-align: right;
        }
    }
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
}
</style>
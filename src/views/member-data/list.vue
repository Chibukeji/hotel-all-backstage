<template>
    <div class="member-active-page">
        <div class="left-box">
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="性别" name="first"></el-tab-pane>
                <el-tab-pane label="区域" name="second"></el-tab-pane>
                <el-tab-pane label="来源" name="third"></el-tab-pane>
                <el-tab-pane label="交易数" name="fourth"></el-tab-pane>
            </el-tabs>
            <div class="top-box">
                <div class="big-title">会员</div>
                <!-- <div ref="echarts" class="my-echarts"></div> -->
                <div v-show="activeName != 'second'">
                    <div  ref="echarts" class="my-echarts" style="height:300px"></div>
                </div>
                <div class="scroll-box" v-show="activeName == 'second'">
                    <div  ref="echarts2" class="my-echarts2"></div>
                </div>
            </div>
            <div class="table-wrap">
                <div  class="filter-container">
                    <span class="filter-item">
                        <el-cascader v-model="placeOrigin" :options="siteOptions" :props="belongRegoinProps"  clearable placeholder="选择区域" style="width:300px"></el-cascader>
                    </span>
                    <span class="filter-item">
                        <el-select v-model="listQuery1.sex" placeholder="选择性别" style="width: 160px">
                            <el-option label="全部" value="" />
                            <el-option label="未知" value="0" />
                            <el-option label="男" value="1" />
                            <el-option label="女" value="2" />
                        </el-select>
                    </span>
                    <span class="filter-item">
                        <el-select v-model="listQuery1.source" placeholder="选择来源" style="width: 160px">
                            <el-option label="全部" value="" />
                            <el-option label="公众号" value="0" />
                            <el-option label="苹果" value="2" />
                            <el-option label="安卓" value="1" />
                        </el-select>
                    </span>
                    <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                </div>
                <div class="table-box">
                    <el-table v-loading="listLoading1" :data="list1" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="ID" align="center" width="80">
                            <template slot-scope="{row}">
                            <span>{{ row.id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="会员" align="left" >
                            <template slot-scope="{row}">
                                <div style="display:flex"> 
                                    <img :src="row.head_pic" class="heder-img">
                                    <span class="member-name">{{row.nickname}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="性别" align="center">
                            <template slot-scope="{row}">
                            <span v-if="row.sex == 0">未知</span>
                            <span v-if="row.sex == 1">男</span>
                            <span v-if="row.sex == 2">女</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="来源" align="center">
                            <template slot-scope="{row}">
                            <span>{{ row.source_name }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :total="total1" :page.sync="listQuery1.page" :limit.sync="listQuery1.size" @pagination="paginHandle1" />
                </div>
            </div>
        </div>
        <div class="right-box">
            <div class="right-top-box">
                <div class="big-title">会员订单排名</div>
            </div>
            <div class="table-wrap">
                <div class="table-box">
                    <el-table v-loading="listLoading2" :data="list2" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="排名" align="center" width="60">
                            <template slot-scope="{row,$index}">
                                <span :class="`ranking${$index}`">{{$index+1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="会员ID" align="center" width="80" >
                            <template slot-scope="{row}">
                            <span>{{ row.member_id }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="会员" align="left" :show-overflow-tooltip="true">
                            <template slot-scope="{row}">
                                <div style="display:flex"> 
                                    <img :src="row.head_pic" class="heder-img">
                                    <span class="member-name">{{row.nickname}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单数量" align="center" width="80">
                            <template slot-scope="{row}">
                            <span class="link-type" @click="orderDetail(row)">{{ row.num }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.size" @pagination="paginHandle2" />
                </div>
            </div>
        </div>
        <order-detail ref="orderDetailChild"/>
    </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入饼图
require('echarts/lib/chart/pie');
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
import Pagination from '@/components/Pagination'
import { memberPieList,memberOrderNum,memberList } from "@/api/member-data/list";
import { allAddressList } from '@/api/common'
import OrderDetail from '../hotel-data/components/order-detail'

    export default {
        components: { Pagination,OrderDetail },
        data() {
            return {
                belongRegoinProps: {
                    checkStrictly: true,
                    value:'code',
                    label:'name',
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                    this.$nextTick(()=>{
                        this.getAreaForLazyLoad(node, resolve)
                    })
                    }
                },//级联框prop
                listLoading1:false,
                list1:[],
                total1:0,
                listQuery1:{
                   page:1, 
                   size:20,
                   sex:'',
                   source:'',
                   code:'',
                },
                activeMemberList:{
                    legendData: ['男', '女'],
                    data: [{value: 335, name: '男'},{value: 310, name: '女'}]
                },
                activeName:'first',
                listLoading2:false,
                list2:[],
                total2:0,
                listQuery2:{
                   page:1, 
                   size:20,
                },
                placeOrigin:[],
                siteOptions: [],
            }
        },
        mounted () {
            this.handleClick()
            this.getList2()
            this.getList1()
            setInterval(function() {
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function() {
                        if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 1000);
        },
        methods: {
            // 获取饼图数据
            getPieData(type){
                memberPieList({type:type}).then(res=>{
                    if(res.code == 0){
                        let json= {
                            legendData: [],
                            data: []
                        }
                        if(this.activeName == 'second'){
                            res.data.map((item2)=>{
                            json.legendData.push(item2.type)
                            json.data.push(item2.num)
                            })
                            //柱状图
                            this.barEcharts(json)
                        }else{
                            res.data.map((item2)=>{
                            json.legendData.push(item2.type)
                            json.data.push({value: item2.num, name: item2.type})
                            
                            })
                            //饼图
                            this.init(json)
                        }
                    }
                })
            },
            //初始化数据
            init(activeMemberList){
                let dom = this.$refs.echarts
                let myChart = this.$echarts.init(dom);
                let option = {
                    title: {
                        text: '',
                        subtext: '',
                        left: 'center'
                    },
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: activeMemberList.legendData
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '70%',
                            center: ['45%', '55%'],
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
                                    formatter: '{a} {b} : {c}个',   //设置标签显示内容 ，默认显示{b}
                                }
                            }

                        }
                    ]
                };
                // myChart.setOption(option,window.onresize = myChart.resize)
                myChart.setOption(option)
            },
            barEcharts(data){
                let dom = this.$refs.echarts2
                let myChart = this.$echarts.init(dom);
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top:'10',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: data.legendData,
                        axisLabel: {
                            interval:0,
                            rotate:40 
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: data.data,
                        type: 'bar',
                        barMaxWidth: 15, // 最大宽度
                    }]
                };
                // myChart.setOption(option,window.onresize = myChart.resize)
                myChart.setOption(option)
            },
            //选择区域
            getAreaForLazyLoad(node, resolve) {
                // console.log(node)
                const  level  = node.level
                if(level >= 3){
                    resolve()
                    return
                }
                let params = {
                code: node.value
                }
                let childProjects = []
                allAddressList(params).then(res => {
                    if (res.code == 0) {
                    childProjects = res.data.data
                    childProjects.map(item => {
                        item.leaf = level >= 2; //判断是否为末尾节点
                    })
                    resolve(childProjects)
                    }
                }).catch(err => { console.log(err) })
            },
            handleFilter(){
                this.listQuery1.page = 1
                this.getList1()
            },
            //
            getList1(){
                if(this.placeOrigin.length>0){
                   this.listQuery1.code = this.placeOrigin[this.placeOrigin.length-1]
                }else{
                    this.listQuery1.code = ''
                }
                memberList(this.listQuery1).then(res=>{
                    this.list1 = res.data.data.data
                    this.total1 = res.data.data.total
                })
            },
            getList2(){
                memberOrderNum(this.listQuery2).then(res=>{
                    this.list2 = res.data.data
                    this.total2 = res.data.total
                })
            },
            handleClick(){
                this.listQuery1.page = 1
                let type=''
                if(this.activeName == 'first'){
                    this.listQuery1.keyword = ''
                    type =  'sex'
                }else if(this.activeName == 'second'){
                    type =  'area'
                }else if(this.activeName == 'third'){
                    type =  'source'
                }else if(this.activeName == 'fourth'){
                    type =  'exchange'
                }
                this.getPieData(type)
                // this.getList1(type)
            },
            paginHandle1(val){
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery1.page = parseInt(json.page)
                    this.listQuery1.size = parseInt(json.limit)
                }
                this.getList1()
            },
            paginHandle2(val){
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery2.page = parseInt(json.page)
                    this.listQuery2.size = parseInt(json.limit)
                }
                this.getList2()
            },
            //点击订单数
            orderDetail(row){
                let hotel_id = ''
                this.$refs.orderDetailChild.init(row,hotel_id)
            },
        },
    }
</script>

<style lang="scss" scoped>
.member-active-page{
    display: flex;
    justify-content: space-between;
    .left-box{
        width: 60%;
    }
    .right-box{
        flex: 1;
        margin-left: 20px;
        .right-top-box{
            // padding: 15px;
            .big-title{
                font-size: 24px;
            }
        }
    }
    .top-box{
        // display: flex;
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
    .my-echarts{
        height: 150px;
        width: 500px;
        margin: 10px 0 20px;
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
    .ranking0{
        color:#ff273c;
    }
    .ranking1{
        color:#f97458;
    }
    .ranking2{
        color:#ffb534;
    }
    .scroll-box{
        height:300px;
        overflow-y: scroll;
    }
    .my-echarts2{
        height: 550px;
        width:100%;
        margin-top: 10px;
        position: relative;
    }
}
</style>
<template>
    <div class="member-active-page">
        <el-tabs type="card" v-model="activeType" @tab-click="handleClickPie">
            <el-tab-pane label="个数" name="first"></el-tab-pane>
            <el-tab-pane label="金额" name="second"></el-tab-pane>
        </el-tabs>
        <div class="top-box">
            <div style="display:flex;justify-content: space-between;">
                <div class="echarts-wrap">
                    <div class="big-title">交易订单</div>
                    <div ref="echarts1" class="my-echarts"></div>
                </div>
                <div class="echarts-wrap">
                    <div class="big-title">订单来源</div>
                    <div ref="echarts2" class="my-echarts"></div>
                </div>
                <div class="echarts-wrap">
                    <div class="big-title">分时过期订单</div>
                    <div ref="echarts3" class="my-echarts"></div>
                </div>
            </div>
        </div>
        <div class="list-wrap">
           <div class="list-box" v-for="(item,index) in list" :key="index">
               <div class="big-title flex-top">
                    <div>{{item.title}}</div>
                    <!-- <div class="more-btn">更多
                        <i class="el-icon-arrow-right"></i>
                    </div> -->
                   </div>
                <el-tabs  v-model="item.activeName" @tab-click="handleClick(item,index)">
                    <el-tab-pane label="全部" name="first"></el-tab-pane>
                    <el-tab-pane label="公众号" name="second"></el-tab-pane>
                    <el-tab-pane label="IOS" name="third"></el-tab-pane>
                    <el-tab-pane label="APK" name="fourth"></el-tab-pane>
                </el-tabs>
                <div class="number-box">
                    <div class="item-box">
                        <div>成交订单</div>
                        <div>{{item.payed.item}}个</div>
                    </div>
                    <div class="item-box">
                        <div>交易完成</div>
                        <div>{{item.complete.item}}个</div>
                    </div>
                </div>
                <div class="price-box">
                    <div>
                        <span>成交金额：</span>
                        <span>￥{{item.payed.money}}</span>
                    </div>
                    <div>
                        <span>交易金额：</span>
                        <span>￥{{item.complete.money}}</span>
                    </div>
                </div>
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
import { getDivtimeList,getOrderList } from '@/api/order-data/list.js'
    export default {
        components: { Pagination },
        data() {
            return {
                topPieList:[
                    {
                        legendData: ['成交订单', '交易完成'],
                        data: []
                    },
                    {
                        legendData: ['公众号', 'IOS', 'APK'],
                        data: []
                    },
                    // {
                    //     legendData: ['今日订单', '昨日订单', '7日订单','月度订单','季度订单','年度订单'],
                    //     data: [{value: 335, name: '今日订单'},{value: 310, name: '昨日订单'},{value: 234, name: '7日订单'},
                    //     {value: 335, name: '月度订单'},{value: 310, name: '季度订单'},{value: 234, name: '年度订单'}]
                    // },
                ],
                list:[
                    {
                        id:1,
                        title:'今日订单',
                        tabs:['全部','公众号','IOS','APK'],
                        activeName:'first',
                        payed:{item: 0, money: 0},
                        complete:{item: 0, money: 0}
                    },
                    {
                        id:2,
                        title:'昨日订单',
                        tabs:['全部','公众号','IOS','APK'],
                        activeName:'first',
                        payed:{item: 0, money: 0},
                        complete:{item: 0, money: 0}
                    },
                    {
                        id:3,
                        title:'7日订单',
                        tabs:['全部','公众号','IOS','APK'],
                        activeName:'first',
                        payed:{item: 0, money: 0},
                        complete:{item: 0, money: 0}
                    },
                    {
                        id:4,
                        title:'月度订单',
                        tabs:['全部','公众号','IOS','APK'],
                        activeName:'first',
                        payed:{item: 0, money: 0},
                        complete:{item: 0, money: 0}
                    },
                    {
                        id:5,
                        title:'季度订单',
                        tabs:['全部','公众号','IOS','APK'],
                        activeName:'first',
                        payed:{item: 0, money: 0},
                        complete:{item: 0, money: 0}
                    },
                    {
                        id:6,
                        title:'年度订单',
                        tabs:['全部','公众号','IOS','APK'],
                        activeName:'first',
                        payed:{item: 0, money: 0},
                        complete:{item: 0, money: 0}
                    },
                ],
                allList:'',
                activeType:'first',
            }
        },
        mounted () {
            this.$nextTick(()=>{
                this.getDivtimeData('item')
                this.getOrderData('item')
            })
        },
        methods: {
            //切换饼图
            handleClickPie(){
                let params = ''
                if(this.activeType == 'first'){
                    params = 'item'
                }else if(this.activeType == 'second'){
                    params = 'money'
                }
                this.getDivtimeData(params)
                this.getOrderData(params)
            },
            //获取页面订单数据
            getOrderData(params){
                getOrderList().then(res=>{
                    let list = res.data
                    this.allList = res.data
                    // console.log(list)
                    let value1 =  (list.all.wechat.payed[params]*100 +  list.all.wechat.complete[params]*100)/100
                    let value2 =  (list.all.ios.payed[params]*100 +  list.all.ios.complete[params]*100)/100
                    let value3 =  (list.all.apk.payed[params]*100 +  list.all.apk.complete[params]*100)/100
                    this.topPieList[0].data=[{value: list.all.all.payed[params], name: '成交订单'},{value: list.all.all.complete[params], name: '交易完成'}]
                    this.topPieList[1].data=[{value: value1, name: '公众号'},{value:value2, name: 'IOS'},{value: value3, name: 'APK'}]
                    this.topPieList.map((item,index)=>{
                        this.init(item,index)
                    })
                    this.list[0].payed = list.today.all.payed
                    this.list[0].complete = list.today.all.complete
                    this.list[1].payed = list.yesterday.all.payed
                    this.list[1].complete = list.yesterday.all.complete
                    this.list[2].payed = list.week.all.payed
                    this.list[2].complete = list.week.all.complete
                    this.list[3].payed = list.months.all.payed
                    this.list[3].complete = list.months.all.complete
                    this.list[4].payed = list.season.all.payed
                    this.list[4].complete = list.season.all.complete
                    this.list[5].payed = list.year.all.payed
                    this.list[5].complete = list.year.all.complete
                })
            },
            //获取分时过期订单
            getDivtimeData(params){
                getDivtimeList().then(res=>{
                    let list = res.data
                    let item={
                        legendData: ['今日订单', '昨日订单', '7日订单','月度订单','季度订单','年度订单'],
                        data: [{value: list.today[params], name: '今日订单'},{value: list.yesterday[params], name: '昨日订单'},{value: list.week[params], name: '7日订单'},
                        {value: list.months[params], name: '月度订单'},{value: list.season[params], name: '季度订单'},{value: list.year[params], name: '年度订单'}]
                    }
                    this.init(item,2)
                })
            },
            //初始化数据
            init(item,i){
                let unit = ''
                if(this.activeType == 'first'){
                    unit = '个'
                }else if(this.activeType == 'second'){
                    unit = '元'
                }
                let aa = 'echarts'+(i+1)
                let dom = this.$refs[aa]
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
                        data: item.legendData
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '70%',
                            center: ['35%', '55%'],
                            data:item.data,
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
                                    formatter: '{a} {b} : {c}'+unit,   //设置标签显示内容 ，默认显示{b}
                                }
                            }

                        }
                    ]
                };
                // myChart.setOption(option,window.onresize = myChart.resize)
                myChart.setOption(option)
            },
            handleClick(item,i){
                let json
                if(item.activeName == 'first'){
                    json = 'all'
                }else if(item.activeName == 'second'){
                    json = 'wechat'
                }else if(item.activeName == 'third'){
                    json = 'ios'
                }else if(item.activeName == 'fourth'){
                    json = 'apk'
                }
                let field 
                if(i == 0){
                    field = 'today'
                }else if(i == 1){
                    field = 'yesterday'
                }else if(i == 2){
                    field = 'week'
                }else if(i == 3){
                    field = 'months'
                }else if(i == 4){
                    field = 'season'
                }else if(i == 5){
                    field = 'year'
                }
                let aa = this.allList[field]
                this.list[i].payed = aa[json].payed
                this.list[i].complete = aa[json].complete
            },
        },
    }
</script>

<style lang="scss" scoped>
.member-active-page{
    .top-box{
        // display: flex;
        // width: 80%;
        box-shadow: 0px 0px 5px 5px rgba(0,21,41,0.08);
        padding: 15px;
    }
    .big-title{
        font-size: 24px;
        margin-bottom: 10px;
    }
    .list-wrap{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .list-box{
            width: 49%;
            box-shadow: 0px 0px 5px 5px rgba(0,21,41,0.08);
            padding: 15px;
            margin-top: 20px;
            font-size: 14px;
            .flex-top{
                display: flex;
                justify-content: space-between;
                .more-btn{
                    cursor: pointer;
                    font-size: 14px;
                    color: #1890ff;
                    i{
                        margin-left: -5px;
                        // color: #1890ff;
                    }
                }
            }
            .number-box{
                display: flex;
                // justify-content: space-between;
                .item-box{
                    border-right: 1px solid #dedede;
                    margin-right: 10px;
                    padding-right: 10px;
                }
                .item-box:last-child{
                    border-right: none;
                }
            }
            .price-box{
                margin-top: 10px;
                font-size: 14px;
            }
        }
    }
    .echarts-wrap{
        width: 31%;
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
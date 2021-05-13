<template>
    <div class="member-active-page">
        <div class="top-box">
            <div class="big-title">48小时会员活跃数</div>
            <div ref="echarts" class="my-echarts"></div>
        </div>
        <div class="table-wrap">
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="first"></el-tab-pane>
                <el-tab-pane label="公众号" name="second"></el-tab-pane>
                <el-tab-pane label="安卓" name="third"></el-tab-pane>
                <el-tab-pane label="苹果" name="fourth"></el-tab-pane>
            </el-tabs>
            <div class="table-box">
                <el-table v-loading="listLoading1" :data="list1" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="会员ID" align="center" width="100">
                        <template slot-scope="{row}">
                        <span>{{ row.memberId }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="会员" align="left" :show-overflow-tooltip="true">
                        <template slot-scope="{row}">
                            <div style="display:flex"> 
                                <img v-if="row.head_pic == '' || row.head_pic == null" src="../../assets/images/default_author_head.png" class="heder-img">
                                <img v-else :src="row.head_pic" class="heder-img">
                                <span class="member-name">{{row.nickname}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="类型" align="center">
                        <template slot-scope="{row}">
                        <span>{{ row.username }}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="注册时间" align="center" width="200">
                        <template slot-scope="{row}">
                            <span v-if="row.create_time == '' || row.create_time == null">-</span>
                            <span v-else>{{ row.create_time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最后活跃时间" align="center" width="200">
                        <template slot-scope="{row}">
                        <span>{{ row.time }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="来源" align="center" width="200">
                        <template slot-scope="{row}">
                            <span v-if="row.source_name == '' || row.source_name == null">-</span>
                            <span v-else>{{ row.source_name }}</span>
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
import { getActivePie,getActiveMemberList } from "@/api/member-active/list";

    export default {
        components: { Pagination },
        data() {
            return {
                listLoading1:false,
                list1:[],
                total1:0,
                listQuery:{
                   page:1, 
                   size:10,
                },
                activeMemberList:{
                    legendData: ['公众号', 'IOS', 'APK'],
                    data: [{value: 335, name: '公众号'},{value: 310, name: 'IOS'},{value: 234, name: 'APK'}]
                },
                activeName:'first'
            }
        },
        mounted () {
            this.geiPieData()
            this.getList()
        },
        methods: {
            // 获取饼图数据
            geiPieData(){
                getActivePie().then(res=>{
                    if(res.code == 0){
                        let json= {
                            legendData: [],
                            data: []
                        }
                        res.data.map((item2)=>{
                            json.legendData.push(item2.type)
                            json.data.push({value: item2.num, name: item2.type})
                        })
                        //饼图
                        this.init(json)
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
                        show: false,
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
                                    formatter: '{a} {b} : {c}个 \n ({d}%)',   //设置标签显示内容 ，默认显示{b}
                                }
                            }

                        }
                    ]
                };
                // myChart.setOption(option,window.onresize = myChart.resize)
                myChart.setOption(option)
            },
            getList(){
                let type = ''
                if(this.activeName == 'first'){
                    type = ''
                }else if(this.activeName == 'second'){
                    type = 'wechat'
                }else if(this.activeName == 'third'){
                    type = 'android'
                }else if(this.activeName == 'fourth'){
                    type = 'ios'
                }
                let params={
                    page:this.listQuery.page, 
                    size:this.listQuery.size,
                    type:type
                }
                getActiveMemberList(params).then(res=>{
                    this.list1 = res.data.data
                    this.total1 = res.data.total
                })
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
}
</style>
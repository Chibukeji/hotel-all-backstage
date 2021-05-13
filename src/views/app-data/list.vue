<template>
    <div class="member-active-page">
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="下载量" name="first"></el-tab-pane>
            <el-tab-pane label="注册量" name="second"></el-tab-pane>
            <el-tab-pane label="订单量" name="third"></el-tab-pane>
        </el-tabs>
        <div class="top-box">
            <div class="big-title">APP</div>
            <div ref="echarts" class="my-echarts"></div>
        </div>
        <div class="table-wrap">
            <div class="table-box">
                <el-table v-loading="listLoading1" :data="list1" border fit highlight-current-row style="width: 100%;">
                    <el-table-column label="ID" align="center" width="80">
                        <template slot-scope="{row}">
                        <span>{{ row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="下载渠道" align="center">
                        <template slot-scope="{row}">
                        <span>{{ row.channel_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="APP类型" align="center">
                        <template slot-scope="{row}">
                        <span>{{ row.type_name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="下载时间" align="center">
                        <template slot-scope="{row}">
                        <span>{{ row.create_time }}</span>
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
import { appPieList,appDownList } from "@/api/app-data/list";
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
                },
                activeMemberList:{
                    legendData: ['省', '市', '区'],
                    data: [{value: 335, name: '省'},{value: 310, name: '市'},{value: 234, name: '区'}]
                },
                activeName:'first'
            }
        },
        mounted () {
            this.handleClick()
            this.getList()
        },
        methods: {
            // 获取饼图数据
            getPieData(type){
                appPieList({type:type}).then(res=>{
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
                            radius: '80%',
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
                let params={
                    page:this.listQuery.page, 
                    size:this.listQuery.size,
                    // type:type
                }
                appDownList(params).then(res=>{
                    this.list1 = res.data.data.data
                    this.total1 = res.data.data.total
                })
            },
            handleClick(){
                this.listQuery.page = 1
                let type = ''
                if(this.activeName == 'first'){
                    type = 0
                }else if(this.activeName == 'second'){
                    type = 1
                }else if(this.activeName == 'third'){
                    type = 2
                }
                this.getPieData(type)
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
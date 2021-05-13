<template>
    <div>
        <div class="filter-container">
            <span class="filter-item">
                <el-cascader v-model="placeOrigin" :options="siteOptions" :props="belongRegoinProps"  clearable placeholder="选择区域" style="width:300px"></el-cascader>
            </span>
            <span class="filter-item">
                <span class="select-title">时间：</span>
                <el-date-picker v-model="dateRange" type="monthrange" range-separator="至" start-placeholder="开始日期" 
                end-placeholder="结束日期" style="width: 280px"  value-format="yyyy-MM" :picker-options="pickerOptionsStart">
                </el-date-picker>
            </span>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
        <div class="member-active-page">
            <div class="wrap-box">
                <div class="top-box">
                    <div class="big-title">酒店区域</div>
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
                        <el-table-column label="酒店" align="left" :show-overflow-tooltip="true">
                            <template slot-scope="{row}">
                            <span>{{ row.title }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="地址"  align="left" :show-overflow-tooltip="true">
                            <template slot-scope="{row}">
                            <span>{{ row.province_name+row.city_name+row.area_name}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :pager-count="5" :total="total1" :page.sync="listQuery1.page" :limit.sync="listQuery1.size" 
                    @pagination="paginHandle1" layout="total, prev, pager, next" :pageSizes="[15, 20, 30, 50]" />
                </div>
                </div>
            </div>
            <div class="wrap-box">
                <div class="big-title">酒店排名</div>
                <div class="table-wrap">
                <el-tabs type="card" v-model="activeName1" @tab-click="handleClick1">
                    <el-tab-pane label="PV排名" name="first"></el-tab-pane>
                    <el-tab-pane label="UV排名" name="second"></el-tab-pane>
                    <el-tab-pane label="订单排名" name="third"></el-tab-pane>
                </el-tabs>
                <div class="table-box">
                    <el-table v-loading="listLoading2" :data="list2" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="排名" align="center" width="60">
                            <template slot-scope="{$index}">
                            <span :class="`ranking${$index}`">{{ $index+1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="酒店ID" align="center" width="70">
                            <template slot-scope="{row}">
                            <span>{{ row.hotel_id}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="酒店名称" align="left" :show-overflow-tooltip="true">
                            <template slot-scope="{row}">
                            <span class="link-type" @click="hotelDetail(row)">{{ row.title }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="activeName1 == 'first'" label="点击量" align="center" width="70">
                            <template slot-scope="{row}">
                            <span>{{ row.pvs}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="activeName1 == 'second'" label="浏览量" align="center" width="70">
                            <template slot-scope="{row}">
                            <span>{{ row.uvs }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="activeName1 == 'third'" label="订单数" align="center" width="70">
                            <template slot-scope="{row}">
                            <span>{{ row.num }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :pager-count="5" :total="total2" :page.sync="listQuery2.page" :limit.sync="listQuery2.size" @pagination="paginHandle2" layout="total, prev, pager, next"/>
                </div>
                </div>
            </div>
            <div class="wrap-box">
                <div class="big-title">房型排名</div>
                <div class="table-wrap">
                <el-tabs type="card" v-model="activeName2" @tab-click="handleClick2">
                    <el-tab-pane label="PV排名" name="first"></el-tab-pane>
                    <el-tab-pane label="UV排名" name="second"></el-tab-pane>
                    <el-tab-pane label="订单排名" name="third"></el-tab-pane>
                </el-tabs>
                <div class="table-box">
                    <el-table v-loading="listLoading3" :data="list3" border fit highlight-current-row style="width: 100%;">
                        <el-table-column label="排名" align="center" width="60">
                            <template slot-scope="{$index}">
                            <span :class="`ranking${$index}`">{{ $index+1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="酒店名称" align="left" :show-overflow-tooltip="true">
                            <template slot-scope="{row}">
                            <span>{{ row.title }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="房型名称" align="left" :show-overflow-tooltip="true">
                            <template slot-scope="{row}">
                            <span>{{ row.room_name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="activeName2 == 'first' " label="点击量" align="center" width="70">
                            <template slot-scope="{row}">
                            <span>{{ row.pvs}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="activeName2 == 'second'" label="浏览量" align="center" width="70">
                            <template slot-scope="{row}">
                            <span>{{ row.uvs }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="activeName2 == 'third'" label="订单数" align="center" width="70">
                            <template slot-scope="{row}">
                            <span>{{ row.num }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :pager-count="5" :total="total3" :page.sync="listQuery3.page" :limit.sync="listQuery3.size" @pagination="paginHandle3" layout="total, prev, pager, next"/>
                </div>
                </div>
            </div>
        </div>
        <!-- 酒店详情 -->
        <hotel-detail ref="hotelDetailChild" />
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
import { allAddressList } from '@/api/common'
import { getHotelPie,getHotelList,getHotelByVolume,getHotelByOrder,getRoomByVolume,getRoomByOrder } from '@/api/hotel-data/list'
import HotelDetail from './components/hotel-detail'
import Pagination from '@/components/Pagination'
    export default {
        components: { Pagination,HotelDetail },
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
                   size:15,
                },
                activeMemberList:{
                    legendData: ['省', '市', '区'],
                    data: [{value: 335, name: '省'},{value: 310, name: '市'},{value: 234, name: '区'}]
                },
                activeName1:'first',
                listLoading2:false,
                list2:[],
                total2:0,
                listQuery2:{
                    page:1, 
                    size:20,
                    start_time:'',
                    end_time:''
                },
                activeName2:'first',
                listLoading3:false,
                list3:[],
                total3:0,
                listQuery3:{
                   page:1, 
                   size:20,
                },
                placeOrigin:[],
                siteOptions: [],
                dateRange:[],
                pickerOptionsStart: {
                    disabledDate: time => {
                        var times = Date.now()
                        return time.getTime() > times;
                    }
                },
            }
        },
        mounted () {
            setInterval(function() {
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function() {
                        if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 1000);
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
            this.getPieData()
            this.getList1()
            this.getList2()
        },
        methods: {
            // 获取饼图数据
            getPieData(){
                let code = ''
                if(this.placeOrigin.length>0){
                   code = this.placeOrigin[this.placeOrigin.length-1]
                }
                let start_time=''
                let end_time=''
                if (this.dateRange == null || this.dateRange.length == 0) {
                    start_time = ''
                    end_time = ''
                } else {
                    start_time = this.dateRange[0] 
                    end_time = this.dateRange[1]
                }
                let params ={
                    code:code,
                    // start_time:start_time,
                    // end_time:end_time
                }
                getHotelPie(params).then(res=>{
                    if(res.code == 0){
                        let json= {
                            legendData: [],
                            data: []
                        }
                        let value = 0
                        if(this.placeOrigin.length>0){
                            res.data.map((item2)=>{
                                json.legendData.push(item2.type)
                                json.data.push({value: item2.num, name: item2.type})
                            })
                        }else{
                            res.data.map((item2)=>{
                                value = value+item2.num
                            })
                            json.legendData.push('全部')
                            json.data.push({value: value, name: '全部'}) 
                        }
                        //饼图
                        this.init(json)
                    }
                })
                //获取表格数据
                this.getHotel()
            },
            //获取表格数据
            getHotel(){
                let code = ''
                if(this.placeOrigin.length>0){
                   code = this.placeOrigin[this.placeOrigin.length-1]
                }
                let start_time=''
                let end_time=''
                if (this.dateRange == null || this.dateRange.length == 0) {
                    start_time = ''
                    end_time = ''
                } else {
                    start_time = this.dateRange[0] 
                    end_time = this.dateRange[1]
                }
                let params={
                    code:code,
                    // start_time:start_time,
                    // end_time:end_time,
                    page:this.listQuery1.page, 
                    size:this.listQuery1.size,
                }
                getHotelList(params).then(res=>{
                    this.list1 = res.data.data.data
                    this.total1 = res.data.data.total
                })
            },
            //选择区域
            getAreaForLazyLoad(node, resolve) {
                // console.log(node)
                const  level  = node.level
                if(level >= 2){
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
                        item.leaf = level >= 1; //判断是否为末尾节点
                    })
                    resolve(childProjects)
                    }
                }).catch(err => { console.log(err) })
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
                        show:false,
                        orient: 'vertical',
                        left: 'right',
                        data: activeMemberList.legendData
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '60%',
                            center: ['40%', '55%'],
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
            getList1(){
                let code = ''
                if(this.placeOrigin.length>0){
                   code = this.placeOrigin[this.placeOrigin.length-1]
                }
                if (this.dateRange == null || this.dateRange.length == 0) {
                    this.listQuery2.start_time = ''
                    this.listQuery2.end_time = ''
                } else {
                    this.listQuery2.start_time = this.dateRange[0] 
                    this.listQuery2.end_time = this.dateRange[1]
                }
                let type = ''
                if(this.activeName1 == 'first'){
                    type = 'pvs'
                    this.getHotelByVolumeList(type,code)
                }else if(this.activeName1 == 'second'){
                    type = 'uvs'
                    this.getHotelByVolumeList(type,code)
                }else if(this.activeName1 == 'third'){
                    let params={
                        page:this.listQuery2.page, 
                        size:this.listQuery2.size,
                        start_time:this.listQuery2.start_time,
                        end_time:this.listQuery2.end_time,
                        code:code
                    }
                    getHotelByOrder(params).then(res=>{
                        this.list2 = res.data.data
                        this.total2 = res.data.total
                    })
                }
            },
            //获取酒店pv,uv排名
            getHotelByVolumeList(type,code){
                let params={
                    page:this.listQuery2.page, 
                    size:this.listQuery2.size,
                    start_time:this.listQuery2.start_time,
                    end_time:this.listQuery2.end_time,
                    type:type,
                    code:code
                }
                getHotelByVolume(params).then(res=>{
                    this.list2 = res.data.data
                    this.total2 = res.data.total
                })
            },
            getList2(){
                let code = ''
                if(this.placeOrigin.length>0){
                   code = this.placeOrigin[this.placeOrigin.length-1]
                }
                if (this.dateRange == null || this.dateRange.length == 0) {
                    this.listQuery3.start_time = ''
                    this.listQuery3.end_time = ''
                } else {
                    this.listQuery3.start_time = this.dateRange[0] 
                    this.listQuery3.end_time = this.dateRange[1]
                }
                let type = ''
                if(this.activeName2 == 'first'){
                    type = 'pvs'
                    this.getRoomByVolumeList(type,code)
                }else if(this.activeName2 == 'second'){
                    type = 'uvs'
                    this.getRoomByVolumeList(type,code)
                }else if(this.activeName2 == 'third'){
                    let params={
                        page:this.listQuery3.page, 
                        size:this.listQuery3.size,
                        start_time:this.listQuery3.start_time,
                        end_time:this.listQuery3.end_time,
                        code:code
                    }
                    getRoomByOrder(params).then(res=>{
                        this.list3 = res.data.data
                        this.total3 = res.data.total
                    })
                }
            },
             //获取房型pv,uv排名
            getRoomByVolumeList(type,code){
                let params={
                    page:this.listQuery3.page, 
                    size:this.listQuery3.size,
                    start_time:this.listQuery3.start_time,
                    end_time:this.listQuery3.end_time,
                    type:type,
                    code:code
                }
                getRoomByVolume(params).then(res=>{
                    this.list3 = res.data.data
                    this.total3 = res.data.total
                })
            },
            handleClick1(){
                this.listQuery2.page = 1
                this.getList1()
            },
            handleClick2(){
                this.listQuery3.page = 1
                this.getList2()
            },
            handleFilter(){
                this.getPieData()
                this.getList1()
                this.getList2()
            },
            paginHandle1(val){
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery1.page = parseInt(json.page)
                    this.listQuery1.size = parseInt(json.limit)
                }
                this.getHotel()
            },
            paginHandle2(val){
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery2.page = parseInt(json.page)
                    this.listQuery2.size = parseInt(json.limit)
                }
                this.getList1()
            },
            paginHandle3(val){
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery3.page = parseInt(json.page)
                    this.listQuery3.size = parseInt(json.limit)
                }
                this.getList2()
            },
            //查看酒店详情
            hotelDetail(row){
                this.$refs.hotelDetailChild.init(row,this.dateRange)
            },
        },
    }
</script>

<style lang="scss" scoped>
.member-active-page{
    display: flex;
    justify-content: space-between;
    .wrap-box{
        // flex: 1;
        width: 33%;
        margin-right: 20px;
    }
    .top-box{
        // display: flex;
        // width: 80%;
        // box-shadow: 0px 0px 5px 5px rgba(0,21,41,0.08);
        border: 1px solid #dedede;
        padding: 15px;
    }
    .big-title{
        font-size: 24px;
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
        height: 200px;
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
}
</style>
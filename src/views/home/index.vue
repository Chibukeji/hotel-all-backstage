<template>
  <div class="home-page">
    <div class="right-box">
      <div class="title">
        平台登录
      </div>
      <div class="right-wrap-box">
        <div class="item link-type" v-for="(item,index) in menuList" :key="index"  @click="openUrl(item)">{{item.title}}</div>
      </div>
    </div>
    <div class="left-box">
      <div class="title">
        数据展示
      </div>
      <div class="pie-echarts-wrap">
        <div class="pie-echarts-box">
          <div class="title-box">
           <span>48小时会员活跃数</span>
           <router-link to="/member-active/member-active-list">
            <div class="more-btn">更多
              <i class="el-icon-arrow-right"></i>
            </div>
           </router-link>
          </div>
          <div>
            <div ref="echarts1" class="my-echarts"></div>
          </div>
        </div>
        <div class="pie-echarts-box">
          <div class="title-box">
            <div class="top-box">
              <span>APP</span>
              <el-tabs v-model="activeNameApp" @tab-click="handleClickApp" class="my-tabs">
                  <el-tab-pane label="下载量" name="first"></el-tab-pane>
                  <el-tab-pane label="注册量" name="second"></el-tab-pane>
                  <el-tab-pane label="订单量" name="third"></el-tab-pane>
                </el-tabs> 
            </div>
            <router-link to="/app-data/list">
              <div class="more-btn">更多
                <i class="el-icon-arrow-right"></i>
              </div>
            </router-link>
          </div>
          <div>
             <div ref="echarts4" class="my-echarts"></div>
          </div>
        </div>
         <div class="pie-echarts-box">
          <div class="title-box">
           <span>订单</span>
           <router-link to="/order-data/list">
            <div class="more-btn">更多
              <i class="el-icon-arrow-right"></i>
            </div>
           </router-link>
          </div>
          <div>
             <div ref="echarts5" class="my-echarts"></div>
          </div>
        </div>
        <div class="pie-echarts-box">
          <div class="title-box">
           <span>财务</span> 
           <router-link to="/finance-data/list">
            <div class="more-btn">更多
              <i class="el-icon-arrow-right"></i>
            </div>
           </router-link>
          </div>
          <div>
             <div ref="echarts6" class="my-echarts"></div>
          </div>
        </div>
        <div class="pie-echarts-box" style="width:100%">
          <div class="title-box">
            <div class="top-box">
              <span>会员</span>
              <el-tabs v-model="activeNameMember" @tab-click="handleClickMember" class="my-tabs">
                <el-tab-pane label="性别" name="first"></el-tab-pane>
                <el-tab-pane label="区域" name="second"></el-tab-pane>
                <el-tab-pane label="来源" name="third"></el-tab-pane>
                <el-tab-pane label="交易数" name="fourth"></el-tab-pane>
              </el-tabs>
            </div>
            <router-link to="/member-data/list">
              <div class="more-btn">更多
                <i class="el-icon-arrow-right"></i>
              </div>
             </router-link>
          </div>
          <div v-show="activeNameMember != 'second'">
             <div  ref="echarts2" class="my-echarts" style="height:350px"></div>
          </div>
          <div class="scroll-box" v-show="activeNameMember == 'second'">
             <div  ref="echarts22" class="my-echarts2"></div>
          </div>
        </div>
        <div class="pie-echarts-box" style="width:100%;">
          <div class="title-box">
            <div class="top-box">
              <span>酒店</span> 
              <span class="small-title">区域</span>
            </div>
            <router-link to="/hotel-data/list">
              <div class="more-btn">更多
                <i class="el-icon-arrow-right"></i>
              </div>
            </router-link>
          </div>
           <div class="scroll-box" style="height:350px">
             <div  ref="echarts3" class="my-echarts2"></div>
          </div>
        </div>
        
       
      </div>
      <!-- <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="管理员" align="center" width="130">
          <template slot-scope="{row}">
            <span>{{ row.admin_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作日期" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作ip" align="center" width="130">
          <template slot-scope="{row}">
            <span>{{ row.ip }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="{row}">
            <span class="desc-box-div" @click="detailHandle(row)">{{ row.text }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" /> -->
    </div>
    <!-- 日志详情弹窗 -->
    <el-dialog  :visible.sync="logDialogVisible" title="操作详情"  width="30%">
      <div>{{itemDetail.text}}</div>
    </el-dialog>
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
import { logList,allList } from "@/api/home";
import { memberPieList } from "@/api/member-data/list";
import { appPieList } from "@/api/app-data/list";
import { getloginSystem} from '@/api/user'
import { getToken } from '@/utils/auth'
import { getDivtimeList,getOrderList } from '@/api/order-data/list.js'
export default {
  components: { Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        size: 10,
      },
      total: 0,
      listLoading: false,
      list: [],
      menuList:[],
      logDialogVisible:false,
      itemDetail:'',
      activeNameMember:'first',
      activeNameApp:'first',
      allList:[]
    }
  },
  mounted () {
    // this.getLogList();
    this.getPlatformsList();
    this.$nextTick(()=>{
      this.getAllList()
    })
  },
  methods: {
    getAllList(){
      allList().then(res=>{
        console.log(res.data)
        let list = res.data
        let arrDom = document.getElementsByClassName("pie-echarts-box")
        let vm = this
        let arr = []
        for(var key in list){
          arr.push(list[key])
        }
        this.dealArray(arr)
        for(let i=0;i<arrDom.length;i++){
          let aa = 'echarts'+(i+1)
          let dom = vm.$refs[aa]
          if(i == 2){
            //柱状图
            this.barEcharts(dom,this.allList[i])
          }else{
            //饼图
            this.init(dom,this.allList[i])
          }
        }
        
      })
    },
    //处理获取的数据
    dealArray(arr){
      arr.map((item,n)=>{
        let json= {
          legendData: [],
          data: []
        }
        item.map((item2)=>{
          json.legendData.push(item2.type)
          if(n == 2){
            json.data.push(item2.num)
          }else{
            json.data.push({value: item2.num, name: item2.type})
          }
          
        })
        this.allList.push(json)
      })
      // console.log(this.allList)
    },
    //初始化数据
    init(dom,activeMemberList){
      let myChart = this.$echarts.init(dom);
      let option = {
        title: {
            text: '',
            subtext: '',
            left: 'center'
        },
        tooltip: {
            show: false,
            // trigger: 'item',
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
                radius: '65%',
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
                        formatter: '{a} {b} : {c}个  ({d}%)',   //设置标签显示内容 ，默认显示{b}
                    }
                }
            }
        ]
      };
      // myChart.setOption(option,window.onresize = myChart.resize)
      myChart.setOption(option)

    },
    barEcharts(dom,data){
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
              // rotate:40 
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
    //点击会员tabs切换
    handleClickMember(){
      let dom1 = this.$refs.echarts2
      let dom2 = this.$refs.echarts22
      let type = ''
      if(this.activeNameMember == 'first'){
        type = 'sex'
      }else if(this.activeNameMember == 'second'){
        type = 'area'
      }else if(this.activeNameMember == 'third'){
        type = 'source'
      }else if(this.activeNameMember == 'fourth'){
        type = 'exchange'
      }
      memberPieList({type:type}).then(res=>{
        if(res.code == 0){
          let json= {
            legendData: [],
            data: []
          }
          if(this.activeNameMember == 'second'){
            res.data.map((item2)=>{
              json.legendData.push(item2.type)
              json.data.push(item2.num)
            })
            //柱状图
            this.barEcharts(dom2,json)
          }else{
            res.data.map((item2)=>{
              json.legendData.push(item2.type)
              json.data.push({value: item2.num, name: item2.type})
              
            })
            //饼图
            this.init(dom1,json)
          }
        }
      })
    },
    // 点击APP tabs切换
    handleClickApp(){
      let dom = this.$refs.echarts4
      let type = ''
      if(this.activeNameApp == 'first'){
        type = 0
      }else if(this.activeNameApp == 'second'){
        type = 1
      }else if(this.activeNameApp == 'third'){
        type = 2
      }
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
          this.init(dom,json)
          
        }
      })
    },
    //获取日志列表
    getLogList(){
      logList(this.listQuery).then(res=>{
        this.list = res.data.data.data
        this.total = res.data.data.total
      })
    },
    paginHandle(val) {
      if (val != undefined) {
        const json = JSON.parse(JSON.stringify(val))
        this.listQuery.page = parseInt(json.page)
        this.listQuery.size = parseInt(json.limit)
      }
      this.getLogList()
    },
    //获取登录平台
    getPlatformsList(){
      getloginSystem().then(res=>{
        this.menuList = res.data
      })
    },
    openUrl(item){
      if(item.jump_type == 'login'){
        window.open(`${item.url}/login?token=${getToken()}`)
      }else{
        window.open(`${item.url}/login`)
      }
    },
    //操作详情
    detailHandle(row){
      this.logDialogVisible = true
      this.itemDetail = row
    },
  },
}
</script>

<style lang="scss" scoped>
.home-page{
  // display: flex;
  .left-box{
    // width: 75%;
    margin-right: 20px;
    padding-right:20px ;
    .title{
      border-left: 4px solid #409eff;
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .pie-echarts-wrap{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .pie-echarts-box{
        width: 48%;
        box-shadow: 0px 0px 5px 5px rgba(0,21,41,0.08);
        margin-bottom: 20px;
        border-radius: 5px;
        padding: 15px;
        box-sizing: border-box;
        .title-box{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .top-box{
            display: flex;
          }
          span{
            font-size: 24px;
          }
          .my-tabs{
            margin-left: 20px;
            margin-top: -2px;
            /deep/.el-tabs__item{
              height: 30px;
            }
          }
          .small-title{
            margin-left: 20px;
            color: #1890ff;
            font-size: 14px;
            margin-top: 12px;
          }
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
        .my-echarts{
          height: 150px;
          width: 100%;
          margin-top: 10px;
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
    }
  }
  .right-box{
    // flex: 1;
    .title{
      border-left: 4px solid #409eff;
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 14px;
    }
    .right-wrap-box{
      display: flex;
      margin-bottom: 20px;
      // flex-wrap: wrap;
      // justify-content: space-between;
      .item{
        // width: 50%;
        border: 1px solid #dfe6ec;
        border-right: none;
        padding: 10px 30px;
        text-align: center;
        font-size: 14px;
      }
      .item:last-child{
        border-right: 1px solid #dfe6ec;
      }
      // .item:nth-child(2n+2){
      //   border-left: none;
      // }
      // .item:nth-child(n+3){
      //   border-top: none;
      // }
    }
  }
}
.desc-box-div{
  width: 100%;
  white-space:nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: #409eff;
}
/deep/.el-dialog__wrapper {
    overflow: auto; 
}
</style>

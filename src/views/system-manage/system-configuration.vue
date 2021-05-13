<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tabData" :key="index" :label="item.name" :name="item.field"></el-tab-pane>
    </el-tabs>
    <div class="configuration-wrap-box margin-top-5" v-for="(item,index) in confignData" :key="index">
      <el-form :model="item"  ref="ruleForm" label-width="180px" class="demo-ruleForm" label-position="left">
          <el-form-item v-if="item.type=='text'"  :label="item.title+'：'" >
              <span slot="label">
                <span style="color:red">*</span>
                <span>{{item.title+'：'}}</span>
              </span>
              <el-input v-model="item.value" :style="{'width':widthPage+'px'}"></el-input>
              <div v-if="item.description == null" class="right-explain"></div>
              <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
           <el-form-item v-if="item.type=='number'"  :label="item.title+'：'" >
              <span slot="label">
                <span style="color:red">*</span>
                <span>{{item.title+'：'}}</span>
              </span>
              <el-input-number v-model="item.value" controls-position="right"  :min="item.rules.min" :max="item.rules.max" :style="{'width':widthPage+'px'}"></el-input-number>
              <div v-if="item.description == null" class="right-explain"></div>
              <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
          <el-form-item v-if="item.type=='select'" :label="item.title+'：'" >
              <span slot="label">
                <span style="color:red">*</span>
                <span>{{item.title+'：'}}</span>
              </span>
              <el-select v-model="item.value" placeholder="请选择" :style="{'width':widthPage+'px'}">
              <el-option v-for="(item,j) in item.data" :key="j" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <div v-if="item.description == null" class="right-explain"></div>
              <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
            <el-form-item v-if="item.type=='checkbox'" :label="item.title+'：'" >
              <span slot="label">
                <span style="color:red">*</span>
                <span>{{item.title+'：'}}</span>
              </span>
              <el-checkbox-group v-model="item.value"  :style="{'width':widthPage+'px'}">
              <el-checkbox v-for="(item,m) in item.data" :key="m" :label="item.value" :name="item.name+'index'">{{item.name}}</el-checkbox>
              </el-checkbox-group>
              <div v-if="item.description == null" class="right-explain"></div>
              <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
          <el-form-item v-if="item.type=='radio'" :label="item.title+'：'" >
              <span slot="label">
                <span style="color:red">*</span>
                <span>{{item.title+'：'}}</span>
              </span>
              <el-radio-group v-model="item.value" :style="{'width':widthPage+'px'}">
                <el-radio v-for="(item,n) in item.data" :key="n" :label="item.value.toString()" :name="item.name+'index'">{{item.name}}</el-radio>
              </el-radio-group>
              <div v-if="item.description == null" class="right-explain"></div>
              <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
          <el-form-item v-if="item.type=='textarea'" :label="item.title+'：'" >
              <span slot="label">
                <span style="color:red">*</span>
                <span>{{item.title+'：'}}</span>
              </span>
              <el-input type="textarea" v-model="item.value" :style="{'width':widthPage+'px'}"></el-input>
              <div v-if="item.description == null" class="right-explain"></div>
              <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
          <el-form-item v-if="item.type=='date'" :label="item.title+'：'" required>
            <el-date-picker type="date" placeholder="选择日期" v-model="item.value" :style="{'width':widthPage+'px'}" value-format="yyyy-MM-dd"></el-date-picker>
            <div v-if="item.description == null" class="right-explain"></div>
            <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
          <el-form-item v-if="item.type=='datetime'" :label="item.title+'：'" required>
            <el-date-picker type="datetime" placeholder="选择日期" v-model="item.value2" :style="{'width':widthPage+'px'}" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <div v-if="item.description == null" class="right-explain"></div>
            <div v-else class="right-explain">({{item.description}})</div>
          </el-form-item>
          <el-form-item v-if="item.type=='time'" :label="item.title+'：'" required>
            <el-time-picker v-model="item.value" placeholder="选择时间" :style="{'width':widthPage+'px'}" value-format="HH:mm" format='HH:mm'></el-time-picker>
            <span v-if="item.description == null" class="right-explain"></span>
            <span v-else class="right-explain">({{item.description}})</span>
          </el-form-item>
          <el-form-item v-if="item.type=='editor'" :label="item.title+'：'" required>
            <tinymce :ref="`tinymce${index}`" v-model="item.value" style="width: 600px;" :height="150"/>
            <span v-if="item.description == null" class="right-explain"></span>
            <span v-else class="right-explain">({{item.description}})</span>
          </el-form-item>
      </el-form>
    </div>
    <div class="save-btn">
        <el-button  type="primary" @click="saveConfigContent">保存</el-button>
    </div>
  </div>
</template>
<script>
import { getConfigList,getConfigGroupsList,getConfigUpdate } from "@/api/system-manage/system-configuration";
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      activeName: '',
      confignData:[],
      tabData:[],
      widthPage:0,
    }
  },
  mounted () {
    this.getTabList();
  },
  methods: {
    //获取tab数据
    getTabList(){
      getConfigGroupsList().then(res=>{
        this.tabData = res.data
        this.activeName = this.tabData[0].field
        this.getConfignList();
      })
    },
    //获取系统选项内容
    getConfignList(){
      getConfigList({groups:this.activeName}).then(res=>{
        this.confignData = res.data.data
        this.confignData.map((item,index)=>{
          if(item.type=='editor'){
            this.widthPage = 600
            let text = `tinymce${index}`
            this.$ref.text.setContent(item.value)
          }else{
            this.widthPage = 300
          }
        })
      })
    },
    handleClick() {
      this.getConfignList();
    },
    //保存系统选项
    saveConfigContent(){
        let arr = []
        let data = this.confignData
        for(let i=0;i<data.length;i++){
          if(data[i].value == '' || data[i].value== null){
            if(data[i].value == 0){
              let json = {id:data[i].id,value:data[i].value}
              arr.push(json)
            }else{
              this.$message({
                message: `${data[i].title}不能为空`,
                type: "warning"
              });
              return
            }
          }else{
            let json = {id:data[i].id,value:data[i].value}
            arr.push(json)
          }
        }
        getConfigUpdate(arr).then(res=>{
            if(res.code == 0){
                this.$message({
                    message: "保存成功",
                    type: "success"
                });
                this.getConfignList()
            }
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.save-btn{
  margin-top: 30px;
  margin-left:180px;
}
.configuration-wrap-box{
    // display: flex;
    .demo-ruleForm{
        width: 100%;
    }
}
/deep/.el-form-item__content{
    display: flex;
    justify-content: space-between;
}
.right-explain{
    flex: 1;
    margin-left: 100px;
    // text-align: right;
}
/deep/.el-radio-group{
    line-height: 45px;
}
.margin-top-5{
    margin-top: 5px;
}
/deep/.el-input-number.is-controls-right .el-input__inner{
  text-align: left;
}
</style>

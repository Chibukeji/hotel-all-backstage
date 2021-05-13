<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="系统配置" name="first">
        <el-button type="primary" size="small" @click="selectImg">选择图片</el-button>
      </el-tab-pane>
      <el-tab-pane label="上传配置" name="second">上传配置</el-tab-pane>
      <el-tab-pane label="短信配置" name="third">短信配置</el-tab-pane>
      <el-tab-pane label="第三方登录" name="fourth">第三方登录</el-tab-pane>
      <el-tab-pane label="logo设置" name="fifth">logo设置</el-tab-pane>
    </el-tabs>
    <img-gallery ref="imgGalleryChild" />
    <dialog-site/>
  </div>
</template>

<script>
import ImgGallery from '@/components/ImgGallery'
import DialogSite from '@/components/DialogSite'
export default {
  components: { ImgGallery,DialogSite },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    selectImg() {
      this.$refs.imgGalleryChild.init()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

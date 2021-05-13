<template>
  <div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
      <span class="filter-item">
        <span class="select-title">类型：</span>
        <el-select v-model="listQuery.type" placeholder="类型" style="width: 160px">
          <el-option v-for="(item,index) in logType" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </span>
      <el-input v-model="listQuery.nickname" placeholder="输入关键词" style="width: 300px;" class="filter-item" />
      <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password_show }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.last_login_time }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="paginHandle" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import mix from '@/mixs/mix'
export default {
  components: { Pagination },
  mixins: [mix],
  data() {
    return {
      listQuery: {
        type: '',
        nickname: '',
        page: 1,
        size: 0
      },
      total: 0,
      listLoading: false,
      list: [],
      logType: [
        {
          name: '新增',
          value: '1'
        },
        {
          name: '编辑',
          value: '2'
        },
        {
          name: '删除',
          value: '3'
        }
      ]
    }
  },
  methods: {
    handleFilter() {

    },
    paginHandle() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>

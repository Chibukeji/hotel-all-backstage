<template>
    <div>
        <el-dialog :visible.sync="editDialogVisible" :title="dialogTitle" class="center-dialog" width="95%">
            <div class="filter-container">
            <span class="filter-item">
                <el-input v-model="listQuery.keyword" placeholder="请输入员工名称"></el-input>
            </span>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;">
                <el-table-column label="ID" align="center" width="80">
                    <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="账号" align="center" width="160">
                    <template slot-scope="{row}">
                    <span>{{ row.username }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="密码" align="center" width="160"> 
                    <template slot-scope="{row}">
                    <span>{{ row.password_show }}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="真实名称" align="center" width="140">
                    <template slot-scope="{row}">
                    <span>{{ row.tname }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="手机号" align="center" width="140">
                    <template slot-scope="{row}">
                    <span>{{ row.mobile }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="角色名称" align="center" width="120">
                    <template slot-scope="{row}">
                    <span>{{ row.group_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="酒店" align="left" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                    <span>{{ row.hotel_names }}</span>
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
                            <img :src="row.member_head_pic" class="heder-img">
                            <span class="member-name">{{row.member_nickname}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" width="170">
                    <template slot-scope="{row}">
                    <span>{{ row.create_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最近登录时间" align="center" width="170">
                    <template slot-scope="{row}">
                        <span v-if="row.last_time == '' ||row.last_time == null">-</span>
                        <span v-else>{{ row.last_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" :autoScroll='false' @pagination="paginHandle" />
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { hotelAccountList} from '@/api/system-manage/role-list'
    export default {
        components: { Pagination },
        data() {
            return {
                editDialogVisible: false,
                dialogTitle:'',
                listQuery:{
                    page: 1,
                    size: 10,
                    keyword:'',
                },
                total: 0,
                list: [],
                listLoading:false,
                detailItem:'',
            }
        },
        methods: {
            init(item){
                this.detailItem = item
                this.editDialogVisible = true
                this.dialogTitle = '员工列表'
                this.getList()
            },
            //获取列表
            getList(){
                this.listLoading = true
                let params= Object.assign(this.listQuery,{id:this.detailItem.id})
                hotelAccountList(params).then(res=>{
                    if(res.code == 0){
                        this.list = res.data.data
                        this.total = res.data.total
                    }
                    this.listLoading = false
                })
            },
            handleFilter(){
                this.listQuery.page = 1
                this.getList()
            },
            // 点击翻页
            paginHandle(val) {
                if (val != undefined) {
                    const json = JSON.parse(JSON.stringify(val))
                    this.listQuery.page = parseInt(json.page)
                    this.listQuery.size = parseInt(json.limit)
                }
                this.getList()
            },
        },
    }
</script>

<style lang="scss" scoped>
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
</style>
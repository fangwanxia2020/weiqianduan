<template>
    <div class="schedule">
        <div class="schedule_title">临期任务情况</div>


        <el-form :inline="true">
            <el-form-item label="剩余时间：">
                <el-select placeholder="请选择" v-model="form.query.dateNum" @change="getList">

                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="局办：">
                <el-select placeholder="请选择" v-model="form.query.orgId" @change="getList" style="width:120%">

                    <el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

        </el-form>

        <div class="schedule_total"> <span class="total_title">总任务数</span> <span class="total_count">{{total}}</span> </div>

        <div class="schedule_list" v-for="(item,index) in tableData" :key="index"    @click="navigater(`/leadertask/schedule/taskPlan/detail?id=${item.id}`)">
            <div class="schedule_list_item">
                <div class="item_1">
                 <el-tag v-if="item.urgency==0" type="danger">特急</el-tag>
              <el-tag  v-if="item.urgency==1"  type="warning">加急</el-tag>
              <el-tag  v-if="item.urgency==2"  type="success">普通</el-tag>
                    <span class="item_name">{{item.name}}</span>
                </div>
                <div class="item_2">
                    <span class="item_2_1">截止：{{item.deadlineTime?item.deadlineTime.substring(0, 16):null}}</span>
                    <span class="item_2_2">剩余{{item.comingToEndDateTime}}</span>
                </div>
                <div></div>
            </div>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        style="text-align:center;margin-top:20px"
            :current-page="form.pageNum" :page-sizes="[10, 20, 30]" :page-size="form.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {
        sys_org,
        getTask
    } from "@/api/schedule/temporary";

    export default {
        data() {
            return {
                tableData: [],
                form: {
                    pageNum: 1,
                    pageSize: 10,
                    query: {
                        dateNum: 3,
                        orgId: ''
                    }
                },
                options1: [{
                        value: 3,
                        label: '3天以内'
                    },
                    {
                        value: 7,
                        label: '7天以内'
                    },
                    {
                        value: 30,
                        label: '30天以内'
                    },
                    {
                        value: '',
                        label: '所有临期'
                    },
                ],
                options2: [],

                total: 0
            }
        },
        async created() {
            await this.init()
            this.getList()
        },
        methods: {
            async init() {
                const res = await sys_org()
                this.options2 = res.data;
                this.form.query.orgId = res.data[0].id
            },
            async getList() {
                const res = await getTask(this.form)
                this.tableData = res.data.list
                this.total = res.data.pagination.total
            },
            handleSizeChange(val) {
                this.form.pageSize = val
                this.getList()
            },
            handleCurrentChange(val) {
                 this.form.pageNum = val
                this.getList()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .schedule {
        &_title {
            font-size: 26px;
            font-weight: 600;
            margin: 20px;
            margin-left: 0;


        }

        &_total {
            height: 60px;

            margin: 10px 0;

            .total_title {
                font-size: 20px;
                height: 50px;
                line-height: 50px;
                font-weight: 600;
                margin-right: 10px;

            }

            .total_count {
                color: #0079FE;
                font-size: 26px;
                height: 50px;

                line-height: 50px;
            }
        }

        &_list {
          margin-bottom: 6px;
          width: 70%;
    border-radius: 10px;
    overflow: hidden;
            &_item {
                background-color: rgba(247,247,247);
                overflow: hidden;
                padding: 10px 20px;

                .item_1 {
                    height: 30px;
                }

                .item_2 {
                    float: right;
                    height: 30px;
                    height: 30px;
                    min-width: 320px;
                    font-size: 14px;
                    &_1 {
                        margin-right: 20px;
                    }

                    &_2 {
                        color: #0079FE;
                    }
                }
            }
        }
    }

    ::v-deep .el-form-item {
        margin-right: 70px;
    }
    .item_name{
        font-weight: bold;
        margin-left: 10px;
    }
</style>
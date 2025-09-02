<template>
    <div class="PMList">
        <div class="PMList-operation">

        </div>
        <div class="PMList-table">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="Date" width="180" />
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="address" label="Address" />
                <el-table-column fixed="right" label="Operations" min-width="120">
                    <template #default>
                        <el-button link type="primary" size="small">
                            Detail
                        </el-button>
                        <el-button link type="primary" size="small">Edit</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="PMList-pagination">
            <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
                :page-sizes="[50, 100, 200, 300]" :size="size" background
                layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]


const currentPage4 = ref(4)
const pageSize4 = ref(100)
const size = ref('default')

const handleSizeChange = (val) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
}
</script>


<style lang="less" scoped>
.PMList {
    // width: 100%;
    height: 100%;

    .PMList-operation {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #dcdfe6;
    }

    .PMList-table {
        background: #f6f8f9;
        height: calc(100% - 102px);
    }

    .PMList-pagination {
        width: 100%;
        height: 50px;
        padding-left: 20px;
        display: flex;
        align-items: center;
        border-top: 1px solid #dcdfe6;
    }
}
</style>

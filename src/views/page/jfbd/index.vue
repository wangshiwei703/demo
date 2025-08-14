<template>
    <div class="seatable-container">
        <div class="seatable-container-form">
            <formComponent @addNewData="addNewData"></formComponent>
        </div>

        <div class="seatable-container-bubble">
            <van-floating-bubble icon="@image/linelogo.png" @click="handleAddLine">
                <template #default>
                    <img class="seatable-container-bubble-img" src="@image/linelogo.png" />
                </template>
            </van-floating-bubble>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Base } from 'seatable-api';
import formComponent from './components/form.vue'

// 配置信息 - 关键修改：使用相对路径代理
const config = {
    // 开发环境：/seatable-api 会被代理到https://cloud.seatable.cn
    // 生产环境：Netlify会通过netlify.toml转发请求
    server: '/seatable-api',
    APIToken: 'aef45e994553fc21a959eca4fae02af4d9235441', // 你的API令牌
    tableName: 'Table1' // 表格显示名称
};

// 初始化Seatable实例
const base = new Base(config);

// 状态管理
// const tableData = ref([]);
const loading = ref(false);
const error = ref('');
const successMsg = ref('');

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
};

// // 获取数据列表
// const fetchTableData = async () => {
//     loading.value = true;
//     error.value = '';
//     successMsg.value = '';

//     try {
//         await base.auth();

//         const response = await base.listRows(config.tableName);

//         tableData.value = response.map(row => ({
//             _id: row._id,
//             名称: row.名称,
//             _ctime: row._ctime,
//         }));

//     } catch (err) {
//         error.value = `获取数据失败：${err.message || '未知错误'}`;
//         console.error('获取数据错误详情：', err);
//     } finally {
//         loading.value = false;
//     }
// };

// 添加新数据
const addNewData = async (val) => {
    console.log(val);

    loading.value = true;
    error.value = '';
    successMsg.value = '';

    // try {
    //     await base.auth();

    //     const rowData = {
    //         名称: `新数据-${new Date().getTime()}`, // 带时间戳避免重复
    //     };

    //     const response = await base.appendRow(config.tableName, rowData);
    //     successMsg.value = `添加成功！新记录ID：${response._id}`;

    //     // 刷新列表
    //     // fetchTableData();

    // } catch (err) {
    //     error.value = `添加失败：${err.message || '未知错误'}`;
    //     console.error('添加数据错误详情：', err);
    // } finally {
    //     loading.value = false;
    // }
};


const lineList = [{
  id:'jfjf5320',
  url: 'https://line.me/ti/p/MkbMpsd3r2',
},{
  id:'zsw1y',
  url: 'https://line.me/ti/p/m_PyqSKD7Y',
},{
  id:'zbw1n',
  url: 'https://line.me/ti/p/UwJa5DD-nF',
}]

// 随机选择一个企业微信账号
const selectRandomWecom = () => {
    const randomIndex = Math.floor(Math.random() * lineList.length);
    return lineList[randomIndex];
};

// 处理添加LINE操作
const handleAddLine = async () => {
    triggerTikTokConversion()
    const lineObj = selectRandomWecom()

    // 1. 打开LINE添加页面
    window.open(lineObj.url, '_blank');
    // window.location.href = 'https://line.me/ti/p/dZG9cwvMLs'
};


// 触发TikTok Pixel转化事件
const triggerTikTokConversion = () => {
    if (window.ttq) {
        window.ttq.track('ClickButton', {
            contents: [
                {
                    content_id: 'lineId',
                    content_name: 'Line添加成功',
                    content_type: 'line',
                }],
            value: 1,
            currency: 'CNY'
        }, {
            event_id: generateEventId()
        });

        console.log('TikTok Pixel转化事件已触发');
    }
};

// 生成时间戳+随机数格式的event_id
const generateEventId = () => {
    const timestamp = Date.now(); // 毫秒级时间戳
    const random = Math.floor(Math.random() * 1000000); // 6位随机数
    return `${timestamp}_${random}`;
};


// 页面加载时自动获取数据
onMounted(() => {
    // fetchTableData();
});
</script>

<style scoped>
/* 样式保持不变 */
.seatable-container {
    width: 100%;
    background: #f7f8fa;
}



.seatable-container-bubble-img{
    width: 70%;
}
</style>


<style>
.van-floating-bubble{
    background: #37c200 !important;
}
</style>
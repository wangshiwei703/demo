<template>
    <div class="seatable-container">
        <van-form @submit="handelSubmit">
            <van-cell-group inset>
                <van-field v-model="fromData.name" name="name" label="姓名" placeholder="请输入姓名"
                    :rules="[{ required: true, message: '请输入正确内容' }]" />
                <van-field name="gender" label="性别">
                    <template #input>
                        <van-radio-group v-model="fromData.gender" direction="horizontal">
                            <van-radio name="male">男</van-radio>
                            <van-radio name="female">女</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="fromData.age" name="age" type="number" label="年龄" />
                <van-field v-model="fromData.height" name="height" type="number" label="身高" />
                <van-field v-model="fromData.currentWeight" name="currentWeight" type="number" label="当前体重" />
                <van-field v-model="fromData.targetWeight" name="targetWeight" type="number" label="期望体重" />
                <van-field v-model="fromData.lineId" name="lineId" label="line号" placeholder="校验函数返回错误提示"
                    :rules="[{ required: true, message: '请输入正确内容' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup>
import { reactive } from "vue";
const emit = defineEmits(['addNewData']);
// 表单
const fromData = reactive({
    name: '',
    value2: '',
    value3: '',
});

const handelSubmit = () => {
    emit('addNewData', fromData)
}

</script>
<template>
    <div class="seatable-container">
        <van-form @submit="handelSubmit" ref="form">
            <van-cell-group inset>
                <van-field v-model="fromData.name" name="name" label="昵称" placeholder="请输入昵称"
                    :rules="[{ required: true, message: '请输入正确内容' }]" />
                <van-field name="gender" label="性别">
                    <template #input>
                        <van-radio-group v-model="fromData.gender" direction="horizontal">
                            <van-radio name="男">男</van-radio>
                            <van-radio name="女">女</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="fromData.age" name="age" type="number" label="年龄" placeholder="请输入年龄"
                    :rules="[{ required: true, message: '请输入正确内容' }]" />
                <van-field v-model="fromData.height" name="height" type="number" label="身高" placeholder="请输入身高" />
                <van-field v-model="fromData.currentWeight" name="currentWeight" type="number" label="当前体重"
                    placeholder="请输入当前体重" />
                <van-field v-model="fromData.targetWeight" name="targetWeight" type="number" label="期望体重"
                    placeholder="请输入期望体重" />
                <van-field v-model="fromData.lineId" name="lineId" label="line号" placeholder="请输入line号"
                    :rules="[{ validator: validateWeight, message: 'line号和手机号至少填写一项' }]" />
                <van-field v-model="fromData.phone" name="phone" label="手机号" placeholder="请输入手机号"
                    :rules="[{ validator: validateWeight, message: 'line号和手机号至少填写一项' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" :disabled="addNewDataShow"  native-type="submit">
                     {{ addNewDataShow? '已提交' : '提交' }}
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup>
import { reactive } from "vue";
const emit = defineEmits(['addNewData']);

const props = defineProps({
  addNewDataShow: {
    type: Boolean,
    // 对象/数组的默认值需用函数返回
    default: false
  }
})

// 表单
const fromData = reactive({
    name: '',
    gender: '',
    age: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    lineId: '',
    phone: '',
});

// 自定义校验规则​
const validateWeight = () => {
    if (fromData.lineId || fromData.phone) {
        return true
    }
    return false
}

const handelSubmit = () => {
    emit('addNewData', fromData)
}

</script>


<style lang="css" scoped>
.seatable-container{
    margin: 20px 0px;
}
</style>
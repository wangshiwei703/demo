<template>
    <div class="seatable-container">
        <div class="form-header">
            <img src="@image/form-header.jpg" alt="减肥产品表单标题图" class="header-image">
        </div>
        <van-form @submit="handelSubmit" ref="form">
            <van-cell-group inset>
                <van-field v-model="fromData.name" name="name" size="large" label="ニックネーム" placeholder="ニックネームを入力してください"
                    :rules="[{ required: true, message: '正しい内容を入力してください' }]" />
                <van-field name="gender" label="性別" size="large">
                    <template #input>
                        <van-radio-group v-model="fromData.gender" direction="horizontal">
                            <van-radio name="男">男</van-radio>
                            <van-radio name="女">女</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="fromData.age" name="age" size="large" type="number" label="年齢"
                    placeholder="年齢を入力してください" :rules="[{ required: true, message: '正しい内容を入力してください' }]" />
                <van-field v-model="fromData.height" name="height" size="large" type="number" label="身長"
                    placeholder="身長を入力してください" />
                <van-field v-model="fromData.currentWeight" name="currentWeight" size="large" type="number"
                    label="現在の体重" placeholder="現在の体重を入力してください" />
                <van-field v-model="fromData.targetWeight" name="targetWeight" size="large" type="number" label="目標体重"
                    placeholder="目標体重を入力してください" />
                <van-field v-model="fromData.lineId" name="lineId" size="large" label="LINE ID"
                    placeholder="LINE IDを入力してください"
                    :rules="[{ validator: validateWeight, message: 'LINE IDと電話番号は少なくとも一方を入力してください' }]" />
                <van-field v-model="fromData.phone" name="phone" size="large" label="電話番号" placeholder="電話番号を入力してください"
                    :rules="[{ validator: validateWeight, message: 'LINE IDと電話番号は少なくとも一方を入力してください' }]" />
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round block type="primary" :disabled="addNewDataShow" native-type="submit">
                    {{ addNewDataShow ? '送信済み' : '送信' }}
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
        default: false
    }
})

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


<style lang="css">
.seatable-container {
}

.header-image {
    width: 100%;
    display: block;
    /* 解决inline-block带来的换行间隙 */
    margin: 0;
    /* 清除默认外边距 */
    padding: 0;
    /* 清除默认内边距 */
    border: none;
    /* 某些浏览器会给图片加默认边框 */
}

.van-field__control {
    font-size: 16px;
}
</style>
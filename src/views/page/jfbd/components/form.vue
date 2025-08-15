<template>
    <div class="seatable-container">
        <van-form @submit="handelSubmit" ref="form">
            <van-cell-group inset>
                <van-field v-model="fromData.name" name="name" label="ニックネーム" placeholder="ニックネームを入力してください"
                    :rules="[{ required: true, message: '正しい内容を入力してください' }]" />
                <van-field name="gender" label="性別">
                    <template #input>
                        <van-radio-group v-model="fromData.gender" direction="horizontal">
                            <van-radio name="男">男</van-radio>
                            <van-radio name="女">女</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="fromData.age" name="age" type="number" label="年齢" placeholder="年齢を入力してください"
                    :rules="[{ required: true, message: '正しい内容を入力してください' }]" />
                <van-field v-model="fromData.height" name="height" type="number" label="身長" placeholder="身長を入力してください" />
                <van-field v-model="fromData.currentWeight" name="currentWeight" type="number" label="現在の体重"
                    placeholder="現在の体重を入力してください" />
                <van-field v-model="fromData.targetWeight" name="targetWeight" type="number" label="目標体重"
                    placeholder="目標体重を入力してください" />
                <van-field v-model="fromData.lineId" name="lineId" label="LINE ID" placeholder="LINE IDを入力してください"
                    :rules="[{ validator: validateWeight, message: 'LINE IDと電話番号は少なくとも一方を入力してください' }]" />
                <van-field v-model="fromData.phone" name="phone" label="電話番号" placeholder="電話番号を入力してください"
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


<style lang="css" scoped>
.seatable-container {
    margin: 20px 0px;
}
</style>
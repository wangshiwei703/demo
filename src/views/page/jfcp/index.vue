<template>
  <div class="vite-vue3-template-root">
    <div class="header">
      <homeHeader></homeHeader>
    </div>
    <div class="main">
      <replyDialog @addButton="handelAddButton"></replyDialog>
    </div>
    <div class="bottom" v-if="addButtonShow">
      <LineAddButton />
    </div>
  </div>
</template>


<script setup>
import LineAddButton from '../../components/LineAddButtonRY.vue';
import homeHeader from './components/header.vue';
import replyDialog from "./components/replyDialog.vue";
import { ref } from "vue";

const addButtonShow = ref(false)

const handelAddButton = () => {
  addButtonShow.value = true
}

</script>

<style scoped lang="less">
.vite-vue3-template-root {
  width: 100%;
  min-height: 100%;
  background-color: #f5f5f5;

  .bottom {
    display: flex;
    justify-content: space-around;
    padding-bottom: 30px;
  }
}
</style>
<template>
  <div class="dialog-container">
    <!-- 对话内容区域 -->
    <div class="conversation-area">
      <!-- 循环展示所有对话消息 -->
      <div 
        v-for="(message, index) in conversationMessages" 
        :key="index" 
        class="message-item"
        :class="{ 'user-message': message.isUser }"
      >
        <!-- 系统消息的标签 -->
        <img class="system-img" src="@image/headPortrait.jpg" alt="headPortrait" v-if="!message.isUser"/>
        <!-- 消息内容气泡 -->
        <div class="message-bubble">
          <span v-html="message.content"></span>
        </div>
        <!-- 用户消息的标签 -->
        <img class="avatar-img" src="@image/avatar.jpg" alt="avatar" v-if="message.isUser"/>
      </div>
    </div>

    <!-- 选项按钮区域 -->
    <div class="options-area" v-if="showOptions">
      <button 
        class="option-button"
        v-for="(option, optIndex) in currentOptions" 
        :key="optIndex"
        @click="handleOptionSelect(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['addButton']);
// 存储所有对话消息
const conversationMessages = ref([
  { content: '你好！我是养生小助理，完成问题可报名免费中医养生课', isUser: false },
  { content: '领取养生书需配合完成注册，是否愿意？', isUser: false }
]);

// 当前可选择的选项
const currentOptions = ref([
  '愿意配合',
  '不愿意配合'
]);

// 控制选项是否显示
const showOptions = ref(true);

// 处理选项选择
const handleOptionSelect = (selectedOption) => {
  // 添加用户选择到对话记录
  conversationMessages.value.push({
    content: selectedOption,
    isUser: true
  });

  // 根据选择展示不同回复
  if (selectedOption === '愿意配合') {
    // 愿意配合的后续问题
    conversationMessages.value.push({
      content: '养生中心为了更好的帮助有需求的人，请问您的真实意图是什么？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '免费听课领养生书',
      '看小说跳过广告',
      '领取看广告的金币',
      '领游戏道具福利'
    ];
  } else if(selectedOption === '免费听课领养生书'){
    // 免费听课领养生书的后续问题
    conversationMessages.value.push({
      content: '您今年多大年龄呢?(仅限五十岁以上领取)',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '50岁以下',
      '50-55',
      '55-60',
      '60岁以上'
    ];
  } else if(selectedOption === '50-55' || selectedOption === '55-60' || selectedOption === '60岁以上'){
    // 年龄的后续问题
    conversationMessages.value.push({
      content: '请选择您想领取养生书的用途？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '用来学习养生知识',
      '用来日常预防疾病',
      '用来调理血压血糖',
    ];
  } else if(selectedOption === '用来学习养生知识' || selectedOption === '用来日常预防疾病' || selectedOption === '用来调理血压血糖'){
    // 年龄的后续问题
    conversationMessages.value.push({
      content: '是否愿意添加客服微信按照客服提示领取养生书养生课？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '我愿意',
      '我不愿意',
    ];
   } else if(selectedOption === '我愿意'){
    conversationMessages.value.push({
      content: '恭喜您符合 免费领取 的条件，现在点击下方按钮 添加客服主动打招呼，即可免费领取，以打招呼先后顺序排名，仅剩最后17个!',
      isUser: false
    });
    conversationMessages.value.push({
      content: '官方告知函：添加客服即代表获取到免费资格，请主动与客服打招呼申请，不说话者，不配合注册领取流程者，将被平台拉黑，今后将列为本平台失信人员，无法参与平台所有商品的免费领取活动！！',
      isUser: false
    });
    currentOptions.value = []
    emit('addButton');
   } else {
    // 不愿意配合的回复
    conversationMessages.value.push({
      content: '对不起，您不具备领取资格！',
      isUser: false
    });
    // 隐藏选项
    showOptions.value = false;
  }
};
</script>

<style scoped>
.dialog-container {
  margin: 20px auto;
  padding: 10px;
  border-radius: 10px;
}

.conversation-area {
  margin-bottom: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
}

.system-img {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  padding: 4px 8px;
}

.avatar-img{
  width: 42px;
  height: 42px;
  border-radius: 13px;
  padding: 4px 8px;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 70%;
}

/* 区分系统和用户消息样式 */
.message-item:not(.user-message) .message-bubble {
  background-color: white;
  border: 1px solid #eee;
}

.user-message {
  justify-content: flex-end;
}

.user-message .message-bubble {
  background-color: #f7b766;
  color: white;
}

.options-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-button {
  padding: 12px;
  background-color: #f7b766;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
}

.option-button:hover {
  opacity: 0.9;
}
</style>

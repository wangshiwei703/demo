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
  { content: '你好！我是養生小助理，完成問題可報名免費中醫養生課', isUser: false },
  { content: '領取養生書需配合完成註冊，是否願意？', isUser: false }
]);

// 当前可选择的选项
const currentOptions = ref([
  '願意配合',
  '不願意配合'
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
  if (selectedOption === '願意配合') {
    // 願意配合的后续问题
    conversationMessages.value.push({
      content: '養生中心爲了更好的幫助有需求的人，請問您的真實意圖是什麼？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '免費聽課領養生書',
      '看小說跳過廣告',
      '領取看廣告的金幣',
      '領遊戲道具福利'
    ];
  } else if(selectedOption === '免費聽課領養生書'){
    // 免費聽課領養生書的后续问题
    conversationMessages.value.push({
      content: '您今年多大年齡呢?(僅限五十歲以上領取)',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '50歲以下',
      '50-55',
      '55-60',
      '60歲以上'
    ];
  } else if(selectedOption === '50-55' || selectedOption === '55-60' || selectedOption === '60歲以上'){
    // 年龄的后续问题
    conversationMessages.value.push({
      content: '請選擇您想領取養生書的用途？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '用來學習養生知識',
      '用來日常預防疾病',
      '用來調理血壓血糖',
    ];
  } else if(selectedOption === '用來學習養生知識' || selectedOption === '用來日常預防疾病' || selectedOption === '用來調理血壓血糖'){
    // 年龄的后续问题
    conversationMessages.value.push({
      content: '是否願意添加客服微信按照客服提示領取養生書養生課？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '我願意',
      '我不願意',
    ];
   } else if(selectedOption === '我願意'){
    conversationMessages.value.push({
      content: '恭喜您符合 <span style="color: red;font-weight: bold;">免費領取</span> 的條件，現在點擊下方按鈕 添加客服主動打招呼，即可免費領取，以打招呼先後順序排名，僅剩最後17個!',
      isUser: false
    });
    conversationMessages.value.push({
      content: '官方告知函：添加客服即代表獲取到免費資格，請主動與客服打招呼申請，不說話者，不配合註冊領取流程者，將被平臺拉黑，今後將列爲本平臺失信人員，無法參與平臺所有商品的免費領取活動！！',
      isUser: false
    });
    currentOptions.value = []
    emit('addButton');
   } else {
    // 不願意配合的回复
    conversationMessages.value.push({
      content: '對不起，您不具備領取資格！',
      isUser: false
    });
    // 隐藏选项
    showOptions.value = false;
  }
};
</script>

<style scoped>
.dialog-container {
  margin-top: 20px;
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

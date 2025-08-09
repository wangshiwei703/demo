<template>
  <div class="dialog-container">
    <!-- 对话内容区域 -->
    <div class="conversation-area">
      <!-- 循环展示所有对话消息 -->
      <div v-for="(message, index) in conversationMessages" :key="index" class="message-item"
        :class="{ 'user-message': message.isUser }">
        <!-- 系统消息的标签 -->
        <img class="system-img" src="@image/hushi.png" alt="headPortrait" v-if="!message.isUser" />
        <!-- 消息内容气泡 -->
        <div class="message-bubble">
          <span v-html="message.content"></span>
        </div>
        <!-- 用户消息的标签 -->
        <img class="avatar-img" src="@image/avatar.jpg" alt="avatar" v-if="message.isUser" />
      </div>
    </div>

    <!-- 选项按钮区域 -->
    <div class="options-area" v-if="showOptions">
      <button class="option-button" v-for="(option, optIndex) in currentOptions" :key="optIndex"
        @click="handleOptionSelect(option)">
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['addButton','scrollToBottom']);
// 存储所有对话消息
const conversationMessages = ref([
  { content: 'こんにちは、男性健康管理センターの相談を受け付けております。男性（早漏、勃起不全、前立腺、腎虚）などのお悩み改善をご希望ですか？変われたあなたは、きっと今日この選択を感謝されるはずです。いくつか質問にお答えいただけますか？', isUser: false }
]);

// 当前可选择的选项
const currentOptions = ref([
  'ご協力いただける',
  'ご協力いただけない',
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
  if (selectedOption === 'ご協力いただける') {
    // 年龄
    conversationMessages.value.push({
      content: 'お客様の年齢をお教えください',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '25歳未満',		
      '25～35歳',
      '35～45歳',
      '45歳以上'
    ];
  } else if (selectedOption === '25歳未満' || selectedOption === '25～35歳' || selectedOption === '35～45歳' || selectedOption === '45歳以上') {
    // 体重
    conversationMessages.value.push({
      content: 'どのようなお悩みについてご相談されますか？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '早漏の改善',
      '勃起不全の改善',
      'ペニス短小の改善',
      '腎虚の改善',
    ];
  } else if (selectedOption === '早漏の改善' || selectedOption === '勃起不全の改善' || selectedOption === 'ペニス短小の改善' || selectedOption === '腎虚の改善') {
    // 减肥周期
    conversationMessages.value.push({
      content: '性生活の持続時間はどれくらいですか？',
      isUser: false
    });
    currentOptions.value = [
      '0～10分',
      '10～15分',
      '15～20分',
      '20～30分'
    ]
  } else if (selectedOption === '0～10分' || selectedOption === '10～15分' || selectedOption === '15～20分' || selectedOption === '20～30分') {
    conversationMessages.value.push({
      content: '当センターの専門家は経験豊富で、すでに10万人以上の男性のお悩み改善をお手伝いし、その日の改善を実感していただいております。健康に害はありません。下記ボタンをクリックし、専門家アシスタントのLINEを追加して、詳しい情報をご覧ください。',
      isUser: false
    });
    currentOptions.value = []
    emit('addButton');
  } else {
    // 不愿意配合的回复
    conversationMessages.value.push({
      content: '申し訳ございませんが、あなたは今回のキャンペーンの対象条件を満たしておりません。重複して送信しないでください。ご了承ください。',
      isUser: false
    });
    // 隐藏选项
    showOptions.value = false;
  }

  emit('scrollToBottom');
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

.avatar-img {
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

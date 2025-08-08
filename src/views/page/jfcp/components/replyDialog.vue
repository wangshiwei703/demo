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
  { content: 'こんにちは！お客様に最適なプランを正確にマッチングし、効果と効率を最大化するために、1分だけお時間をいただき、いくつかの質問にお答えいただけますでしょうか？', isUser: false }
]);

// 当前可选择的选项
const currentOptions = ref([
  'いいえ、いいえ。',
  '喜んで。',
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
  if (selectedOption === '喜んで。') {
    // 年龄
    conversationMessages.value.push({
      content: 'あなたは今年何歳ですか？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '18歳以下',
      '18-25',
      '26-35',
      '36-45',
      '45歳以上'
    ];
  } else if (selectedOption === '18-25' || selectedOption === '26-35' || selectedOption === '36-45' || selectedOption === '45歳以上') {
    // 身高
    conversationMessages.value.push({
      content: '現在の身長は？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '145CM未満',
      '145-155CM',
      '155-165CM',
      '165以上'
    ];
  } else if (selectedOption === '145-155CM' || selectedOption === '155-165CM' || selectedOption === '165以上') {
    // 体重
    conversationMessages.value.push({
      content: '現在の体重は？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '45Kg未満',
      '45-60Kg',
      '60-75kg',
      '75Kg以上',
    ];
  } else if (selectedOption === '45-60Kg' || selectedOption === '60-75kg' || selectedOption === '75Kg以上') {
    // 减肥周期
    conversationMessages.value.push({
      content: 'どのくらいの減量サイクルを受け入れたいですか？',
      isUser: false
    });
    currentOptions.value = [
      '15日未満。',
      '15〜30日',
      '30日以上'
    ]
  } else if (selectedOption === '15日未満。' || selectedOption === '15〜30日' || selectedOption === '30日以上') {
    conversationMessages.value.push({
      content: 'はい、私はあなたのニーズを大まかに理解しました〜私たちが特別に招いた国際的に有名な減量とボディシェイピングの専門家が、あなたに適したダイエットプランを作成しました。それには、あなたに合った製品の使用と食事運動のアドバイスが含まれています。今、<span style="color: red;font-weight: bold;">下のボタンをクリックして</span>、カスタマーサービスに詳細な情報を問い合わせてください。',
      isUser: false
    });
    currentOptions.value = []
    emit('addButton');
  } else {
    // 不愿意配合的回复
    conversationMessages.value.push({
      content: 'お時間をいただきありがとうございます～今後、関連するご要望やご質問があれば、いつでも私にご連絡ください。すべてが順調に進むことを願っています！',
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

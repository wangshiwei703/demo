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
  { content: 'こんにちは！私たちは東京大学のトップ研究チームと提携し、「科学減量・ボディシェイプ計画」を熱心に推進中です。', isUser: false },
  { content: 'お客様に最適なプランを正確にマッチングし、最大限の効果と効率を実現するため、1分ほどでいくつかの質問にお答えいただけませんか？', isUser: false },
  { content: 'お客様の年齢をお教えください。', isUser: false }
]);

// 当前可选择的选项
const currentOptions = ref([
  '18歳未満',
  '18～25歳',
  '25～35歳',
  '35～45歳',
  '45歳以上'
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
  if (selectedOption === '18～25歳' || selectedOption === '25～35歳' || selectedOption === '35～45歳' || selectedOption === '45歳以上') {
    // 身高
    conversationMessages.value.push({
      content: '現在の身長をお教えください。',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '145CM未満',
      '145～155cm',
      '155～165cm',
      '165cm以上'
    ];
  } else if (selectedOption === '145～155cm' || selectedOption === '155～165cm' || selectedOption === '165cm以上') {
    // 体重
    conversationMessages.value.push({
      content: '現在の体重をお教えください。',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '45Kg未満',
      '45～60kg',
      '60～75kg',
      '75Kg以上',
    ];
  } else if (selectedOption === '45～60kg' || selectedOption === '60～75kg' || selectedOption === '75Kg以上') {
    // 减肥周期
    conversationMessages.value.push({
      content: 'お受け入れ可能な減量期間はどれくらいですか？',
      isUser: false
    });
    currentOptions.value = [
      '15日未満。',
      '15〜30日',
      '30日以上'
    ]
  } else if (selectedOption === '15日未満。' || selectedOption === '15〜30日' || selectedOption === '30日以上') {
    conversationMessages.value.push({
      content: 'はい、お客様のご要望を大まかに把握いたしました。詳細な情報については、下記のボタンをクリックしてカスタマーサービス担当者にお問い合わせください。',
      isUser: false
    });
    currentOptions.value = []
    emit('addButton');
  } else {
    // 不愿意配合的回复
    conversationMessages.value.push({
      content: '誠に残念ながら、お客様は今回の「減量・ボディシェイプ計画」の参加条件を満たしておりません。重複して送信されませんようお願い申し上げます。',
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

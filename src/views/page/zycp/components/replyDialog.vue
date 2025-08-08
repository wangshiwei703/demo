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
  { content: '你好，欢迎咨询男性健康管理中心，请问您是想改善男性（早X、阳W、前列X、肾虚）等问题吗？蜕变成功后的你一定会感谢今天的这一次选择，请回答几个问题，是否愿意？', isUser: false }
]);

// 当前可选择的选项
const currentOptions = ref([
  '愿意配合',
  '不愿意配合',
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
    // 年龄
    conversationMessages.value.push({
      content: '您今年多大年龄',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '25-35',		
      '35-45',
      '45-55',
      '55-65'
    ];
  } else if (selectedOption === '25-35' || selectedOption === '35-45' || selectedOption === '45-55' || selectedOption === '55-65') {
    // 体重
    conversationMessages.value.push({
      content: '请问你想咨询哪方面的问题?',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '改善(早X)',
      '改善(阳W)',
      '改善(前列X)',
      '改善(肾虚)',
    ];
  } else if (selectedOption === '改善(早X)' || selectedOption === '改善(阳W)' || selectedOption === '改善(前列X)' || selectedOption === '改善(肾虚)') {
    // 减肥周期
    conversationMessages.value.push({
      content: '请问您的房事时间维持多久?',
      isUser: false
    });
    currentOptions.value = [
      '0-10分钟',
      '10-15分钟',
      '15-20分钟',
      '20-30分钟'
    ]
  } else if (selectedOption === '0-10分钟' || selectedOption === '10-15分钟' || selectedOption === '15-20分钟' || selectedOption === '20-30分钟') {
    conversationMessages.value.push({
      content: '好的，大致问题老师已经了解，老师曾帮助过10万人成功改善了男性问题，用了老师的方法后会一点点变好，当天就能见效!纯绿色健康不伤身，这个请您放心就好，这边还需您加一下老师的联系方式，进一步的教你如果处理男题!',
      isUser: false
    });
    currentOptions.value = [
      '我愿意',
      '不愿意',
    ]
  } else if (selectedOption === '我愿意') {
    conversationMessages.value.push({
      content: '恭喜您符合条件，现在点击下方按钮添加客服主动打招呼，即可免费咨询，以打招呼先后顺序排名，仅剩最后17个!',
      isUser: false
    });
    currentOptions.value = []
    emit('addButton');
  } else {
    // 不愿意配合的回复
    conversationMessages.value.push({
      content: '对不起，您不具备领取条件，请勿重复提交，谢谢!',
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

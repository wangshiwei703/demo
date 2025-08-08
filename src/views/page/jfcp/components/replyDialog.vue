<template>
  <div class="dialog-container">
    <!-- 对话内容区域 -->
    <div class="conversation-area">
      <!-- 循环展示所有对话消息 -->
      <div v-for="(message, index) in conversationMessages" :key="index" class="message-item"
        :class="{ 'user-message': message.isUser }">
        <!-- 系统消息的标签 -->
        <img class="system-img" src="@image/kefu.png" alt="headPortrait" v-if="!message.isUser" />
        <!-- 消息内容气泡 -->
        <div class="message-bubble">
          <span v-html="message.content"></span>
          <span style="color: red;font-weight: bold;" @click="handeltzb()"
            v-if="message.content == 'ダイエットプランがある場合、あなたの現在の体重はどのカテゴリに属しますか？'">(体重表を見る)</span>
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


    <!-- 右侧弹出 -->
    <van-popup v-model:show="showRight" :overlay="true">
      <img style="width: 100%;" src="@image/tzb.png" alt="avatar" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['addButton']);
// 存储所有对话消息
const conversationMessages = ref([
  { content: 'こんにちは～あなたの状況を簡単に知りたいと思っています。より適切なプランをおすすめしたいので～今、ダイエットの計画はありますか？', isUser: false },
]);

// 当前可选择的选项
const currentOptions = ref([
  '痩せたいと思っています。',
  'あるが、まだ躊躇している。',
  '今のところダイエットの考えはありません。',
  '自分はダイエットする必要がないと思う'
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
  if (selectedOption === '痩せたいと思っています。' || selectedOption === 'あるが、まだ躊躇している。') {
    // 愿意配合的后续问题
    conversationMessages.value.push({
      content: 'ダイエットプランがある場合、あなたの現在の体重はどのカテゴリに属しますか？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '超重 5-10 キログラム',
      '超重 10-20 キログラム',
      '超重 20 キログラム以上',
      '現在の体重は正常ですが、太らないように予防したいです。'
    ];
  } else if (selectedOption === '超重 5-10 キログラム' || selectedOption === '超重 10-20 キログラム' || selectedOption === '超重 20 キログラム以上' || selectedOption === '現在の体重は正常ですが、太らないように予防したいです。') {
    // 免费听课领养生书的后续问题
    conversationMessages.value.push({
      content: 'あなたは今年何歳ですか？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '18歳以下',
      '18-25',
      '26-40',
      '40歳以上'
    ];
  } else if (selectedOption === '18-25' || selectedOption === '26-40') {
    // 年龄的后续问题
    conversationMessages.value.push({
      content: 'では、ダイエット方法を試したことがありますか？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '試したことがないので、始めたいです。',
      'ダイエットや運動を試みたが、続けられなかった。',
      '他の製品を使ったが、効果は普通だった。',
      '現在、脂肪吸引などの医療手段を通じて減量しています。'
    ];
  } else if (selectedOption === '試したことがないので、始めたいです。' || selectedOption === 'ダイエットや運動を試みたが、続けられなかった。' || selectedOption === '他の製品を使ったが、効果は普通だった。' || selectedOption === '現在、脂肪吸引などの医療手段を通じて減量しています。') {
    // 年龄的后续问题
    conversationMessages.value.push({
      content: '最後にお尋ねしますが、商品を通じて何を最も改善したいですか？',
      isUser: false
    });
    // 更新下一轮选项
    currentOptions.value = [
      '迅速に痩せるために、例えば1ヶ月で5キロ以上減らすこと。',
      '健康的な減量、リバウンドしない',
      '局部（腰腹/大腿）の脂肪減少に向けて',
      '1日に3キロ以上痩せるための迅速なダイエット',
    ];
  } else if (selectedOption === '迅速に痩せるために、例えば1ヶ月で5キロ以上減らすこと。' || selectedOption === '健康的な減量、リバウンドしない' || selectedOption === '局部（腰腹/大腿）の脂肪減少に向けて' || selectedOption === '1日に3キロ以上痩せるための迅速なダイエット') {
    conversationMessages.value.push({
      content: 'はい、私は大体あなたのニーズを理解しました～私はあなたに合ったダイエットプランを整理しました。それには、あなたに適した製品の使い方や食事のアドバイスが含まれています。今すぐ<span style="color: red;font-weight: bold;">下のボタンをクリック</span>して、カスタマーサービスに挨拶をしてみてください。',
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
};



const showRight = ref(false)
// 体重表弹出窗
const handeltzb = () => {
  showRight.value = true
}
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

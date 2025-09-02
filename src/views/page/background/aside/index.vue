<template>
  <div class="el-menu-vertical">
    <div class="el-menu-vertical-title" :class="!isCollapse ? '':'titleCollapse'">
      {{ title }}
    </div>
    <div class="el-menu-vertical-menu" :style="!isCollapse ? 'height: calc(100% - 102px);' : 'height: calc(100% - 51px);'">
      <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse" router
        @select="handleSelect">
        <!-- 遍历导航列表，根据是否有子项渲染不同类型的菜单 -->
        <template v-for="(item, index) in navList" :key="index">
          <!-- 有子菜单的项 -->
          <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.router || `sub-${index}`"
            popper-class="submenu-popup">
            <template #title>
              <el-icon>
                <component :is="getIconComponent(item.icon)" />
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="(_item, _index) in item.children" :key="_index" :index="_item.router"
              class="submenu-item">
              <el-icon>
                <component :is="getIconComponent(item.icon)" />
              </el-icon>
              <template #title>
                <span>{{ _item.name }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 普通菜单项 -->
          <el-menu-item v-else :index="item.router" class="menu-item">
            <el-icon>
              <component :is="getIconComponent(item.icon)" />
            </el-icon>
            <template #title>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="el-menu-vertical-isCollapse" @click="() => { isCollapse = !isCollapse }">
      <el-icon v-if="isCollapse" class="el-menu-vertical-isCollapse-icon">
        <Expand />
      </el-icon>
      <el-icon v-else class="el-menu-vertical-isCollapse-icon">
        <Fold />
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  Document,
  Location,
  Setting,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

// 定义组件属性
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  navList: {
    type: Array,
    default: () => [],
    // 验证导航数据格式
    validator: (value) => {
      return value.every(item => {
        // 每个菜单项必须有name
        if (!item.name) return false

        // 如果有children，children也必须是符合格式的数组
        if (item.children) {
          return Array.isArray(item.children) &&
            item.children.every(child => child.name && child.router)
        }

        // 没有children的项必须有router
        return !!item.router
      })
    }
  }
})

// 获取当前路由
const route = useRoute()
const activeIndex = ref(route.path)

// 监听路由变化，更新激活状态
watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath
  }
)


const iconComponents = {
  Document,
  Location,
  Setting,
  // 可以添加更多图标
}

// 获取图标组件的方法
const getIconComponent = (iconName) => {
  // 如果传入的是组件直接返回，否则通过名称查找
  if (typeof iconName === 'object') {
    return iconName
  }
  return iconComponents[iconName] || Document // 默认图标
}

// 处理菜单选择事件
const handleSelect = (key, keyPath) => {
  console.log('选中的菜单:', key, '路径:', keyPath)
  // 可以在这里添加额外的菜单选择逻辑，如埋点统计等
}

const isCollapse = ref(false)
</script>

<style lang="less">
.el-menu-vertical {
  border-right: 1px solid #dcdfe6;
  height: 100%;
}

.el-menu-vertical-title {
  width: 200px;
  height: 50px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-weight: bold;
  color: #484a54;
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
  opacity: 1;
  visibility: visible; /* 控制元素是否可见（占据空间） */
  /* 保留所有视觉属性的过渡动画 */
  transition: 
    width 0.3s ease, 
    padding-left 0.3s ease, 
    opacity 0.3s ease,
    transform 0.3s ease,
    visibility 0.3s ease;
}

.el-menu-vertical-title.titleCollapse {
  width: 0; 
  height: 0;
  padding-left: 0; /* 移除内边距 */
  opacity: 0; /* 渐隐效果 */
  transform: scale(0.9); /* 缩放增强动画感 */
  visibility: hidden; /* 完全隐藏（不占据空间） */
  /* 延迟隐藏，确保动画完成 */
  transition-delay: 0s, 0s, 0s, 0s, 0.3s;
}



.el-menu-vertical-demo {
  border-right: 0px;
}

.el-menu-vertical-isCollapse {
  font-size: 20px;
  width: 100%;
  cursor: pointer;
  height: 50px;
  border-top: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-menu-vertical-isCollapse-icon:hover {
    background: #f2f2f2;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>

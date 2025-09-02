<template>
  <el-menu :default-active="activeIndex" class="main-nav" mode="horizontal" background-color="#545c64" text-color="#fff"
    active-text-color="#ffd04b" router @select="handleSelect" :collapse-transition="false">
    <!-- 遍历导航列表，根据是否有子项渲染不同类型的菜单 -->
    <template v-for="(item, index) in navList" :key="index">
      <!-- 有子菜单的项 -->
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.router || `sub-${index}`"
        popper-class="submenu-popup">

        <template #title>
          <el-icon>
            <component :is="getIconComponent(item.icon)" />
          </el-icon>
          <span class="menu-title">{{ item.name }}</span>
        </template>
        <el-menu-item v-for="(_item, _index) in item.children" :key="_index" :index="_item.router" class="submenu-item">

          <el-icon>
            <component :is="getIconComponent(_item.icon)" />
          </el-icon>
          <template #title>
            <span class="menu-title">{{ _item.name }}</span>
          </template>
        </el-menu-item>
      </el-sub-menu>

      <!-- 普通菜单项 -->
      <el-menu-item v-else :index="item.router" class="menu-item">
        <el-icon>
          <component :is="getIconComponent(item.icon)" />
        </el-icon>
        <template #title>
          <span class="menu-title">{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps({
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

// 处理菜单选择事件
const handleSelect = (key, keyPath) => {
  console.log('选中的菜单:', key, '路径:', keyPath)
  // 可以在这里添加额外的菜单选择逻辑，如埋点统计等
}
</script>

<style lang="css" scoped></style>

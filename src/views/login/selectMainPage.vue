<template>
    <cgs-modal class="cgs-portal-login-select-main-page-modal" :visible="vis" title="请选择登录的主页" @close="closeModal" :dialogStyle="{minWidth: '1000px'}">
        <template #content>
            <cgs-collapse expandIconPosition="right">
                <cgs-collapse-panel v-for="(item,index) in list" :key="index">
                    <template #header>
                        <span :class="item.icon" style="margin-right: 10px;"></span>
                        <span>{{item.label}}</span>
                    </template>
                    <div style="display: flex;flex-wrap: wrap;">
                        <div v-for="(option, index) in options" :key="option.pageName+index">
                            <cgs-button 
                                v-if="option.appType === item.key"
                                type="primary"
                                @click="$emit('selected', option)" style="margin:0 10px 10px 0">
                                {{ option.pageName }}
                            </cgs-button>
                        </div>
                    </div>
                </cgs-collapse-panel>
            </cgs-collapse>
        </template>
        <template #footer>
            <cgs-button @click="closeModal">
                关闭
            </cgs-button>
        </template>
    </cgs-modal>
</template>

<script>
    import {
        defineComponent,
        ref,
        watch,
    } from 'vue'
    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            options: {
                type: Array,
                default: () => []
            }
        },
        setup(props, ctx) {
            const vis = ref(false)
            const settingList = [
                {key: 'TwoD', label: '2D', icon: 'cgs-portal-iconfont cgs-portal-icon-a-2D'},
                {key: 'ThreeD', label: '3D', icon: 'cgs-portal-iconfont cgs-portal-icon-a-3D'},
                {key: 'Earth', label: 'Earth', icon: 'cgs-portal-iconfont cgs-portal-icon-Earth'},
                {key: 'Bim', label: 'BIM', icon: 'cgs-portal-iconfont cgs-portal-icon-BIM'},
                {key: 'Workflow', label: 'Workflow', icon: 'cgs-portal-iconfont cgs-portal-icon-workflow'},
                {key: 'Static', label: 'Page', icon: 'cgs-portal-iconfont cgs-portal-icon-Page'},
                {key: 'App', label: 'APP', icon: 'cgs-portal-iconfont cgs-portal-icon-APP'},
                {key: 'IoT', label: 'IoT', icon: 'cgs-portal-iconfont cgs-portal-icon-lot'},
                {key: 'GeoModel', label: 'GeoModel', icon: 'cgs-portal-iconfont cgs-portal-icon-GeoModel'},
                {key: 'Vtk', label: 'Volume', icon: 'cgs-portal-iconfont cgs-portal-icon-Volume'}
            ]
            const list = ref([])
            const emitCreated = () => {
                ctx.emit('created')
            }
            const closeModal = () => {
                ctx.emit('close')
            }
            watch(() => props.visible, (newVal) => {
                vis.value = newVal
            })
            watch(() => props.options, (newVal) => {
                if (newVal?.length > 0) {
                    let data = []
                    for (let i = 0; i < newVal.length; i++) {
                        data.push(newVal[i].appType)
                    }
                    data = data.filter((item,index) => data.indexOf(item) === index );

                    let arr = []
                    for (let i = 0; i < settingList.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if(settingList[i].key === data[j]){
                                arr.push(settingList[i])
                            }
                        }
                    }
                    list.value = arr
                }
            })
            return {
                vis,
                list,
                settingList,
                emitCreated,
                closeModal
            }
        }
    })
</script>

<style scoped>
</style>
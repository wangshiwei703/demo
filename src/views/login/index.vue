<template>
    <div class="portal-login">
        <div class="portal-login-container">
            <div class="portal-login-container-logo">
            </div>
            <!-- <div class="portal-login-container-title">
                <span class="portal-login-container-info1">{{title}}</span>
            </div> -->
            <div class="portal-login-container-main">
                <div class="portal-login-container-user-register">
                    <img src="@/assets/image/login/login-register.png">
                </div>
                <div class="portal-login-container-form">
                    <cgs-form ref="sceneForm" :model="formState" :hideRequiredMark="true" layout="horizontal"
                        class="portal-login-container-form-main">
                        <cgs-form-item name="userName" :rules="[{ required: true, message: '请输入账号' }]">
                            <template #label>
                                <span
                                    class="zw-portal-iconfont zw-portal-icon-zhanghao portal-login-container-form-icon"></span>
                                <span>用户名</span>
                            </template>
                            <cgs-input class="portal-login-container-form-input" v-model:value="formState.userName"
                                @press-enter="handleLogin" :placeholder="'请输入账号'" />
                        </cgs-form-item>

                        <cgs-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
                            <template #label>
                                <span
                                    class="zw-portal-iconfont zw-portal-icon-mima portal-login-container-form-icon"></span>
                                <span>密码</span>
                            </template>
                            <cgs-input class="portal-login-container-form-input" type="password"
                                v-model:value="formState.password" @press-enter="handleLogin" :placeholder="'请输入密码'" />
                        </cgs-form-item>
                    </cgs-form>
                </div>
                <div class="portal-login-container-button">
                    <!-- <cgs-button type="primary" :loading="buttonLoading" @click="handleLogin">{{buttonLoadText}}</cgs-button> -->
                    <img src="@/assets/image/login/login-register2.png" @click="handleLogin">
                </div>
                <div class="portal-login-container-bottom">
                    <!-- <span v-if="releaseType.toLowerCase() === 'public'" @click="toRegister">注册新账号</span> -->
                    <!-- <span @click="toFindPassword">忘记密码？</span> -->
                </div>
            </div>
        </div>
        <!-- <a class="portal-login-registration-info" href="http://beian.miit.gov.cn" target="_blank">{{registration}}</a> -->
        <select-main-page :visible="mainPage.visible" :options="mainPage.options" @close="closeSelectMainPageModal"
            @selected="selectedMainPage">
        </select-main-page>
    </div>
</template>
<script>
import {
    defineComponent,
    ref,
    reactive,
    computed,
    onMounted,
    getCurrentInstance
} from 'vue';
import {
    useRouter
} from 'vue-router'
import {
    watchSystemInfo,
    watchSystemVersion
} from '@/utils/author.js'
import {
    getTenantInfo
} from '@/api/tenant'
import {
    loginByUsername,
    getUserInfo,
} from "@/api/user";
import {
    setToken,
    // setHeadPic,
    setUserInfo,
    setUserAuthority,
    setTenantInfo,
    setEntry
} from "@/utils/author.js";
import selectMainPage from './selectMainPage.vue';

export default defineComponent({
    name: "login",
    components: {
        selectMainPage
    },
    setup () {
        let {
            proxy
        } = getCurrentInstance();
        let router = useRouter()
        const formState = reactive({
            userName: '',
            password: '',
        })
        const sceneForm = ref(null)
        const buttonLoading = ref(false)
        const buttonLoadText = ref('登录')
        const mainPage = reactive({
            visible: false,
            options: []
        })
        const state = reactive({
            sysInfo: {},
            sysVersion: {}
        })
        let userInfo = {}
        let userAuthority = {}
        const toRegister = () => {
            router.push({
                path: '/register'
            })
        }
        const toFindPassword = () => {
            router.push({
                path: '/findPassword'
            })
        }
        const closeSelectMainPageModal = () => {
            // this.$ws.reconnect()
            buttonLoading.value = false;
            buttonLoadText.value = '登录';
            mainPage.visible = false
            mainPage.options = []
        }
        const selectedMainPage = (_mainPage) => {
            setUserInfo(userInfo);
            setUserAuthority(userAuthority);
            getTenantInfo({
                tenantId: userAuthority.tenantId
            }).then((tenantInfo) => {
                if (tenantInfo && tenantInfo.success) {
                    setTenantInfo(tenantInfo.data)
                    setEntry({
                        type: 'zw-portal'
                    })
                    window.history.replaceState(null, "", _mainPage.pageUrl);
                    window.history.go(0);

                }
            })
            // this.$ws.reconnect()
            buttonLoading.value = false;
            buttonLoadText.value = "登录";
        }
        const handleLogin = async () => {
            try {
                await sceneForm.value.validateFields()
                buttonLoading.value = true;
                buttonLoadText.value = `登录中...`;
                let _loginResult = await loginByUsername({
                    Username: formState.userName,
                    Password: formState.password
                })
                if (_loginResult.Code !== 200) {
                    proxy.$message.error(_loginResult.Msg)
                    buttonLoading.value = false;
                    buttonLoadText.value = '登录';
                } else {
                    await setToken(_loginResult.Data["Token"]);
                    // setHeadPic(data.Data['avatar']);
                    let _userInfoResult = await getUserInfo()
                    if (_userInfoResult && _userInfoResult.success) {
                        userInfo = _loginResult.Data
                        userAuthority = _userInfoResult.data
                        let _roleName = userAuthority.roleName
                        let _pageAuths = userAuthority.pageAuths
                        if (['Administrator', 'AppAdministrator'].includes(
                            _roleName) ||
                            _pageAuths.length === 0) {
                            await setUserInfo(userInfo);
                            await setUserAuthority(userAuthority);
                            let tenantInfo = await getTenantInfo({
                                tenantId: userAuthority.tenantId
                            })
                            if (tenantInfo && tenantInfo.success) {
                                await setTenantInfo(tenantInfo.data)
                                await setEntry({
                                    type: 'zw-portal'
                                })
                                router.push({
                                    path: "/"
                                });
                                // window.themeManager.replaceTheme()
                                // window.authManager.init()

                            }
                            // this.$ws.reconnect()
                            buttonLoading.value = false;
                            buttonLoadText.value = '登录';
                        } else if (!['Administrator', 'AppAdministrator']
                            .includes(
                                _roleName) && _pageAuths.length ===
                            1) {
                            selectedMainPage(_pageAuths[0])
                        } else {
                            mainPage.options = _pageAuths
                            mainPage.visible = true
                        }
                    }
                }
            } catch (err) {
                buttonLoading.value = false;
                buttonLoadText.value = '登录';
                console.error(err)
            }
        }
        onMounted(() => {
            watchSystemInfo((newVal) => {
                state.sysInfo = newVal
            })
            watchSystemVersion((newVal) => {
                state.sysVersion = newVal
            })
        })
        const releaseType = computed(() => {
            let _type = ''
            if (state.sysVersion && state.sysVersion.releaseType) {
                _type = state.sysVersion.releaseType
            }
            return _type
        })
        // const title = computed(() => {
        //     let _title = ''
        //     if (state.sysInfo && state.sysInfo.name) {
        //         _title = state.sysInfo.name.toUpperCase()
        //     }
        //     return _title
        // })
        const registration = computed(() => {
            let _registration = ''
            if (state.sysInfo && state.sysInfo.domainRegistrationInfo) {
                _registration = state.sysInfo.domainRegistrationInfo
            }
            return _registration
        })
        // const bgImg = computed(() => {
        //     let _img = ''
        //     if (state.sysInfo && state.sysInfo.bgImg) {
        //         _img = state.sysInfo.bgImg
        //     }
        //     return _img
        // })
        // const logo = computed(() => {
        //     let _logo = ''
        //     if (state.sysInfo && state.sysInfo.logo) {
        //         _logo = state.sysInfo.logo
        //     }
        //     return _logo
        // })
        return {
            formState,
            buttonLoading,
            buttonLoadText,
            mainPage,
            state,
            releaseType,
            // title,
            registration,
            // bgImg,
            // logo,
            sceneForm,


            closeSelectMainPageModal,
            selectedMainPage,
            handleLogin,
            toRegister,
            toFindPassword
        }
    }
});
</script>

<style lang="less" scoped>
// @import "~@style/less/theme.less";

/* .vue-auth-box_{
    top: 50%;
  } */
.portal-login {
    z-index: 1;
    position: relative;
    width: 100%;
    height: 100%;
    // background-color: #FFF;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('@/assets/image/login/login-bgi.png') no-repeat;
    background-size: 100% 100%;
}

.portal-login-container {
    z-index: 100;
    padding: 40px 30px;
    background: url('@/assets/image/login/login-container-bgi.png') no-repeat;
    background-size: 100% 100%;
    text-align: center;
    width: 845px;
    height: 845px;
}

.portal-login-container-logo {
    width: 100%;
    text-align: center;
    margin-top: 20px;
}

.portal-login-container-logo img {
    width: 484px;
}

.portal-login-container-title {
    align-items: center;
    margin-top: 10px;
    margin-bottom: 30px;
}

.portal-login-container-info1 {
    // .big-title
}

.portal-login-container-main {
    height: calc(100% - 245px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.portal-login-container-user-register {
    width: 300px;
    margin-bottom: 40px;
}

.portal-login-container-user-register img {
    width: 100%;
}

.portal-login-container-form {
    text-align: left;
    width: 300px;
}

.portal-login-container-button {
    margin-top: 14px;
    margin-bottom: 10px;
    width: 300px;
}

.portal-login-container-button img {
    width: 100%;
    cursor: pointer;
}

// .portal-login-container-button button {
//     width: 100%;
//     height: 42px;
// }

.portal-login-container-bottom {
    width: 260px;
    height: 20px;
    display: flex;
    margin-top: 5px;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    // color: @font-color-3;
    z-index: 1;
}

.portal-login-container-bottom span {
    color: #1979E1;
    cursor: pointer;
}

// .portal-login-container-bottom span:hover {
//     color: #23C5D0;
// }


.portal-login-registration-info {
    color: #333;
    text-align: center;
    position: absolute;
    width: 100%;
    background-color: #FFF;
    bottom: 0;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
}

.portal-login-registration-info:hover {
    color: #222;
    text-decoration: underline
}

.portal-login-container-form-icon {
    margin-right: 5px;
}
</style>

<style scoped>
.portal-login-container-form-input.cgs-design-input.ant-input {
    line-height: 32px;
    border-radius: 5px;
}
</style>

<style>
.portal-login-container-form-main.cgs-design-form .ant-form-item-label>label {
    line-height: 32px;
    height: 41px;
    color: #1979E1;
    width: 78px;
}

.portal-login-container-form-main .ant-form-item label:after {
    content: none;
}

.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input {
    background-color: transparent !important;
}

.portal-login-container-form-input.cgs-design-input.ant-input {
    background-color: transparent;
    border: 2px solid rgba(140, 186, 255, 0.4);
}

.portal-login-container-form-input.ant-input-focused,
.portal-login-container-form-input.cgs-design-input.ant-input:focus,
.portal-login-container-form-input.cgs-design-input.ant-input:hover {
    border: 2px solid #1979E1;
}

.portal-login-container-form-input.cgs-design-input.ant-input,
.portal-login-container-form-input.cgs-design-input.ant-input-affix-wrapper>input.ant-input {
    color: #FFFFFF;
}
</style>
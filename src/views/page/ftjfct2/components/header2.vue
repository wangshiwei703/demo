<template>
    <div class="homg-header1">
        <img src="@image/ft/2.jpg" />
        <img src="@image/ft/4.jpg" />
        <img src="@image/ft/5.jpg" />
        <img src="@image/ft/6.jpg" />
        <img src="@image/ft/7.jpg" />
        <img src="@image/ft/8.jpg" />
        <img src="@image/ft/9.jpg" />
        <img src="@image/ft/10.jpg" />
        <img src="@image/ft/11.jpg" />
    </div>
</template>



<style lang="less">
.homg-header1 {
    width: 100%;
    video,
    img {
        width: 100%;
        display: block;
        /* 解决inline-block带来的换行间隙 */
        margin: 0;
        /* 清除默认外边距 */
        padding: 0;
        /* 清除默认内边距 */
        border: none;
        /* 某些浏览器会给图片加默认边框 */
    }
}
</style>

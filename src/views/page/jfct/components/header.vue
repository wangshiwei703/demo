<template>
    <div class="homg-header1">
        <img src="@image/bdheader/1.png" />
        <video class="mp4-as-gif" autoplay loop muted playsinline preload="auto">
            <source src="@image/bdheader/2.mp4" type="video/mp4">
        </video>
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

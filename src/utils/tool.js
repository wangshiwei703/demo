import {
    getLanguage
} from '@/utils/author'

export const changeFavicon = link => {
    let $favicon = document.querySelector('link[rel="icon"]');
    if ($favicon !== null) {
        $favicon.href = link;
    } else {
        $favicon = document.createElement("link");
        $favicon.rel = "icon";
        $favicon.href = link;
        document.head.appendChild($favicon);
    }
};

export const hasLanguage = () => {
    let _lang = getLanguage()
    return !!_lang
}

export const getCurrentLanguage = () => {
    let _lang = getLanguage()
    if (!_lang) {
        _lang = import.meta.env.VUE_APP_LANG
    }
    return _lang
}
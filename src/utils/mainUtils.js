//main.js 入口函数引入的相关工具类库

import Vue from 'vue'

//时间转换工具
import toDateUtil from 'ty-pc/lib/utils/date';
Vue.prototype.toDateUtil = toDateUtil;

//引入加密，全局定义
import md5 from "js-md5";
Vue.prototype.$md5 = md5;

//公共方法引入--------------------------------------
import {
    getDicts
} from "@/api/system/dict/data";
import {
    parseTime,
    resetForm,
    addDateRange,
    selectDictLabel,
    download,
    handleTree
} from "@/utils/tool.js";
import { previewFile } from 'ty-pc/lib/utils/common'

Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.previewFile = url => previewFile('http://124.227.1.175:8012/onlinePreview', url)
Vue.prototype.msgSuccess = function (msg) {
    this.$message({
        showClose: true,
        message: msg,
        type: "success"
    });
}
Vue.prototype.msgError = function (msg) {
    this.$message({
        showClose: true,
        message: msg,
        type: "error"
    });
}
Vue.prototype.msgInfo = function (msg) {
    this.$message.info(msg);
}

// 清除考试缓存
Vue.prototype.clearExamInfo = function () {
    sessionStorage.removeItem("remainTime");
    sessionStorage.removeItem("examData");
    sessionStorage.removeItem("examStartTime");
    sessionStorage.removeItem("curQuestion");
}


/**
 * 检测图片是否存在
 * @param url
 */
let imageIsExist = function (url) {
    return new Promise((resolve) => {
        var img = new Image();
        img.onload = function () {
            if (this.complete == true) {
                resolve(true);
                img = null;
            }
        }
        img.onerror = function () {
            resolve(false);
            img = null;
        }
        img.src = url;
    })
}

//全局注册自定义指令，用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('temp-img', async function (el, binding) { //指令名称为：temp-img
    let imgURL = binding.value; //获取图片地址
    if (imgURL) {
        let exist = await imageIsExist(imgURL);
        if (exist) {
            el.setAttribute('src', imgURL);
        }
    }
})

// 引入delPopover
import delPopover from '@/components/delPopover/delPopover'
Vue.use(delPopover)
Vue.component('delPopover', delPopover)



//引入公共组件---------------
  //引入样式
  import 'ty-pc/lib/index/style.css';
  //按需引入
  import {
    TyCheckbox,
    TyIcon,
    TyTable,
    TyDictionary,
    TyDialog,
    TyCascader,
    TyTable1,
    TyBusinessCrud1,
    TyUpload,
    TyUploadFile,
    TyUploadFile1,
    PcForm,
    TyEditTable,
    TyRadio,
    TyExport,
    TyMultiText,
    TyDateTime,
    TyDropdown,
    TyRadio2,
  }
  from 'ty-pc';
  [TyCheckbox,
    TyIcon,
    TyTable,
    TyDictionary,
    TyDialog,
    TyCascader,
    TyTable1,
    TyBusinessCrud1,
    TyUpload,
    TyUploadFile,
    TyUploadFile1,
    PcForm,
    TyEditTable,
    TyRadio,
    TyExport,
    TyMultiText,
    TyDateTime,
    TyDropdown,
    TyRadio2,
  ].forEach((v) => {
    Vue.use(v)
  })

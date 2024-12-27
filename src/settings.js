module.exports = {
    title:"轴管通",

    /**
     * @type {boolean} true | false
     * @description Whether show the settings right-panel
     */
    showSettings: true,

    /**
     * @type {boolean} true | false
     * @description Whether need tagsView
     */
    tagsView: true,

    /**
     * @type {boolean} true | false
     * @description Whether fix the header
     */
    fixedHeader: false,

    /**
     * @type {boolean} true | false
     * @description Whether show the logo in sidebar
     */
    sidebarLogo: true,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    sysConfig: {
        sysVersion: "V4.0.0",
        copyright: "Copyright @ 2012 宁波圣泽网络科技有限公司版权所有",
        navigationIcon: "",
        logoIcon: "",
        loginIcon: "",
        sysName:"轴管通" 
    },
    systemVO:{
        shortName: "轴管通",
        iconUrl:''
    },
    themeClass: "blue",
    headClass: "blue",
    layoutType: "classic",
    slideClass: "dark",
    tagsIcon: false,
    showLanguage: true,
    showSearch: true,
    useCache: true,
    errorLog: "production",
    /**
     * 五个小方块样式
     */
    parentBgc: "#F0EDD9",
    rightWidth: "72px",
    styleArr: ["#33a3dc", "#67c23a", "yellow", "#ef4136", "#a1a3a6", "#ccc399"],
    marginRight: "14px",
    radius: "4px"
};



// function getSysName(){
//     if( !GetQueryString("sys") || !localstorage.getItem("sys") || location.host == 'localhost:3000' ){
//         return "轴管通"
//     }else{
//         return "机联网"
//     }
// }
// function GetQueryString(name){
//      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//      var r = window.location.search.substr(1).match(reg);
//      if(r!=null)return  unescape(r[2]); return null;
// }
　　

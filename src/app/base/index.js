ctrl.$onEnter = function (param, rs, rj) {
    // 隐藏公共菜单
    avalon.vmodels.global.menu.show = false

    // 获取基础数 据
    wk.get({
        url: '/api/apps/' + param.path,
        done: function (data) {
            vm.app = data
            rs()
        }
    })

    return false
}

ctrl.$onRendered = function () {

}

ctrl.$onBeforeUnload = function () {
    // 显示公共菜单
    avalon.vmodels.global.menu.show = true
}

// router.js
// 状态路由

require(['mmState'], function () {

	function state(opts) {
		opts = $.extend({
			controller: 'global', // 默认父级控制器为全局控制器
			url: '/', // 访问url地址
			module: 'common/home', // 模块名
			ignoreChange: true,
			abstract: false,
			child: null,
			parentModule: '', // 父级模块名
		}, opts)

		// 模块名过滤特殊字符
		opts.stateName = opts.module.replace(/\//g, '').replace(/\./g, '')
		opts.parentStateName = opts.parentModule.replace(/\//g, '').replace(/\./g, '')

		// 设置模块全名
		if (opts.parentStateName !== '') {
			opts.stateName = opts.parentStateName + '.' + opts.stateName
		}

		// 当父级模块名不为空时，控制器为父级模块名
		var controller = opts.parentModule || opts.controller

		// 设置路由属性
		avalon.state(opts.stateName, {
			controller: controller,
			url: opts.url,
			abstract: opts.abstract,
			views: {
				'container': {
					templateUrl: '/static/' + opts.module + '/index.html',
					controllerUrl: [opts.module + '/index'],
					ignoreChange: function (changeType) {
						if (!opts.ignoreChange) {
							return false
						}
						if (changeType) return true
					}
				}
			}
		})

		/*
		console.group(opts)
		console.log("stateName", opts.stateName)
		console.log("controller", controller)
		console.log("url", opts.url)
		console.log("abstract", opts.abstract)
		console.log("templateUrl", 'static/' + opts.module + '/index.html')
		console.log('controllerUrl', opts.module + '/index')
		console.log('ignoreChange', opts.ignoreChange)
		console.groupEnd()
		*/

		// 设置子属性
		if (opts.child !== null) {
			opts.child.parentModule = opts.module
			state(opts.child)
		}
	}

	// 找不到的页面跳转到404
	avalon.router.error(function () {
		avalon.router.navigate('/404')
	})

	// 模版无法加载跳转404
	avalon.state.config({
		onloadError: function () {
			avalon.router.navigate("/404")
		},
		onBeforeUnload: function () {
			// 清除window对象上所有绑定
			$(window).unbind()
		}
	})

	// 404
	state({
		module: 'common/404',
		url: '/404'
	})

	// 首页
	state({
		module: 'common/home',
		url: '/'
	})

	// 登陆
	state({
		module: 'auth/login',
		url: '/auth/login'
	})

	// 注册
	state({
		module: 'auth/register',
		url: '/auth/register'
	})

	// 应用 /////////////////

	// 应用专区（应用列表）
	state({
		module: 'app/index',
		url: '/app'
	})

	// 基础
	state({
		module: 'app/base',
		abstract: true,
		url: '/a',
		child: {
			module: 'app/home',
			url: '/a'
		}
	})



	// 应用首页

	//第三方平台登陆
	/*
	avalon.state("loginOauth", {
		controller: "global",
		url: "/login/oauth",
		views: {
			"container": {
				templateUrl: '/static/check/loginOauth.html',
				controllerUrl: ['check/loginOauth'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 自动验证
	avalon.state("auth", {
		controller: "global",
		url: "/auth",
		views: {
			"container": {
				templateUrl: '/static/check/auth.html',
				controllerUrl: ['check/auth'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 创建网站
	avalon.state("create", {
		controller: "global",
		url: "/create",
		views: {
			"container": {
				templateUrl: '/static/create/create.html',
				controllerUrl: ['create/create'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 总应用列表
	avalon.state("appList", {
		controller: "global",
		url: "/app",
		views: {
			"container": {
				templateUrl: '/static/app/app.html',
				controllerUrl: ['app/app'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 各分类应用列表
	avalon.state("appListType", {
		controller: "global",
		url: "/app/{type}",
		views: {
			"container": {
				templateUrl: '/static/app/app.html',
				controllerUrl: ['app/app'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 板块
	avalon.state("app", {
		controller: "global",
		url: "/a/{app}",
		views: {
			"container": {
				templateUrl: '/static/app/base.html',
				controllerUrl: ['app/base'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		},
		abstract: true
	})

	//板块.首页
	avalon.state("app.home", {
		controller: "appBase",
		url: "",
		views: {
			"appContainer": {
				templateUrl: '/static/app/home.html',
				controllerUrl: ['app/home'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 管理
	avalon.state("app.admin", {
		controller: "appBase",
		url: "/admin",
		views: {
			"appContainer": {
				templateUrl: '/static/app/admin.html',
				controllerUrl: ['app/admin'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		},
		abstract: true
	})

	// 管理 首页
	avalon.state("app.admin.home", {
		controller: "appAdmin",
		url: "",
		views: {
			"appAdminContainer": {
				templateUrl: '/static/app/adminHome.html',
				controllerUrl: ['app/adminHome'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 管理 具体项目
	avalon.state("app.admin.info", {
		controller: "appAdmin",
		url: "/{info}",
		views: {
			"appAdminContainer": {
				templateUrl: function (param) {
					return '/static/app/admin/' + param.info + '.html';
				},
				controllerUrl: function (param) {
					return ['app/admin/' + param.info];
				},
				cacheController: false
			}
		}
	})

	// 板块.标签
	avalon.state("app.tag", {
		controller: "appBase",
		url: "/tag",
		views: {
			"appContainer": {
				templateUrl: '/static/app/list.html',
				controllerUrl: ['app/list'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	//板块.分类列表
	avalon.state("app.list", {
		controller: "appBase",
		url: "/{category:[a-z]{1,10}}",
		views: {
			"appContainer": {
				templateUrl: '/static/app/list.html',
				controllerUrl: ['app/list'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	//板块.分类列表
	avalon.state("app.list", {
		controller: "appBase",
		url: "/{category:[a-z]{1,10}}/doc",
		views: {
			"appContainer": {
				templateUrl: '/static/app/listDoc.html',
				controllerUrl: ['app/listDoc'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	//板块.文章信息
	avalon.state("app.page", {
		controller: "appBase",
		url: "/{id:[0-9a-z]{24}}",
		views: {
			"appContainer": {
				templateUrl: '/static/app/page.html',
				controllerUrl: ['app/page'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	//板块.文档.文章信息
	avalon.state("app.list.doc", {
		controller: "appListDoc",
		url: "/{id:[0-9a-z]{24}}",
		views: {
			"appListDocContainer": {
				templateUrl: '/static/app/pageDoc.html',
				controllerUrl: ['app/page'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 账号后台
	avalon.state("user", {
		controller: "global",
		url: "/user",
		views: {
			"container": {
				templateUrl: '/static/user/base.html',
				controllerUrl: ['user/base'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		},
		abstract: true
	})

	// 账号后台 - 分类 - 页面
	avalon.state("user.page", {
		controller: "userBase",
		url: "/{category}/{page}",
		views: {
			"userContainer": {
				templateUrl: function (params) {
					console.log('templateUrl')
					return '/static/user/' + params.category + '/' + params.page + '.html';
				},
				controllerUrl: function (params) {
					//设置当前分类和页面
					avalon.vmodels.userBase.category = params.category;
					avalon.vmodels.userBase.page = params.page;

					//改变当前标题
					for (var key in avalon.vmodels.userBase.lists.$model) {
						if (avalon.vmodels.userBase.lists[key].url == params.category) {
							for (var _key in avalon.vmodels.userBase.lists[key].childs.$model) {
								if (avalon.vmodels.userBase.lists[key].childs[_key].url == params.page) {
									avalon.vmodels.userBase.title = '<i class="f-mr5 fa ' + avalon.vmodels.userBase.lists[key].childs[_key].icon + '"></i>' + avalon.vmodels.userBase.lists[key].childs[_key].name;
									document.title = '我的账号 - ' + avalon.vmodels.userBase.lists[key].childs[_key].name + ' - 我酷游戏';
								}
							}
						}
					}

					return ['user/' + params.category + '/' + params.page];
				},
				cacheController: false
			}
		}
	})

	// 更新/新增第三方平台
	avalon.state("oauth", {
		controller: "global",
		url: "/oauth",
		views: {
			"container": {
				templateUrl: '/static/check/oauth.html',
				controllerUrl: ['check/oauth'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 第三方平台二跳地址
	avalon.router.get("/oauth/jump", function () {
		location.href = "https://openapi.baidu.com/social/oauth/2.0/receiver" + location.search;
	})

	// 舆情分析
	avalon.state("yuqing", {
		controller: "global",
		url: "/yuqing",
		views: {
			"container": {
				templateUrl: '/static/yuqing/yuqing.html',
				controllerUrl: ['yuqing/yuqing'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})

	// 舆情分析详细列表
	avalon.state("yuqingList", {
		controller: "global",
		url: "/yuqing/{category}",
		views: {
			"container": {
				templateUrl: '/static/yuqing/list.html',
				controllerUrl: ['yuqing/list'],
				ignoreChange: function (changeType) {
					if (changeType) return true;
				}
			}
		}
	})
*/
	// 启动路由
	avalon.history.start({
		basepath: "/",
		html5Mode: true,
		routeElementJudger: function (element) {
			return typeof $(element).attr('router') !== 'undefined'
		}
	})

	// 扫描
	avalon.scan()
});
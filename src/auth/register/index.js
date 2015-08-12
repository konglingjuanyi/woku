ctrl.$onEnter = function (param, rs, rj) {
	document.title = '注册'
	avalon.vmodels.global.menuName = 'register'

	// 如果已登陆，返回首页
	$.when(global.$myDeferred).done(function () { // 此时获取用户信息完毕
		if (global.myLogin) {
			avalon.router.navigate('/')
			return
		}
	})

	// 如果包含签名标签，则请求激活用户
	/*
	if (mmState.query.sign) {
		wk.post({
			url: '/api/users/authentication/email',
			data: mmState.query,
			success: function (data) {
				console.log(data)
			}
		})
	}
	*/
}

ctrl.$onRendered = function () {
	var infoForm = $("#j-form-info")
	infoForm.form({
		fields: {
			nickname: {
				identifier: 'nickname',
				rules: [{
					type: 'empty',
					prompt: '<i class="user icon"></i>用户名：请填写'
				}, {
					type: 'minLength[2]',
					prompt: '<i class="user icon"></i>用户名：至少2位'
				}, {
					type: 'maxLength[10]',
					prompt: '<i class="user icon"></i>用户名：最多10位'
				}]
			},
			password: {
				identifier: 'password',
				rules: [{
					type: 'empty',
					prompt: '<i class="lock icon"></i>密码：请填写'
				}, {
					type: 'minLength[6]',
					prompt: '<i class="lock icon"></i>密码：至少6位'
				}, {
					type: 'maxLength[30]',
					prompt: '<i class="lock icon"></i>密码：最多30位'
				}]
			}
		},
		onSuccess: function () {
			// 刷新验证码
			vm.freshCap()

			vm.steps.email.locked = false
			vm.step = 'email'
		}
	})

	var emailForm = $("#j-form-email")
	emailForm.form({
		fields: {
			email: {
				identifier: 'email',
				rules: [{
					type: 'email',
					prompt: '<i class="user icon"></i>邮箱：请输入正确格式'
				}]
			},
			captcha: {
				identifier: 'captcha',
				rules: [{
					type: 'length[6]',
					prompt: '<i class="lock icon"></i>验证码：长度6位'
				}]
			}
		},
		onSuccess: function () {
			wk.post({
				url: '/api/users/authentication',
				data: {
					email: vm.data.email,
					nickname: vm.data.nickname,
					password: vm.data.password,
					capid: vm.data.capid,
					captcha: vm.data.captcha
				},
				success: function (data) {
					//刷新验证码
					vm.freshCap()

					//进入下一步
					vm.steps.success.locked = false
					vm.step = 'success'
				},
				error: function (message) {
					wk.notice({
						title: '注册失败',
						content: message
					})

					//刷新验证码
					vm.freshCap()
				}
			})
		}
	})
}
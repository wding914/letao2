$(function () {
    //使用表单校验插件
    $("#form").bootstrapValidator({

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            username: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 4,
                        max: 30,
                        message: '用户名长度必须在4到30之间'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名由数字字母下划线和.组成'
                    },
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            password: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 8,
                        message: '密码长度必须在6到8之间'
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码由数字字母下划线和.组成'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            },
        }

    });

    //表单校验成功,点击登录按钮,会自动提交表单
    //因为要验证用户名和密码,所以要发送ajax请求(先阻止表单提交)
    //    当表单校验成功时，会触发success.form.bv事件，此时会提交表单，
    //    这时候，通常我们需要禁止表单的自动提交，使用ajax进行表单的提交。
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            url: "/employee/employeeLogin",
            type: "post",
            data: $("#form").serialize(),
            // beforeSend:function(){
            //     NProgress.start();
            // },
            success: function (res) {
                // NProgress.done();
                //  console.log(res);
                //用户名或密码验证失败,提示信息
                //使用表单验证的方法:updateStatus
                if (res.error == 1000) {
                    $("#form").data('bootstrapValidator').updateStatus("username", "INVALID", 'callback');
                }
                if (res.error == 1001) {
                    $("#form").data('bootstrapValidator').updateStatus("password", "INVALID", 'callback');
                }
                if (res.success) {
                    location.href = "index.html";
                }
            }
        })
    });

    //表单重置:
    //reset按钮只可以清除表单数据,不会清除表单的提示信息
    //表单插件的方法:resetForm(true)
    //参数true:删除表单数据
    $("[type=reset]").on("click", function () {
        $("#form").data('bootstrapValidator').resetForm();

    })

    //进度条:
    //引入插件NProgress
    //1.引入文件
    //2.js代码

    //引入ajax全局事件
    //ajaxStart在开始一个ajax请求时触发
    // ajaxStop在ajax请求结束时触发
    $(document).ajaxStart(function () {
        NProgress.start();
    })
    $(document).ajaxStop(function () {
        setTimeout(function () {
            NProgress.done();
        }, 1000)
    })

})



$(function () {
    //1.ajax(查询商品)
    render(1);
    function render(page) {
        var pageSize = 5;
        $.ajax({
            url: '/product/queryProductDetailList',
            type: 'get',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (info) {
                // console.log(info);
                $('tbody').html(template('pro-tmp', info));

                //2.引入分页插件
                paginator(info, render);
            }
        })
    }


    //3.点击添加商品,弹出模态框
    //4.发送ajax,渲染数据
    $(".btnAddPro").on("click", function () {
        $('.proModal').modal('show');
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'get',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (info) {
                // console.log(info);
                $(".dropdown-menu").html(template("second-tmp", info));

            }
        })

    })

    //5.点击下拉菜单的子选项,修改下拉菜单的文本(注册事件委托)
    $(".dropdown-menu").on("click", 'a', function () {
        $('.dropdownText').text($(this).text());
        var id = $(this).data("id");
        $("[name=brandId]").val(id);
        $("#form").data("bootstrapValidator").updateStatus('brandId', 'VALID');
        //VALID将状态修改为校验成功的状态,不需要回调函数
    })


    //6.点击上传图片,给imgBox添加图片
    //上传图片用插件:fileupload
    //1.引入文件 jq+2js
    //2.属性  name data-url multiple
    //3.fileupload的方法   $("#file").fileupload({done:function(){}})
    //给imgBox添加图片(拼接字符串)
    var picArr = [];
    $('#file').fileupload({
        done: function (e, data) {
            $("#imgBox>div").prepend("<img src=" + data.result.picAddr + ">    ");
            //只能上传3张图片     
            $("#imgBox>div>img").eq(3).remove();
            //把上传图片存储在数组中,当图片数量大于3时,删除最后一个
            picArr.unshift(data.result);
            if (picArr.length > 3) {
                picArr.pop();
            }
            //上传图片的表单验证(隐藏域)
            if (picArr.length === 3) {
                $('#form').data("bootstrapValidator").updateStatus('picStatus', 'VALID');
            } else {
                $('#form').data("bootstrapValidator").updateStatus('picStatus', 'INVALID');
            }
        }
    })





    // $("[name=picArr]").val()

    //7.表单验证
    $("#form").bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            proName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            oldPrice: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品价格'
                    }
                }
            },
            proDesc: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入产品描述'
                    }
                }
            },
            size: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            num: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    regexp: {
                        regexp: /^[1-9]\d{0,4}$/,
                        message: '商品库存格式, 必须是非零开头的数字'

                    }
                }
            },
            brandId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            picStatus: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请上传3张图片'
                    }
                }
            }


        }

    });


    //7.1给隐藏域,进行表单验证
    //js给隐藏域赋值(添加商品,发送ajax时,可进行表单验证)
    //动态修改状态时,js赋值不能进行表单验证,需要手动修改状态(updateStatus())


    //8.表单验证成功,阻止表单提交,发送ajax请求,重置表单
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        var params = $('#form').serialize() + "&picArr=" + JSON.stringify(picArr);
        $.ajax({
            url: '/product/addProduct',
            type: 'post',
            data: params,
            success: function (info) {
                console.log(info);
                //1.关闭模态框
                $(".proModal").modal("hide");
                //2.重置表单
                $("#form").data('bootstrapValidator').resetForm(true);
                //3.渲染数据
                render(1);
                //4.恢复下拉菜单和imgBox
                $(".dropdownText").text("请选择二级分类");
                picArr = [];
                console.log(picArr);
                
                $("#imgBox>div>img").remove();
            }
        })
    });






})
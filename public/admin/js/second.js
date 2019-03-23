$(function () {
    //1.ajax(查询二级分类)
    render(1);
    function render(page) {
        var pageSize = 5;
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'get',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (info) {
                // console.log(info);
                $("tbody").html(template("second-tmp", info));
                //2.分页插件
                paginator(info, render);
            }
        })

    }


    //3.点击添加分类,弹出模态框,表单验证
    $('.btn-second-add').on('click', function () {
        $('.secondModal').modal('show');

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
                brandName: {
                    validators: {
                        //不能为空
                        notEmpty: {
                            message: '请输入二级分类名称'
                        }
                    }
                },
                categoryId: {
                    validators: {
                        //不能为空
                        notEmpty: {
                            message: '请选择一级分类'
                        }
                    }
                },
                brandLogo: {
                    validators: {
                        //不能为空
                        notEmpty: {
                            message: '请上传图片'
                        }
                    }
                }

            }

        });




    })


    //4.点击下拉菜单,发送ajax请求(查询一级分类),渲染在页面上(模板引擎)
    $(".dropdown-toggle").on("click", function () {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            type: 'get',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (info) {
                console.log(info);
                $('.dropdown-menu').html(template('dropdown-tmp', info));

            }
        })
    })


    //5.点击下拉菜单的某个选项,将下拉菜单的内容修改,并进行表单验证
    //下拉菜单的表单校验
    //input:hidden   name:categoryId
    //1.js赋值:   (input:hidden).val(id)
    //2.隐藏域默认不进行表单验证,将excluded:[]
    //3.js给隐藏域赋值,不能满足动态修改状态时,进行表单校验
    //4.手动修改状态
    //updateStatus('categoryId','VALID')
    $('.dropdown-menu').on("click", "li", function () {
        $('.dropdownText').text($(this).text());
        var id = $(this).data('id');
        $("[name=categoryId]").val(id);
        $("#form").data("bootstrapValidator").updateStatus('categoryId', 'VALID');
    })

    // 6.
    //1.使用插件上传文件,获取文件的路径
    //2.img显示文件
    //3.js给隐藏域赋值
    //4.进行表单验证(发送ajax成功后,可验证)
    //5.动态修改状态,js赋值不能进行表单验证,需手动修改状态(updateStatus)
    //上传文件:fileupload
    //1.引入文件  jq+2js
    //2.添加属性  name  data-url
    //3.使用插件的方法:  $("#form").fileupload({done:function(){}})
    //data.result.picAddr获取图片路径
    //img显示图片
    //给隐藏域赋值[input:hidden].val(url)
    //动态修改状态时,js赋值不能进行表单校验,手动修改状态updateStatus()

    $("#file").on("click", function () {
        $("#file").fileupload({
            done: function (e, data) {
                console.log(data.result.picAddr);
                //1.修改img的src属性
                $('.img').attr("src", data.result.picAddr);
                //2.给input:hidden赋值(做表单验证)
                $('[name=brandLogo]').val(data.result.picAddr);
                $("#form").data("bootstrapValidator").updateStatus('brandLogo', 'VALID');
            }
        })

    })


    //7.ajax请求(添加二级分类)
    //ajax请求成功后
    //1.关闭模态框
    //2.重置表单
    //3.重新渲染页面(第一页)
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();

        //使用ajax提交逻辑   
        console.log($("#form").serialize());

        $.ajax({
            url: '/category/addSecondCategory',
            type: "post",
            data: $("#form").serialize(),
            success: function (info) {
                $(".secondModal").modal("hide");
                $("#form").data("bootstrapValidator").resetForm(true);
                //恢复下拉菜单及img
                $(".dropdownText").text("请选择一级分类");
                $(".img").attr("src", './images/none.png');
                render(1);


            }

        })

    });








})
$(function () {

    //1.发送ajax请求,请求数据,然后渲染在页面(模板引擎)
    render(1);
    function render(page) {
        var pageSize = 5;
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: "get",
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (info) {
                // console.log(info);
                $('tbody').html(template("first-tmp", info));
                //2.引入分页插件
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (event, originalEvent, type, page) {
                        // console.log(page);
                        //点击页码,渲染对应页
                        render(page);

                    }
                })

            }
        })

    }

    //3.点击添加分类按钮,弹出模态框,进行表单验证
    //4.点击模态框中的添加按钮,阻止表单提交,发送ajax请求
    //5.请求成功,关闭模态框,重置表单,重新渲染第一页

    //3.
    $(".btn-first-add").on('click', function () {
        $('.firstModal').modal('show');
        //表单校验
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
                categoryName: {
                    validators: {
                        //不能为空
                        notEmpty: {
                            message: '用户名不能为空'
                        }
                    }
                },
            }

        });


    })


    //4.
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            url: '/category/addTopCategory',
            type: 'post',
            data: $("#form").serialize(),
            success: function (info) {
                console.log(info);
                //5.
                $('.firstModal').modal('hide');
                $("#form").data('bootstrapValidator').resetForm(true);
                render(1);

            }
        })
    });

    //6.点击取消按钮,重置表单
    $('.btnCancelAdd').on("click", function () {
        //reset按钮,有重置表单内容的作用
        //resetForm这里不用true参数
        $("#form").data('bootstrapValidator').resetForm(true);
    })

})
$(function () {
    var page = 1;
    var id, isDelete;
    //1.发送ajax请求,请求数据,渲染在页面上(模板引擎)
    render();
    function render() {
        var pageSize = 5;
        $.ajax({
            url: '/user/queryUser',
            type: 'get',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (info) {
                // console.log(info);
                $("tbody").html(template("tmp", info));
                //引入分页插件
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    // size: "small",//设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, p) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        // console.log(p);                     
                        page = p;
                        render(page);

                    }
                });


            }

        })

    }


    //2.点击禁用或启用按钮,弹出模态框
    //3.点击确定按钮,发送ajax请求,请求成功,关闭模态框,重新渲染页面
    //注册事件委托
    $("tbody").on('click', ".btn", function () {
        $('.firstModal').modal("show");
        id = $(this).data('id');
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    })
   //3.
    $('.btn-first-confirm').on("click", function () {
        $.ajax({
            url: '/user/updateUser',
            type: 'post',
            data: {
                id: id,
                isDelete: isDelete
            },
            success: function (info) {
                // console.log(info);
                $(".firstModal").modal("hide");
                render();

            }
        })
    })


})
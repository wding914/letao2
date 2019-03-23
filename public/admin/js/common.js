//动态效果
//1.点击分类管理,显示或隐藏二级菜单
//2.点击topbar的menu,显示或隐藏侧边栏
//3.点击topbar的logout(退出按钮),弹出模态框,发送ajax,进行页面跳转
//4.引入分页插件

//1.
$(".second").prev().on("click", function () {

    $(".second").slideToggle();
})

//2.
$(".menu").on("click", function () {

    $(".aside,.main,.topbar").toggleClass('now');

})

//3.
$(".logout").on("click", function () {
    $(".myModal").modal("show");


})
$(".btnLogout").on("click", function () {
    $.ajax({
        url: '/employee/employeeLogout',
        type: "get",
        success: function (info) {
            // console.log(info);
            location.href = "login.html";

        }
    })
})

//4.
function paginator(info,render) {
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

//动态效果
//1.点击分类管理,显示或隐藏二级菜单
//2.点击topbar的menu,显示或隐藏侧边栏
//3.点击topbar的logout(退出按钮),发送ajax,进行页面跳转

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
    $.ajax({
        url: '/employee/employeeLogout',
        type: "get",
        success: function (info) {
            // console.log(info);
            location.href = "login.html";

        }
    })
})
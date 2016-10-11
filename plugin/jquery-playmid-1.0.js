; (function($) {
    //默认设置
    var def = { 
        itemList: "play-mid-list",  //滚动列表的class
        clientWidth: 400,           //滚动区域宽度
        clientHeight: 500,          //滚动区域高度
        pagebtnShow: true,          //左右或者上下控制按钮默认是否显示
        timer: 2000,                //播放时间间隔
        direction: "horizontal",    //滑动方向,水平horizontal,垂直vertical
        activeClass: "select",      //导航按钮高亮状态的class
        navbtnShow: true,           //是否显示导航按钮
        playStart: 0,               //默认从第几个图片开始播放
        autoStart: false            //是否自动播放
    };

    $.fn.slide = function(opt) {
        var custom = $.extend(def, opt || {}),
        itemList = custom.itemList,        
        clw = custom.clientWidth,     
        clh = custom.clientHeight,        
        pagebtnShow = custom.pagebtnShow,       
        timer = custom.timer,        
        direction = custom.direction,       
        activeClass = custom.activeClass,       
        navbtnShow = custom.navbtnShow,        
        autoStart = custom.autoStart,        
        playStart = custom.playStart,        
        mid_list = $(this).find("." + itemList),                //获取滚动列表
        mid_li = $(this).find("." + itemList).children(),       //获取播放列表
        len = $(this).find("." + itemList).children().length,   //获取播放列表总数
        mid_width = $(this).find("." + itemList).children().first().width(),//获取每个播放列表宽度        
        playTimer = null, //设定定时器        
        ind = custom.playStart,
        num = custom.playStart;
        
        //扩展方法
        return this.each(function() { 
            if (playStart < 0 || playStart >= len) {
                alert("起始播放位置超出允许范围，请重新设置");                   
            }

            //显示导航按钮
            if (navbtnShow) {                 
                var swit = $("<ul></ul>");
                for (var i = 0; i < len; i++) {
                    $("<li></li>").appendTo($(swit));
                }
                $(swit).appendTo($(this));
                //根据起始位置设置导航按钮的高亮状态
                var nav_btn = $(swit).children();
                $(nav_btn).eq(playStart).addClass(activeClass);

                if (direction == "horizontal") {
                    $(swit).attr("class", "play-mid-horizontal");
                    $(swit).css({
                        "left": ($(this).width() - $(swit).width()) / 2
                    });  
                    $(nav_btn).on({
                        "click": function() {
                            if (!$(mid_list).is(":animated")) {
                                $(this).addClass(activeClass).siblings().removeClass(activeClass); 
                                ind = $(this).index();
                                $(mid_list).animate({
                                    "left": -clw * ind
                                }, 800);
                            }
                        }
                    });
                } else if (direction == "vertical") { 
                    $(swit).attr("class", "play-mid-vertical");
                    $(swit).css({
                        "top": ($(this).height() - $(swit).height()) / 2
                    });                       
                    $(nav_btn).on({
                        "click": function() {
                            if (!$(mid_list).is(":animated")) { 
                                $(this).addClass(activeClass).siblings().removeClass(activeClass); 
                                ind = $(this).index(); 
                                $(mid_list).animate({
                                    "top": -clh * ind
                                }, 800);
                            }
                        }
                    });
                }             
            }

            //显示翻页按钮
            if (pagebtnShow) { 
                if (direction == "horizontal") {
                    BLeft = $("<span class='play-mid-btn play-mid-left'>←</span>"); 
                    BRight = $("<span class='play-mid-btn play-mid-right'>→</span>"); 
                    if (autoStart) {
                        $(BRight).prependTo($(this));
                        $(BLeft).prependTo($(this));
                        $(this).hover(function() { 
                            $(BRight).stop().fadeIn();
                            $(BLeft).stop().fadeIn();
                        }, function() {
                            $(BRight).stop().fadeOut();
                            $(BLeft).stop().fadeOut();
                        });
                    } else {
                        $(BRight).prependTo($(this)).fadeIn(0);
                        $(BLeft).prependTo($(this)).fadeIn(0);
                    }
                    
                    $(BRight).click(function() { 
                        if (!$(mid_list).is(":animated")) {
                            RunToRight();
                        }
                    });
                    $(BLeft).click(function() { 
                        if (!$(mid_list).is(":animated")) {
                            RunToLeft();
                        }
                    });
                } else if (direction == "vertical") {
                    BUp = $("<span class='play-mid-btn play-mid-up'>↑</span>"); 
                    BDown = $("<span class='play-mid-btn play-mid-down'>↓</span>");
                    if (autoStart) {
                        $(BDown).prependTo($(this));
                        $(BUp).prependTo($(this));
                        $(this).hover(function() { 
                            $(BDown).stop().fadeIn();
                            $(BUp).stop().fadeIn();
                        }, function() { 
                            $(BDown).stop().fadeOut();
                            $(BUp).stop().fadeOut();
                        });
                    } else {
                        $(BDown).prependTo($(this)).fadeIn(0);
                        $(BUp).prependTo($(this)).fadeIn(0);    
                    }
                    
                    $(BUp).click(function() { 
                        if (!$(mid_list).is(":animated")) {
                            RunToUp();
                        }
                    });

                    $(BDown).click(function() {
                        if (!$(mid_list).is(":animated")) {
                            RunToDown();
                        }
                    });
                }
            }

            //初始化播放列表
            if (direction == "horizontal") {
                $(mid_li).css({ 
                    "float": "left"
                });
                $(mid_list).css({ 
                    "width": mid_width * len,
                    "left": -clw * playStart
                });
            } else if (direction == "vertical") {
                $(mid_list).css({
                    "top": -clh * playStart
                });  
            }
            //自动播放
            if (autoStart) {
                if (direction == "horizontal") {
                    playTimer = setInterval(RunToRight, timer); 
                    $(this).hover(function() {
                        clearInterval(playTimer);
                    }, function() {
                        playTimer = setInterval(RunToRight, timer);
                    })
                } else if (direction == "vertical") {                                                               
                    playTimer = setInterval(RunToUp, timer); 
                    $(this).hover(function() {
                        clearInterval(playTimer);
                    }, function() {
                        playTimer = setInterval(RunToUp, timer);
                    })
                }
            }
            
            //封装水平滑动方法
            function RunToRight() { 
                if (navbtnShow) {
                    ind = $(swit).find("." + activeClass).index(); 
                    num = ind;
                }

                if (ind == len - 1) { 
                    $(mid_li).first().css({
                        "left": clw * len
                    }); 
                    ind = 0;
                } else {
                    ind++; 
                }
                if (navbtnShow) {
                    $(nav_btn).eq(ind).addClass(activeClass).siblings().removeClass(activeClass); 
                }
                num++;
                if (!$(mid_list).is(":animated")) {
                    $(mid_list).animate({
                        "left": -clw * num
                    }, 800, function() {
                        if (ind == 0) { 
                            num = 0;
                            $(mid_li).first().css({
                                "left": 0
                            });
                            $(mid_list).css({
                                "left": 0
                            });                            
                        }
                    });
                }
            }
            function RunToLeft() { 
                if (navbtnShow) {
                    ind = $(swit).find("." + activeClass).index(); 
                    num = ind;
                }

                if (ind == 0) { 
                    $(mid_li).last().css({
                        "left": -clw * len
                    }); 
                    ind = len - 1; 
                } else {
                    ind--; 
                }
                if (navbtnShow) {
                    $(nav_btn).eq(ind).addClass(activeClass).siblings().removeClass(activeClass); 
                };
                num--;
                if (!$(mid_list).is(":animated")) { 
                    $(mid_list).animate({
                        "left": -clw * num
                    }, 800, function() {
                        if (ind == len - 1) {
                            num = len - 1;
                            $(mid_li).last().css({
                                "left": 0
                            });
                            $(mid_list).css({
                                "left": -clw * num
                            });
                        }
                    });
                }
            }
            //封装垂直滑动方法
            function RunToUp() { 
                if (navbtnShow) {
                    ind = $(swit).find("." + activeClass).index(); 
                    num = ind;
                }

                if (ind == 0) { 
                    $(mid_li).last().css({
                        "top": -clh * len
                    }); 
                    ind = len - 1;
                } else {
                    ind--; 
                }
                if (navbtnShow) {
                    $(nav_btn).eq(ind).addClass(activeClass).siblings().removeClass(activeClass);
                }
                num--;
                if (!$(mid_list).is(":animated")) {
                    $(mid_list).animate({
                        "top": -clh * num
                    }, 800, function() {
                        if (ind == len - 1) { 
                            num = len - 1;
                            $(mid_li).last().css({
                                "top": 0
                            });
                            $(mid_list).css({
                                "top": -clh * num
                            });
                        }
                    });
                }
            }
            function RunToDown() { 
                if (navbtnShow) {
                    ind = $(swit).find("." + activeClass).index();
                    num = ind;
                }

                if (ind == len - 1) {
                    $(mid_li).first().css({
                        "top": clh * len
                    }); 
                    ind = 0;
                } else {
                    ind++; 
                }
                if (navbtnShow) {
                    $(nav_btn).eq(ind).addClass(activeClass).siblings().removeClass(activeClass);
                }
                num++;
                if (!$(mid_list).is(":animated")) {
                    $(mid_list).animate({
                        "top": -clh * num
                    }, 800, function() {
                        if (ind == 0) { 
                            num = 0;
                            $(mid_li).first().css({
                                "top": 0
                            });
                            $(mid_list).css({
                                "top": 0
                            });                            
                        }
                    });
                }
            }
        });
    };
})(jQuery);
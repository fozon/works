# pop.js   弹窗插件
![image](https://github.com/fozon/works/blob/master/static/m1.png)

### 调用方法

// 弹窗 <br>
var pop = new Popup({

    id: 'dialog',  `指定模板id`
    class: 'mypop', `自定义样式类`
    width: 1200, `设定宽度`
    height: 600, `指定高度`
    title: '新增预约', `弹窗title`
    buttons: [  `弹窗的按钮集，包含按钮的自定义样式和点击后的event回调事件`
        {
            class: 'ok',
            title: '确定',
            background: '#999999',
            color: '#fff',
            event: function (params) {
                // render为返回打包的json数据
                var render = dc.save();
                document.querySelector('#result').innerHTML = JSON.stringify(render);
                dc.save();
            }
        },
        {
            class: 'cancel',
            title: '取消',
            background: '#3B5999',
            color: '#fff',
            event: function (params) {
                dc.cancel();
                this.hide();
            }
        },
    ],
    closeEvent: function (params) {  `关闭按钮事件`
        this.hide();
    },
    style: true  `默认样式`
    
}).show();

### 扩展方法

pop.show()  `弹窗显示` <br>
pop.show()  `弹窗关闭` <br>
pop.shown()  `弹窗淡入` <br>
pop.hidden()  `弹窗淡出` <br>


# drageCell.js   拖拽单元格插件

![image](https://github.com/fozon/works/blob/master/static/m1.png)

### 调用方法

// 默认加载接口 <br>
var dc = new DragCell({

    data: api,  //数据接口
    id: '#table', //指定模板
    dragable: true, //是否拖拽
    options: {
        patientId: '999', //患者id
        orderWaitRoom: '100', //诊室id
        name: '哈哈' //患者姓名,
        startTime: '2018-04-23' //生成当前周 对应的时间
    },
    style: true  //默认创建样式

})

### 扩展方法

//数据更新 <br>
dc.update({

    data: api2,  //数据接口
    id: '#table', //指定模板
    dragable: true, //是否拖拽
    options: {
        patientId: '999', //患者id
        orderWaitRoom: '100', //诊室id
        name: '哈哈' //患者姓名,
        startTime: '2018-04-29' //生成当前周 对应的时间
    },
    style: false  //默认创建样式

})

### 接口格式

// 接口 <br>
var api = {

    "8:00-9:00": [
        {
            "week": "周一",
            "orderDate": "2018-04-16",
            "children": [{
                "id": 1,
                "name": "张三",
                "patientId": "111",
                "orderDate": "2018-04-16",
                "scheduleTime": "2018-04-16",
                "week": "周一",
                "fixWay": "平扫"
            },
            {
                "id": 2,
                "name": "李四",
                "patientId": "222",
                "orderDate": "2018-04-16",
                "scheduleTime": "2018-04-16",
                "week": "周一",
                "fixWay": "增强"
            }
            ]
        },
        {
            "week": "周二",
            "orderDate": "2018-04-17",
            "children": [{
                "id": 1,
                "name": "张三",
                "patientId": "111",
                "orderDate": "2018-04-17",
                "scheduleTime": "2018-04-17",
                "week": "周二",
                "fixWay": "平扫"
            },
            {
                "id": 2,
                "name": "李四",
                "patientId": "222",
                "orderDate": "2018-04-17",
                "scheduleTime": "2018-04-17",
                "week": "周二",
                "fixWay": "增强"
            }
            ]
        },
        {
            "week": "周三",
            "orderDate": "2018-04-18",
            "children": []
        },
        {
            "week": "周四",
            "orderDate": "2018-04-19",
            "children": []
        },
        {
            "week": "周五",
            "orderDate": "2018-04-25",
            "children": [{
                "id": 1,
                "name": "张三",
                "patientId": "111",
                "orderDate": "2018-04-25",
                "scheduleTime": "2018-04-25",
                "week": "周二",
                "fixWay": "平扫"
            },
            {
                "id": 2,
                "name": "李四",
                "patientId": "222",
                "orderDate": "2018-04-25",
                "scheduleTime": "2018-04-25",
                "week": "周二",
                "fixWay": "增强"
            }
            ]
        },
        {
            "week": "周六",
            "orderDate": "2018-04-26",
            "children": []
        },
        {
            "week": "周日",
            "orderDate": "2018-04-27",
            "children": []
        }

    ]
    
}

# pageMaxLimit.js   翻页限制
原生点击翻页页数最大数限制功能，输入页数的时候也做最大数限制，以及显示效果置灰

### 调用方法

w.onload = function () {

        var goPage = new GoPage();

        if (goPage.goPageBtn) {

            goPage.init();

            goPage.goPageBtn.onclick = goPage.clickEvent.bind(goPage);

            goPage.goPageId.onkeyup = goPage.keyupEvent.bind(goPage);

        }

    };

    

# myPlugins.js   我的插件集
myPlugins自己整合的一个自己日常使用的插件集合，日后还会完善，目前部分动画还依赖JQ

### 调用方法

myPlugins.方法名();

# foQuery.js   我的框架demo
foQuery一个类似于jQuery框架的简单demo,主要是展现面向对象的实现模式.

### 自定义插件调用方法

$f.fn.text() = function(){
	console.log($fo(this));
}

### 调用方法

$fo('li').each(function(){

    $fo(this).click(function(){
  
        $fo(this).addClass('color').attr('title','hello').siblings().removeClass('color').removeAttr('title');
    
    })
  
})


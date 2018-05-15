## 个人网站 fozon1984.cn

欢迎访问我的网站 [http://www.fozon1984.cn](http://www.fozon1984.cn)

<br>
<br>
<br>
<br>

## page.js   翻页插件
![image](https://github.com/fozon/works/blob/master/static/pages.png)

#### 调用方法

new Pages({

    border: '1px solid #ccc',
    borderRadius: '3px',
    fontColor: '#333',
    activeColor: '#fff',
    options: {   //options唯一的参数，包含默认走ajax，如果设置jsonp，则jsonp
        url: 'http://www.fozon1984.cn/register/uploadfile',
        data: {
            pages: 10,
            total: 24,
            abc: 111
        },
        type: 'post',
        jsonp: 'callback',
        success: function (res) {  //请求成功回调
            console.log(res, 111111111)
        },
        error: function (xml) { //请求失败回调
            console.log(xml, 2222222222)
        }
    }

})

## pop.js   弹窗插件
![image](https://github.com/fozon/works/blob/master/static/m1.png)

#### 调用方法

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
    closeEvent: function (params) {  `关闭X按钮回调事件`
        this.hide();
    },
    style: true  `默认样式`

}).show();

#### 扩展方法

pop.show()  `弹窗显示` <br>
pop.hide()  `弹窗关闭` <br>
pop.shown()  `弹窗淡入` <br>
pop.hidden()  `弹窗淡出` <br>
pop.update({   `更新弹窗按钮和title`

    title: '预约修改',
    buttons: [
        {
            class: 'ok',
            title: '测试',
            background: '#999999',
            color: '#fff',
            event: function (params) {
                // render为返回打包的json数据
                console.log(this);
                this.hide()

            }
        }
    ]

})


## drageCell.js   拖拽单元格插件

![image](https://github.com/fozon/works/blob/master/static/m2.png)

#### 调用方法

// 默认加载接口 <br>
var dc = new DragCell({

    data: api,  //数据接口 获取所有患者信息
    id: '#table', //指定模板
    width: '100%', //数据列表的宽度 默认auto
    height: 650,  //数据列表的高度 默认auto
    dragable: true, //为true只能拖拽无添加按钮 or 不能拖拽有添加按钮。  !!!注意：不配置这个选项，默许为false
    globalClose: true, //为true表示开启全局关闭操作功能，即：不能拖拽，不能添加。   !!!注意：不配置这个选项，默许为false
    patientModify: true, //为true表示开启修改权限功能, 即：只能修改匹配patientId的选项  !!!注意：不配置这个选项，默许为false
    options: {
        // 传进来的患者id
        patientId: '1223',
        // 诊室id
        orderWaitRoom: '诊室1',
        name: '李四',
        startTime: '2018-4-26',
        selectFixWay: '平扫',  //修改类型，当前id当前类型
        // 点击预约类型添加
        alertCallback: function (params) {
            var str = '';
            switch (flag) {
                case 0:
                    str = '预约类型不能重复添加';
                    break;
                case 1:
                    str = '已经超出当前时间范围，不可预约';
                    break;
            }
            alert(str);
        },
        // 点击加号菜单内容
        menu: ['平扫','增强','穿刺','核野']
    },
    style: true  //默认创建样式

})

#### 扩展方法

//数据更新 <br>
dc.update({  `更新数据时，接口形式尽量保持完整形式`

    data: api2,  //数据接口
    id: '#table', //指定模板
    dragable: true, //是否拖拽
    options: {
        patientId: '999', //患者id
        orderWaitRoom: '100', //诊室id
        name: '哈哈' //患者姓名,
        startTime: '2018-04-29', //生成当前周 对应的起始时间
    },
    style: false  //默认创建样式

})<br>

dc.save()  `获取已操作的数据`<br>
dc.cancel()  `清空已选择的操作数据`<br>

#### 接口格式

// 接口 <br>
var api = {

    "08:00-09:00": [
        {
            "week": "星期一",
            "orderDate": "2018-05-14",
            "children": ""
        },
        {
            "week": "星期二",
            "orderDate": "2018-05-15",
            "children": ""
        },
        {
            "week": "星期三",
            "orderDate": "2018-05-16",
            "children": ""
        },
        {
            "week": "星期四",
            "orderDate": "2018-05-17",
            "children": [
                {
                    "id": "770",
                    "name": "a.b",
                    "orderDate": "2018-05-17",
                    "fixWay": "平扫",
                    "scheduleTime": "2018-05-17",
                    "patientId": "20180503190525",
                    "week": "星期四",
                    "medicalStatus": "0"
                }
            ]
        },
        {
            "week": "星期五",
            "orderDate": "2018-05-18",
            "children": ""
        },
        {
            "week": "星期六",
            "orderDate": "2018-05-19",
            "children": ""
        },
        {
            "week": "星期日",
            "orderDate": "2018-05-20",
            "children": ""
        }
    ],
    "09:00-10:00": [
        {
            "week": "星期一",
            "orderDate": "2018-05-14",
            "children": ""
        },
        {
            "week": "星期二",
            "orderDate": "2018-05-15",
            "children": ""
        },
        {
            "week": "星期三",
            "orderDate": "2018-05-16",
            "children": ""
        },
        {
            "week": "星期四",
            "orderDate": "2018-05-17",
            "children": [
                {
                    "id": "771",
                    "name": "a.b",
                    "orderDate": "2018-05-17",
                    "fixWay": "增强",
                    "scheduleTime": "2018-05-17",
                    "patientId": "20180503190525",
                    "week": "星期四",
                    "medicalStatus": "0"
                }
            ]
        },
        {
            "week": "星期五",
            "orderDate": "2018-05-18",
            "children": ""
        },
        {
            "week": "星期六",
            "orderDate": "2018-05-19",
            "children": ""
        },
        {
            "week": "星期日",
            "orderDate": "2018-05-20",
            "children": ""
        }
    ],
    "10:00-11:30": [
        {
            "week": "星期一",
            "orderDate": "2018-05-14",
            "children": ""
        },
        {
            "week": "星期二",
            "orderDate": "2018-05-15",
            "children": ""
        },
        {
            "week": "星期三",
            "orderDate": "2018-05-16",
            "children": ""
        },
        {
            "week": "星期四",
            "orderDate": "2018-05-17",
            "children": ""
        },
        {
            "week": "星期五",
            "orderDate": "2018-05-18",
            "children": ""
        },
        {
            "week": "星期六",
            "orderDate": "2018-05-19",
            "children": ""
        },
        {
            "week": "星期日",
            "orderDate": "2018-05-20",
            "children": ""
        }
    ],
    "14:00-15:00": [
        {
            "week": "星期一",
            "orderDate": "2018-05-14",
            "children": ""
        },
        {
            "week": "星期二",
            "orderDate": "2018-05-15",
            "children": ""
        },
        {
            "week": "星期三",
            "orderDate": "2018-05-16",
            "children": ""
        },
        {
            "week": "星期四",
            "orderDate": "2018-05-17",
            "children": ""
        },
        {
            "week": "星期五",
            "orderDate": "2018-05-18",
            "children": ""
        },
        {
            "week": "星期六",
            "orderDate": "2018-05-19",
            "children": ""
        },
        {
            "week": "星期日",
            "orderDate": "2018-05-20",
            "children": ""
        }
    ],
    "15:00-16:00": [
        {
            "week": "星期一",
            "orderDate": "2018-05-14",
            "children": ""
        },
        {
            "week": "星期二",
            "orderDate": "2018-05-15",
            "children": ""
        },
        {
            "week": "星期三",
            "orderDate": "2018-05-16",
            "children": ""
        },
        {
            "week": "星期四",
            "orderDate": "2018-05-17",
            "children": ""
        },
        {
            "week": "星期五",
            "orderDate": "2018-05-18",
            "children": ""
        },
        {
            "week": "星期六",
            "orderDate": "2018-05-19",
            "children": ""
        },
        {
            "week": "星期日",
            "orderDate": "2018-05-20",
            "children": ""
        }
    ],
    "16:00-16:30": [
        {
            "week": "星期一",
            "orderDate": "2018-05-14",
            "children": ""
        },
        {
            "week": "星期二",
            "orderDate": "2018-05-15",
            "children": ""
        },
        {
            "week": "星期三",
            "orderDate": "2018-05-16",
            "children": ""
        },
        {
            "week": "星期四",
            "orderDate": "2018-05-17",
            "children": ""
        },
        {
            "week": "星期五",
            "orderDate": "2018-05-18",
            "children": ""
        },
        {
            "week": "星期六",
            "orderDate": "2018-05-19",
            "children": ""
        },
        {
            "week": "星期日",
            "orderDate": "2018-05-20",
            "children": ""
        }
    ]

}

## pageMaxLimit.js      翻页限制
原生点击翻页页数最大数限制功能，输入页数的时候也做最大数限制，以及显示效果置灰

#### 调用方法

* w.onload = function () {
    * var goPage = new GoPage();
    * if (goPage.goPageBtn) {
        * goPage.init();
        * goPage.goPageBtn.onclick = goPage.clickEvent.bind(goPage);
        * goPage.goPageId.onkeyup = goPage.keyupEvent.bind(goPage);
    * }
* };

    

## myPlugins.js     我的插件集


 * Created by fuzhen on 16/9/7. <br>
 * 此插件集成了以下功能：<br>
 * 1、邮箱、账号、手机号，非空及格式校验<br>
 * 2、模拟placeholder兼容ie9以下<br>
 * 3、select选择切换时的选中高亮显示效果<br>
 * 4、canvas画圆，显示百分比圆<br>
 * 5、初始化00000到具体数字及字符的有序翻滚动画效果<br>
 * 6、选项前后比较大小校验，以及submit时校验<br>
 * 7、获取cookie<br>
 * 8、设置cookie<br>
 * 9、勾选记住账号<br>
 * 10、底部跟随 or 固定<br>
 * 11、关键词标红<br>



* myPlugins自己整合的一个自己日常使用的插件集合，日后还会完善，目前部分动画还依赖JQ

#### 调用方法

* myPlugins.方法名(参数);

## foQuery.js       我的框架demo

foQuery一个类似于jQuery框架的简单demo,主要是展现面向对象的实现模式.

#### 插件扩充

* $f.fn.text() = function(){
    * console.log($fo(this)); 
* }

#### 调用方法

* $fo('li').each(function(){
    * $fo(this).click(function(){
        * $fo(this).addClass('color').attr('title','hello').siblings().removeClass('color').removeAttr('title');<br>
    * })
* })


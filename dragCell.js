/**
 * 拖拽单元格
 * 
 */

; (function (window, document, undefined) {

    window.DragCell = DragCell;

    function DragCell(params) {
        this.params = params || {};
        this.renderArray = [];
        this.init(this.params);
    }

    DragCell.prototype = {
        constructor: DragCell,
        init: function (params) {
            this.create(params);
        },
        create: function (params) {
            var object = params.data;
            var lis = document.createDocumentFragment();
            // 创建默认的thead
            var ul = document.createElement('ul');
            var li = document.createElement('li');
            li.classList.add('thead');
            var html = '';
            html += '<div></div>';
            html += '<div>周一</div>';
            html += '<div>周二</div>';
            html += '<div>周三</div>';
            html += '<div>周四</div>';
            html += '<div>周五</div>';
            html += '<div>周六</div>';
            html += '<div>周日</div>';
            li.innerHTML = html;
            // 追加thead
            lis.appendChild(li);
            // 找到模板id
            var renderTpl = document.querySelector(params.id);
            renderTpl.classList.add('drag-table');
            // 创建模板
            ul.appendChild(lis);
            ul.appendChild(this.times(object, params));
            renderTpl.innerHTML = '';
            renderTpl.appendChild(ul);
            // 拖拽
            this.bindEvent(params);
        },
        // 第一级 时刻
        times: function (object) {
            var time = document.createDocumentFragment();
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    var obj = object[key];
                    var li = document.createElement('li');
                    li.dataset.timesId = key;
                    var div = document.createElement('div');
                    div.innerHTML = '<span>' + key + '</span>';
                    li.appendChild(div);
                    // 第二级 星期
                    li.appendChild(this.weeks(obj, key));
                    time.appendChild(li);
                }
            }
            return time
        },
        // 第二级 星期
        weeks: function (array, parent) {
            var weeks = document.createDocumentFragment();
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                var div = document.createElement('div');
                div.dataset.parentId = element.week;
                div.dataset.orderDate = element.orderDate;
                div.dataset.timesId = parent;
                div.classList.add('drag-cell-td');
                //第三级 患者    
                div.appendChild(this.patients(element.children, element, div));
                weeks.appendChild(div);
            }
            return weeks;
        },
        // 第三级 患者 
        patients: function (array, time, parentOjb) {
            // 今天的日期 精确到天
            var todayLocal = new Date().toLocaleDateString(),
                today = new Date(todayLocal).getTime(),
                // 当前列日期 精确到天
                parentTime = new Date(time.orderDate).getTime(),
                // 患者碎片容器
                patients = document.createDocumentFragment(),
                _this = this;
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                var p = document.createElement('p');
                p.dataset.data = JSON.stringify(element);
                p.innerHTML = element.name + ' ' + element.fixWay;
                // 今天之前的不容拖动，置灰
                if (parentTime < today) {
                    p.dataset.disable = 'false';
                }
                patients.appendChild(p);
            }
            // 如果今天之后的给与操作
            if (parentTime >= today) {
                var add = document.createElement('div');
                add.classList.add('add');
                add.innerHTML = '+';
                patients.appendChild(add);
                var data = {
                    orderDate: time.orderDate,
                    week: time.week
                }

                // 点击加号按钮
                var addClick = _this.addClick.bind(_this);
                add.onmousedown = function (event) {
                    addClick(event, this)
                }

            } else {
                parentOjb.dataset.disable = 'false';
            }

            return patients;
        },
        // 保存变动回传数据
        saveArray: function (data) {
            var res = this.inArray(this.renderArray, data);
            if (res.status) {
                this.renderArray.splice(res.index, 1, data);
                var remove = document.querySelector('[data-mark="'+ (data.id + data.fixWay) +'"]');
                remove.parentNode.removeChild(remove);
            } else {
                this.renderArray.push(data);
            }
        },
        // 检测数组包含
        inArray: function (parent, target) {
            var status = false, i;
            for (var index = 0; index < parent.length; index++) {
                var element = parent[index];
                if (element.id == target.id && element.fixWay == target.fixWay) {
                    status = true;
                    i = index;
                    break;
                }
            }
            return {
                status: status,
                index: i
            }
        },
        // 点击加号事件
        addClick: function (event, addOjb) {
            var e = event || window.event,
                _this = this;

            e.preventDefault();
            e.cancelBubble = true;
            var dragAddMenu = document.querySelector('.dragable-add-menu');
            if (!dragAddMenu) {
                dragAddMenu = document.createElement('div');
                dragAddMenu.classList.add('dragable-add-menu');
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="平扫">平扫</p>';
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="增强">增强</p>';
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="穿刺">穿刺</p>';
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="核野">核野</p>';
                document.querySelector('body').appendChild(dragAddMenu);
            } else {
                this.show(dragAddMenu);
            }

            dragAddMenu.style.cssText = 'position:absolute;top:' + (addOjb.parentNode.offsetTop + addOjb.parentNode.clientHeight) + 'px;left:' + addOjb.parentNode.offsetLeft + 'px;width:' + addOjb.parentNode.clientWidth + 'px;';

            // 点击选择类型
            dragAddMenu.onmousedown = function () {
                var res = _this.chooseType();
                var p = document.createElement('p');
                var data = {
                    id: undefined,
                    name: _this.params.options.name,
                    patientId: _this.params.options.patientId,
                    orderDate: addOjb.parentNode.dataset.orderDate,
                    scheduleTime: addOjb.parentNode.dataset.orderDate,
                    week: addOjb.parentNode.dataset.parentId,
                    fixWay: res
                }
                // 新增的存进去
                _this.saveArray({
                    orderWaitRoom: _this.params.options.orderWaitRoom,
                    orderDate: data.orderDate,
                    orderStartPeriod: addOjb.parentNode.dataset.timesId,
                    patientId: data.patientId,
                    scheduleTime: data.scheduleTime,
                    fixWay: data.fixWay,
                    id: data.id//传值为修改 否则为增加
                });

                p.dataset.mark = data.id + data.fixWay;
                p.dataset.data = JSON.stringify(data);
                p.innerHTML = data.name + ' ' + res;
                addOjb.parentNode.appendChild(p);
                _this.hide(this);
            }

        },
        // 是否有这个元素
        hasElement: function (par, tar) {
            // par 
        },
        // 选择类型
        chooseType: function (event) {
            var e = event || window.event;
            e.preventDefault();
            e.cancelBubble = true;

            var el = e.target || e.srcElement;
            return el.dataset.fixway;

        },
        // 显示
        show: function (obj) {
            obj.style.display = 'block';
        },
        // 隐藏
        hide: function (obj) {
            obj.style.display = 'none';
        },
        // 拖拽事件绑定
        bindEvent: function (params) {
            if (!params.dragable) {
                document.onmousedown = null;
                document.onmouseup = null;
                return false;
            }
            var _this = this,
                moveOjb = null,
                // 记录初始位置
                defaultParent = null,
                // 记录初始索引
                defaultIndex = 0,
                // 拖拽状态
                dragStatus = false;

            // 按下
            document.onmousedown = function (e) {
                var dragAddMenu = document.querySelector('.dragable-add-menu');
                dragAddMenu && _this.hide(dragAddMenu);
                // 不是p，禁止右键操作
                var el = e.target || e.srcElement;
                if (el.nodeName != 'P' && el.parentNode.classList != 'drag-cell-td' || e.which == 3 || el.dataset.disable == 'false') return false;
                defaultIndex = el.dataset.index;
                // 复制移动体
                var clone = el.cloneNode(true);
                clone.style.display = 'none';
                moveOjb = document.querySelector('body').appendChild(clone);
                // 初始位置
                defaultParent = el.parentNode;
                defaultParent.removeChild(el);
                // 添加拖拽
                document.onmousemove = function (e) {
                    if (!moveOjb) return false;
                    dragStatus = true;
                    moveOjb.style.cssText = 'display: block; position:absolute;left:' + e.clientX + 'px;top:' + (e.clientY + 10) + 'px;z-index: 999;background:#eee;padding:10px 20px;box-shadow: 0px 3px 5px #ccc;';
                }
            }

            // 松开
            document.onmouseup = function (e) {
                var el = e.target || e.srcElement,
                    data = null,
                    appendEl = null;

                // 禁止右键操作
                if (e.which == 3) {
                    return false;
                }
                // 子集容器
                var children = [];
                // 清除拖拽 防止内存溢出
                document.onmousemove = null;

                // 是否有这个对象
                if (!moveOjb) {
                    return false;
                } else {
                    // 清除跟随鼠标
                    moveOjb.style.cssText = '';
                    defaultParent && defaultParent.insertBefore(moveOjb, defaultParent.childNodes[defaultIndex]);
                }

                // 没有拖拽过直接回滚
                if (!dragStatus) {
                    moveOjb.style.cssText = '';
                    defaultParent && defaultParent.insertBefore(moveOjb, defaultParent.childNodes[defaultIndex]);
                    return false;
                }

                data = JSON.parse(moveOjb.dataset.data);

                // 是否包含P的div，才是cell
                if (el.nodeName == 'DIV' && el.classList == 'drag-cell-td' && el.dataset.disable != 'false') {
                    data.week = el.dataset.parentId;
                    data.scheduleTime = data.orderDate = el.dataset.orderDate;
                    appendEl = el;
                    el.appendChild(moveOjb);
                    children = el.childNodes;
                    // 新增的存进去
                    _this.saveArray({
                        orderWaitRoom: _this.params.options.orderWaitRoom,
                        orderDate: data.orderDate,
                        orderStartPeriod: el.dataset.timesId,
                        patientId: data.patientId,
                        scheduleTime: data.scheduleTime,
                        fixWay: data.fixWay,
                        id: data.id//传值为修改 否则为增加
                    });
                    // 或者直接是cell
                } else if (el.nodeName == 'P' && el.parentNode.classList == 'drag-cell-td' && el.parentNode.dataset.disable != 'false') {
                    data.week = el.parentNode.dataset.parentId;
                    data.scheduleTime = data.orderDate = el.parentNode.dataset.orderDate;
                    appendEl = el.parentNode;
                    children = el.parentNode.childNodes;
                    // 新增的存进去
                    _this.saveArray({
                        orderWaitRoom: _this.params.options.orderWaitRoom,
                        orderDate: data.orderDate,
                        orderStartPeriod: el.parentNode.dataset.timesId,
                        patientId: data.patientId,
                        scheduleTime: data.scheduleTime,
                        fixWay: data.fixWay,
                        id: data.id//传值为修改 否则为增加
                    });
                } else {
                    appendEl = defaultParent;
                    children = defaultParent.childNodes;
                }

                moveOjb.dataset.data = JSON.stringify(data);

                appendEl.appendChild(moveOjb);
                // 每次都要重新格式化子集索引
                _this.childrenIndex(children);
                defaultParent = null;
                dragStatus = false;
            }

        },
        // 格式化子集
        childrenIndex: function (array, data) {
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                element.dataset.index = index;
            }
        },
        // 数据打包
        package: function () {
            var renderTpl = document.querySelector(this.params.id),
                data = {};
            var times = renderTpl.querySelectorAll('[data-times-id]');
            // times
            for (var timesIndex = 0; timesIndex < times.length; timesIndex++) {
                var time = times[timesIndex];
                var weeks = time.querySelectorAll('[data-parent-id]');
                data[time.dataset.timesId] = {};
                // weeks
                for (var weeksIndex = 0; weeksIndex < weeks.length; weeksIndex++) {
                    var week = weeks[weeksIndex];
                    var patients = week.querySelectorAll('p');
                    var patientsArray = [];
                    // patients
                    for (let patientsIndex = 0; patientsIndex < patients.length; patientsIndex++) {
                        var patient = patients[patientsIndex];
                        patientsArray.push(patient.dataset.data);
                    }
                    // 打包数据
                    data[time.dataset.timesId][week.dataset.parentId] = patientsArray;
                }

            }

            return data;

        },
        // 更新数据
        update: function (params) {
            this.params = params;
            this.init(this.params);
        }
    }

})(window, document)


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
            "orderDate": "2018-04-20",
            "children": [{
                "id": 1,
                "name": "张三",
                "patientId": "111",
                "orderDate": "2018-04-20",
                "scheduleTime": "2018-04-20",
                "week": "周二",
                "fixWay": "平扫"
            },
            {
                "id": 2,
                "name": "李四",
                "patientId": "222",
                "orderDate": "2018-04-20",
                "scheduleTime": "2018-04-20",
                "week": "周二",
                "fixWay": "增强"
            }
            ]
        },
        {
            "week": "周六",
            "orderDate": "2018-04-21",
            "children": []
        },
        {
            "week": "周日",
            "orderDate": "2018-04-22",
            "children": []
        }

    ],
    "9:00-10:00": [
        {
            "week": "周一",
            "orderDate": "2018-04-16",
            "children": [{
                "id": 1,
                "name": "王五",
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
                "week": "周一",
                "fixWay": "平扫"
            },
            {
                "id": 2,
                "name": "李四",
                "patientId": "222",
                "orderDate": "2018-04-17",
                "scheduleTime": "2018-04-17",
                "week": "周一",
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
            "orderDate": "2018-04-20",
            "children": []
        },
        {
            "week": "周六",
            "orderDate": "2018-04-21",
            "children": []
        },
        {
            "week": "周日",
            "orderDate": "2018-04-22",
            "children": []
        }
    ]
}

// 默认加载接口
var dc = new DragCell({
    data: api,
    id: '#table',
    dragable: true,
    options: {
        // 传进来的患者id
        patientId: '999',
        // 诊室id
        orderWaitRoom: '100',
        name: '哈哈'
    }
})

// 暴露打包方法
document.querySelector('#ok').onclick = function (params) {
    // render为返回打包的json数据
    var render = dc.renderArray;
    document.querySelector('#result').innerHTML = JSON.stringify(render);
}

// 更新数据方法 用于ajax翻页后
document.querySelector('#update').onclick = function (params) {
    return
    dc && dc.update({
        data: api2,
        id: '#table',
        dragable: true
    })
}
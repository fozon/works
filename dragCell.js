; (function (window, document, undefined) {

    window.DragCell = DragCell;

    function DragCell(params) {
        this.params = params || {};
        this.renderArray = [];
        this.getCurrentPatientTypes = {};

        //自动初始化调用
        this.init(this.params);
    }

    DragCell.prototype = {
        constructor: DragCell,
        /**
         * 初始化
         */
        init: function (params) {
            this.create(params);
            this.clearActive = this.clearActive.bind(this, params);
            this.update = this.update.bind(this, params);
        },
        /**
         * 创建节点
         */
        create: function (params) {
            // 切换诊室清空之前保存的类型
            this.getCurrentPatientTypes = {};

            var object = params.data;
            var header = document.createDocumentFragment();
            // 创建默认的thead
            var body = document.querySelector('body');
            var ul = document.createElement('ul');

            // 追加thead
            header.appendChild(this.createHeader(params.options.startTime));

            // 找到模板id
            var renderTpl = document.querySelector(params.id);

            // 创建样式
            if (!renderTpl.classList.contains('drag-table') && params.style) {
                body.appendChild(this.createStyle());
            };

            renderTpl.classList.add('drag-table', params.id.substr(1));

            ul.style.width = typeof this.params.width === 'number' ? this.params.width + 'px' : this.params.width && this.params.width.indexOf('%') > -1 ? this.params.width : 'auto';
            ul.style.height = typeof this.params.height === 'number' ? this.params.height + 'px' : this.params.height && this.params.height.indexOf('%') > -1 ? this.params.height : 'auto';

            // 创建模板

            ul.appendChild(this.times(object, params));
            renderTpl.innerHTML = '';
            renderTpl.appendChild(header);
            renderTpl.appendChild(ul);

            // 追加类型色块标志
            renderTpl.appendChild(this.createTypeBlock());

            // 追加已选中块
            renderTpl.appendChild(this.createSelectedBlock());

            // 拖拽
            this.bindEvent(params, renderTpl);

        },
        /**
         * 点击cell选中效果
         */
        createSelectedBlock: function (params) {
            var selectedEle = document.createElement('div');
            selectedEle.classList.add('select-text');
            selectedEle.id = 'selectText';
            return selectedEle;
        },
        /**
         * 创建类型颜色块
         */
        createTypeBlock: function (params) {
            var typeBlock = document.createElement('div');
            typeBlock.classList.add('typeBlock');

            var cf = document.createDocumentFragment();
            for (var index = 0; index < this.params.options.menu.length; index++) {
                var element = this.params.options.menu[index];
                var div = document.createElement('div');
                div.innerHTML = '<i class="' + element.class + '"></i>' + element.name;
                cf.appendChild(div);
            }
            typeBlock.appendChild(cf);
            return typeBlock;
        },
        /**
         * 创建thead
         */
        createHeader: function (startTime) {
            var date = new Date(startTime),
                getTime = date.getTime(),
                header = document.createElement('div'),
                div = document.createElement('div'),
                getWeek = [];
            header.classList.add('thead');
            getWeek[1] = '周一';
            getWeek[2] = '周二';
            getWeek[3] = '周三';
            getWeek[4] = '周四';
            getWeek[5] = '周五';
            getWeek[6] = '周六';
            getWeek[0] = '周日';
            div.innerHTML = ' ';
            header.appendChild(div);
            for (var index = 0; index < 7; index++) {
                var element = getTime + index * 24 * 60 * 60 * 1000;
                date.setTime(element);
                var curDiv = document.createElement('div')
                curDiv.innerHTML = date.toLocaleDateString() + '<i>' + getWeek[date.getDay()] + '</i>';
                header.appendChild(curDiv);
            }
            return header;
        },
        /**
         * 获取当前匹配id的类型数组
         */

        /**
         * 第一级 时刻
         */
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
        /**
         * 第二级 星期
         */
        weeks: function (array, parent) {
            var weeks = document.createDocumentFragment();
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                var div = document.createElement('div');
                div.dataset.parentId = element.week;
                div.dataset.orderDate = element.orderDate;
                div.dataset.timesId = parent;
                div.classList.add('drag-cell-td');
                if (this.params.dragable) {
                    div.style.paddingBottom = '10px';
                }
                //第三级 患者
                div.appendChild(this.patients(element.children, element, div));
                weeks.appendChild(div);
            }
            return weeks;
        },
        /**
         * 第三级 患者
         */
        patients: function (array, time, parentOjb) {
            // 今天的日期 精确到天
            var todayLocal = new Date().toLocaleDateString(),
                today = new Date(todayLocal).getTime(),
                // 当前列日期 精确到天
                parentTime = new Date(time.orderDate).getTime(),
                // 患者碎片容器
                patients = document.createDocumentFragment(),
                _this = this,
                currentTypes = [];



            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                var p = document.createElement('p');

                // 是否开启修改当前类型功能
                if (this.params.patientModify) {
                    if ((element.patientId == this.params.options.patientId) && (this.params.options.selectFixWay == element.fixWay)) {
                        p.classList.add('current-patient');
                    } else {
                        p.dataset.disable = 'false';
                    }

                } else {
                    if (element.patientId == this.params.options.patientId) {
                        p.classList.add('current-patient');
                        currentTypes.push(element.fixWay);

                        //检测当天类型是否重复，而不是某一段的四种类型
                        if (this.getCurrentPatientTypes[time.orderDate] && this.getCurrentPatientTypes[time.orderDate].length) {
                            currentTypes = currentTypes.concat(this.getCurrentPatientTypes[time.orderDate]);
                        }
                        this.getCurrentPatientTypes[time.orderDate] = currentTypes;

                    }
                }

                p.classList.add(_this.getFixWay(element.fixWay));
                p.dataset.data = JSON.stringify(element);
                p.dataset.index = index;
                p.innerHTML = element.name + ' ' + element.fixWay;
                // 今天之前的不容拖动，置灰  设置全局关闭 置灰 如果 === 2 就是就诊结束状态
                if (parentTime < today || this.params.globalClose || element.medicalStatus === '2') {
                    p.dataset.disable = 'false';
                }
                patients.appendChild(p);
            }

            // 小于当前时间段，超时不能添加
            var timesId = parentOjb.dataset.timesId.split('-');
            var currentDate = new Date().getTime();
            var orderDateEnd = new Date(parentOjb.dataset.orderDate + ' ' + timesId[1]).getTime();

            // 如果今天之后的给与操作
            if (parentTime >= today && orderDateEnd > currentDate) {
                if (!this.params.dragable && !this.params.globalClose) {
                    var add = document.createElement('div');
                    add.classList.add('add');
                    add.innerHTML = '+';
                    patients.appendChild(add);
                    var data = {
                        orderDate: time.orderDate,
                        week: time.week
                    }
                }
            }

            return patients;
        },
        /**
         * 获取类型英文 添加对应class样式
         */
        getFixWay: function (type) {
            var getFixWay = [];
            for (var index = 0; index < this.params.options.menu.length; index++) {
                var element = this.params.options.menu[index];
                getFixWay[element.name] = element.class;
            }

            return getFixWay[type];
        },
        /**
         * 保存变动返回数据
         */
        saveArray: function (data) {
            var res = this.inArray(this.renderArray, data);
            if (res.status) {
                this.renderArray.splice(res.index, 1, data);
                var remove = document.querySelector('[data-mark="' + (data.id + data.fixWay) + '"]');
                remove && remove.parentNode.removeChild(remove);
            } else {
                this.renderArray.push(data);
            }
        },
        /**
         * 检测数组包含
         */
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
        /**
         * 点击加号事件 创建类型选择弹出框
         */
        addClick: function (event, addOjb) {
            var e = event || window.event,
                _this = this;

            e.preventDefault();
            e.cancelBubble = true;
            var dragAddMenu = document.querySelector('.dragable-add-menu');
            if (!dragAddMenu) {
                dragAddMenu = document.createElement('div');
                dragAddMenu.classList.add('dragable-add-menu');
                var menuChildren = document.createDocumentFragment();
                // 创建添加按钮菜单
                for (var index = 0; index < _this.params.options.menu.length; index++) {
                    var element = _this.params.options.menu[index];
                    var menuChildrenElement = document.createElement('p');
                    menuChildrenElement.dataset.disable = 'false';
                    menuChildrenElement.dataset.fixway = element.name;
                    menuChildrenElement.innerHTML = element.name;
                    menuChildren.appendChild(menuChildrenElement);
                }
                dragAddMenu.appendChild(menuChildren);
                document.querySelector('body').appendChild(dragAddMenu);
            } else {
                this.show(dragAddMenu);
            }

            dragAddMenu.style.cssText = 'position:absolute;top:' + (e.clientY) + 'px;left:' + (e.clientX) + 'px;width:' + addOjb.parentNode.clientWidth + 'px;z-index:10000000;';

            dragAddMenu.onmousedown = null;
            // 点击选择类型
            dragAddMenu.onmousedown = function (event) {
                var e = event || window.event;
                var el = e.target || e.srcElement;
                if (el.nodeName != 'P') {
                    return
                }

                // 关闭菜单
                _this.hide(this);

                // 预约类型一天不能重复多次添加
                var res = _this.chooseType();
                if (_this.getCurrentPatientTypes[addOjb.parentNode.dataset.orderDate] && _this.getCurrentPatientTypes[addOjb.parentNode.dataset.orderDate].indexOf(res) > -1) {
                    typeof _this.params.options.alertCallback === 'function' && _this.params.options.alertCallback(0);
                    return;
                }


                var p = document.createElement('p');
                p.classList.add('current-patient', _this.getFixWay(res));

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

                // 显示选中文本
                // var selectedEle = document.querySelector('#selectText');
                // console.log(selectedEle)
                // selectedEle.innerText = '已选中：' + data.name + ' ' + data.fixWay + ' ' + data.orderDate + ' ' + data.week + ' ' + addOjb.parentNode.dataset.timesId;
            }

        },
        /**
         * 选择类型数据 返回中文
         */
        chooseType: function (event) {
            var e = event || window.event;
            e.preventDefault();
            e.cancelBubble = true;

            var el = e.target || e.srcElement;
            return el.dataset.fixway;
        },
        /**
         * 显示
         */
        show: function (obj) {
            obj.style.display = 'block';
        },
        /**
         * 隐藏
         */
        hide: function (obj) {
            obj.style.display = 'none';
        },
        /**
         * 清除选中
         */
        clearActive: function (params, el) {
            var dragTable = document.querySelector('.' + params.id.substr(1));
            var ps = dragTable.querySelectorAll('li div p');
            for (var index = 0; index < ps.length; index++) {
                var item = ps[index];
                item.classList.remove('active');
            }
            el && el.classList && el.classList.add('active');
        },
        /**
         * 拖拽事件绑定
         */
        bindEvent: function (params, renderTpl) {
            var _this = this,
                moveOjb = null,
                // 记录初始位置
                defaultParent = null,
                // 记录出事拖拽对象
                defaultEle = null,
                // 拖拽状态
                dragStatus = false,
                // 多选状态
                ctrlMultiple = false,
                // 存储多选对象
                multipleObj = [];

            /**
             * 按下ctrl 多选 按下
             */
            document.onkeydown = function (e) {
                if (e.keyCode === 17) {
                    ctrlMultiple = true;
                }
            }


            /**
             *
             * 按下
             */
            document.onmousedown = function (e) {
                var dragAddMenu = document.querySelector('.dragable-add-menu');
                dragAddMenu && _this.hide(dragAddMenu);
                // 不是p，禁止右键操作
                var el = e.target || e.srcElement;

                // 点击加号
                if (el.classList.contains('add')) {
                    // 点击加号按钮
                    _this.addClick.call(_this, event, el);
                    return;
                }

                // 如果不是cell，禁止拖拽
                if (el.nodeName != 'P' && el.parentNode.classList != 'drag-cell-td' || e.which == 3 || el.dataset.disable == 'false' || !params.dragable) return;

                // 点击选中效果 单选 or 多选
                if (!ctrlMultiple) {
                    // 清空多选对象
                    multipleObj = [];
                    // 点击选中
                    _this.clearActive(el);
                } else {
                    el.classList.add('active');
                    multipleObj.push(el);
                }

                // 转换当前选中数据
                var data = JSON.parse(el.dataset.data);

                // 显示选中文本 暂不删除 防止需求变更
                // var selectedEle = document.querySelector('#selectText');
                // selectedEle.innerText = '已选中：' + data.name + ' ' + data.fixWay + ' ' + data.orderDate + ' ' + data.week + ' ' + el.parentNode.dataset.timesId;

                // 复制单体移动体
                var clone = el.cloneNode(true);
                clone.style.display = 'none';
                moveOjb = document.querySelector('body').appendChild(clone);

                // 初始位置
                defaultParent = el.parentNode;
                defaultEle = el;

                // 添加拖拽
                this.onmousemove = function (e) {
                    if (!moveOjb) return false;
                    dragStatus = true;
                    moveOjb.style.cssText = 'display: block; position:absolute;left:' + e.clientX + 'px;top:' + (e.clientY + 10) + 'px;z-index: 1000000;background:#06b;color:#fff;padding:10px 20px;box-shadow: 0px 3px 5px #ccc;';
                }
            }

            /**
             *
             * 松开
             */
            document.onmouseup = function (e) {
                var el = e.target || e.srcElement,
                    data = null,
                    appendEl = null;

                // 禁止右键操作
                if (e.which == 3 || !params.dragable) {
                    return;
                }

                // 子集容器
                var children = [];

                // 清除拖拽 防止内存溢出
                this.onmousemove = null;

                // 是否有这个对象
                if (!moveOjb) {
                    return;
                } else {
                    // 清除跟随鼠标
                    moveOjb.style.cssText = '';
                }

                // 没有拖拽过直接回滚
                if (!dragStatus) {
                    moveOjb.style.cssText = '';
                    return;
                }

                // 获取移动元素的绑定数据
                data = JSON.parse(moveOjb.dataset.data);

                // 是否包含P的div，才是cell
                if (el.nodeName == 'DIV' && el.classList == 'drag-cell-td' && el.dataset.disable != 'false') {

                    // 更新移动元素绑定数据
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

                    // 处理后的data数据塞回移动元素
                    moveOjb.dataset.data = JSON.stringify(data);
                    // 放置成功后删除原有元素
                    defaultParent.removeChild(defaultEle);
                    // 放置成功后追加新元素
                    appendEl.appendChild(moveOjb);

                    // 或者直接是cell
                } else if (el.nodeName == 'P' && el.parentNode.classList == 'drag-cell-td' && el.parentNode.dataset.disable != 'false') {

                    // 更新移动元素绑定数据
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

                    // 处理后的data数据塞回移动元素
                    moveOjb.dataset.data = JSON.stringify(data);
                    // 放置成功后删除原有元素
                    defaultParent.removeChild(defaultEle);
                    // 放置成功后追加新元素
                    // appendEl.appendChild(moveOjb);
                    appendEl.insertBefore(moveOjb, appendEl.childNodes[el.dataset.index]);

                    // 或者不是cell 
                } else {
                    appendEl = defaultParent;
                    children = defaultParent.childNodes;
                    defaultParent.removeChild(moveOjb);
                }

                // 每次都要重新格式化子集索引
                _this.childrenIndex(children);
                defaultParent = null;
                dragStatus = false;
            }

        },
        /**
         * 格式化子集
         */
        childrenIndex: function (array, data) {
            for (var index = 0; index < array.length; index++) {
                var element = array[index];
                element.dataset.index = index;
            }
        },
        /**
         * 数据打包
         */
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
                    for (var patientsIndex = 0; patientsIndex < patients.length; patientsIndex++) {
                        var patient = patients[patientsIndex];
                        patientsArray.push(patient.dataset.data);
                    }
                    // 打包数据
                    data[time.dataset.timesId][week.dataset.parentId] = patientsArray;
                }

            }
            return data;

        },
        /**
         * 更新数据
         */
        update: function (oldValue, newValue) {
            this.params = newValue;
            this.create(newValue);
        },
        /**
         * 保存数据
         */
        save: function (params) {
            var res = this.renderArray;
            this.renderArray = [];
            return res;
        },
        /**
         * 清空数据
         */
        cancel: function (params) {
            this.renderArray = [];
        },
        /**
         * 默认创建样式表
         */
        createStyle: function (params) {
            var style = document.createElement('style'),
                str = '';
            str += '* {padding: 0px;margin: 0px;box-sizing: border-box;}body {font-size: 16px;}';
            str += '.drag-table {user-select: none;color:#333;}';
            str += '.drag-table ul{border: 1px solid #ccc;overflow-y:auto;}';
            str += '.drag-table .select-text{padding:20px 10px;text-align:center;font-size:18px;font-weight:bolder;}';
            str += '.drag-table .thead{border:1px solid #ccc;border-bottom:0;}';
            str += '.drag-table .thead div{width: 12.5%;color:#333;}';
            str += '.drag-table .thead div:first-child{width:150px;border-right: 1px solid #ccc;}';
            str += '.drag-table .thead div i{margin-left:4px;font-style:normal;}';
            str += '.drag-table .thead div,.drag-table li span {display: inline-block;padding: 10px;vertical-align:middle;}';
            str += '.drag-table .thead,.drag-table ul li {display: flex;justify-content: space-between;}';
            str += '.drag-table li>div {position: relative;width: 12.5%;padding:10px 0px;border-bottom: 1px solid #ccc;border-collapse: collapse;padding-bottom:40px;text-align:center;}';
            str += '.drag-table li>div:first-child {width:150px;display:flex;justify-content:center;align-items:center;padding-bottom: 0px;padding-top:0px;border-right: 1px solid #ccc;}';
            str += '.drag-table li>div .add,.drag-table li>div .disable-add {position: absolute;left: 3%;bottom: 4px;width: 94%;height: 30px;line-height: 30px;text-align: center;cursor: pointer;z-index: 3;color:#ccc;font-size:20px;border-radius:4px;border:1px dashed #ccc;}';
            str += '.drag-table li>div .add:hover,.drag-table li>div .disable-add:hover {background:#3B5999;color:#fff;border:1px solid transparent;}';
            str += '.drag-table li>div .disable-add {border-top:1px dotted #ccc;color:#ccc;background:transparent;}';
            str += '.drag-table li:last-of-type>div{border-bottom:0;}';
            str += '.dragable-add-menu p:hover {background: #eee;}';
            str += '.drag-table li p {display:inline-block;width:94%;padding:4px 10px;margin-bottom:4px;font-size: 16px;text-align:center;border-radius:4px;}';
            str += '.drag-table li p:last-child {border: 0;margin-bottom:0px;}';
            str += '.drag-table li p[data-disable="false"] {background: #eee;cursor:no-drop;}';
            str += '.drag-table .current-patient {background: #06b;color:#fff;}';
            str += '.drag-table .typeBlock {position:absolute;top:4px;right:10px;display:flex;justify-content:flex-end;padding: 10px 20px;}';
            str += '.drag-table .typeBlock>div {display:flex;justify-content:space-between;align-items:center;}';
            str += '.drag-table .typeBlock i {width:14px;height:14px;margin:0 9px 0 20px;border-radius:3px;}';
            str += '.drag-table .ps {background: #F1AA45!important;color:#fff;}';
            str += '.drag-table .ps.active {background: #CC8B2F!important;}';
            str += '.drag-table .zq {background: #4E8EF3!important;color:#fff;}';
            str += '.drag-table .zq.active {background: #3E71C2!important;}';
            str += '.drag-table .cc {background: #E47375!important;color:#fff;}';
            str += '.drag-table .cc.active {background: #cc6062!important;color:#fff;}';
            str += '.drag-table .hy {background: #26A163!important;color:#fff;}';
            str += '.drag-table .hy.active {background: #1F804F!important;}';
            str += '.dragable-add-menu {border: 1px solid #ccc;background: #fff;box-shadow: 1px 2px 4px #ccc;}';
            str += '.dragable-add-menu p {padding: 10px;border-bottom: 1px solid #ccc;cursor: pointer;}';
            if (style.styleSheet) {
                style.styleSheet.cssText = str;
            } else {
                style.innerHTML = str;
            }
            return style;
        }
    }

})(window, document);

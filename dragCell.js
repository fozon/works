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
            // this.patients = this.patients.bind(this, params);
        },
        /**
         * 创建节点
         */
        create: function (params) {
            var object = params.data;
            var lis = document.createDocumentFragment();
            // 创建默认的thead
            var body = document.querySelector('body');
            var ul = document.createElement('ul');

            // 追加thead
            lis.appendChild(this.createHeader(params.options.startTime));

            // 找到模板id
            var renderTpl = document.querySelector(params.id);

            // 创建样式
            if (!renderTpl.classList.contains('drag-table') && params.style) {
                body.appendChild(this.createStyle());
            };

            renderTpl.classList.add('drag-table', params.id.substr(1));

            renderTpl.style.width = typeof this.params.width === 'number' ? this.params.width + 'px' : this.params.width && this.params.width.indexOf('%') > -1 ? this.params.width : 'auto';
            renderTpl.style.height = typeof this.params.height === 'number' ? this.params.height + 'px' : this.params.height && this.params.height.indexOf('%') > -1 ? this.params.height : 'auto';

            // 创建模板
            ul.appendChild(lis);
            ul.appendChild(this.times(object, params));
            renderTpl.innerHTML = '';
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
            typeBlock.innerHTML += '<div><i class="ps"></i>平扫</div>';
            typeBlock.innerHTML += '<div><i class="zq"></i>增强CT</div>';
            typeBlock.innerHTML += '<div><i class="cc"></i>穿刺</div>';
            typeBlock.innerHTML += '<div><i class="hy"></i>核野</div>';
            return typeBlock;
        },
        /**
         * 创建thead
         */
        createHeader: function (startTime) {
            var date = new Date(startTime),
                getTime = date.getTime(),
                li = document.createElement('li'),
                div = document.createElement('div'),
                getWeek = [];
            li.classList.add('thead');
            getWeek[1] = '周一';
            getWeek[2] = '周二';
            getWeek[3] = '周三';
            getWeek[4] = '周四';
            getWeek[5] = '周五';
            getWeek[6] = '周六';
            getWeek[0] = '周日';
            li.appendChild(div);
            for (var index = 0; index < 7; index++) {
                var element = getTime + index * 24 * 60 * 60 * 1000;
                date.setTime(element);
                var curDiv = document.createElement('div')
                curDiv.innerHTML = date.toLocaleDateString() + '<i>' + getWeek[date.getDay()] + '</i>';
                li.appendChild(curDiv);
            }
            return li;
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
                            currentTypes.concat(this.getCurrentPatientTypes[time.orderDate]);
                        } else {
                            this.getCurrentPatientTypes[time.orderDate] = currentTypes;

                        }
                    }
                }

                p.classList.add(_this.getFixWay(element.fixWay));
                p.dataset.data = JSON.stringify(element);
                p.innerHTML = element.name + ' ' + element.fixWay;
                // 今天之前的不容拖动，置灰  设置全局关闭 置灰
                if (parentTime < today || this.params.globalClose) {
                    p.dataset.disable = 'false';
                }
                patients.appendChild(p);
            }
            // 如果今天之后的给与操作
            if (parentTime >= today) {
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
            getFixWay['平扫'] = 'ps';
            getFixWay['增强CT'] = 'zq';
            getFixWay['穿刺'] = 'cc';
            getFixWay['核野'] = 'hy';

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
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="平扫">平扫</p>';
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="增强CT">增强CT</p>';
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="穿刺">穿刺</p>';
                dragAddMenu.innerHTML += '<p data-disable="false" data-fixWay="核野">核野</p>';
                document.querySelector('body').appendChild(dragAddMenu);
            } else {
                this.show(dragAddMenu);
            }

            // dragAddMenu.style.cssText = 'position:absolute;top:' + (addOjb.parentNode.offsetTop + addOjb.parentNode.clientHeight) + 'px;left:' + addOjb.parentNode.offsetLeft + 'px;width:' + addOjb.parentNode.clientWidth + 'px;z-index:10000000;';
            dragAddMenu.style.cssText = 'position:absolute;top:' + (e.clientY) + 'px;left:' + (e.clientX) + 'px;width:' + addOjb.parentNode.clientWidth + 'px;z-index:10000000;';

            dragAddMenu.onmousedown = null;
            // 点击选择类型
            dragAddMenu.onmousedown = function (event) {
                var e = event || window.event;
                var el = e.target || e.srcElement;
                if (el.nodeName != 'P') {
                    return
                }

                var res = _this.chooseType();
                if (_this.getCurrentPatientTypes[addOjb.parentNode.dataset.orderDate] && _this.getCurrentPatientTypes[addOjb.parentNode.dataset.orderDate].indexOf(res) > -1) {
                    alert('预约类型不能重复添加！');
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
                _this.hide(this);

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
                // 记录初始索引
                defaultIndex = 0,
                // 拖拽状态
                dragStatus = false;

            /**
             *
             * 按下
             */
            document.onmousedown = function (e) {
                var dragAddMenu = document.querySelector('.dragable-add-menu');
                dragAddMenu && _this.hide(dragAddMenu);
                // 不是p，禁止右键操作
                var el = e.target || e.srcElement;
                // 选中
                _this.clearActive(el);

                // 点击加号
                if (el.classList.contains('add')) {
                    // 点击加号按钮
                    _this.addClick.call(_this, event, el);
                    return;
                }
                if (el.nodeName != 'P' && el.parentNode.classList != 'drag-cell-td' || e.which == 3 || el.dataset.disable == 'false' || !params.dragable) return;
                defaultIndex = el.dataset.index;
                // 显示选中文本
                var data = JSON.parse(el.dataset.data);
                var selectedEle = document.querySelector('#selectText');
                selectedEle.innerText = '已选中：' + data.name + ' ' + data.fixWay + ' ' + data.orderDate + ' ' + data.week + ' ' + el.parentNode.dataset.timesId;
                // 复制移动体
                var clone = el.cloneNode(true);
                clone.style.display = 'none';
                moveOjb = document.querySelector('body').appendChild(clone);
                // 初始位置
                defaultParent = el.parentNode;
                defaultParent.removeChild(el);
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
                    defaultParent && defaultParent.insertBefore(moveOjb, defaultParent.childNodes[defaultIndex]);
                }

                // 没有拖拽过直接回滚
                if (!dragStatus) {
                    moveOjb.style.cssText = '';
                    defaultParent && defaultParent.insertBefore(moveOjb, defaultParent.childNodes[defaultIndex]);
                    return;
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
            str += '.drag-table {user-select: none;color:#333;overflow-y:auto;}';
            str += '.drag-table ul{border-top: 1px solid #ccc;border-left: 1px solid #ccc;}';
            str += '.drag-table .select-text{padding:20px 10px;text-align:center;font-size:18px;font-weight:bolder;}';
            str += '.drag-table li.thead div{color:#333}';
            str += '.drag-table li.thead div i{margin-left:4px;font-style:normal;}';
            str += '.drag-table li.thead div,.drag-table li span {display: inline-block;padding: 10px;vertical-align:middle;}';
            str += '.drag-table ul li {display: flex;justify-content: space-between;}';
            str += '.drag-table li>div {position: relative;width: 12.5%;padding:10px 0px;border-right: 1px solid #ccc;border-bottom: 1px solid #ccc;border-collapse: collapse;padding-bottom:40px;text-align:center;}';
            str += '.drag-table li>div .add,.drag-table li>div .disable-add {position: absolute;left: 3%;bottom: 4px;width: 94%;height: 30px;line-height: 30px;text-align: center;cursor: pointer;z-index: 3;background:#3B5999;color:#fff;font-size:20px;border-radius:4px;}';
            str += '.drag-table li>div .disable-add {border-top:1px dotted #ccc;color:#ccc;background:transparent;}';
            str += '.dragable-add-menu p:hover {background: #eee;}';
            str += '.drag-table li p {display:inline-block;width:94%;padding:4px 10px;margin-bottom:4px;font-size: 16px;text-align:center;border-radius:4px;}';
            str += '.drag-table li p:last-child {border: 0;}';
            str += '.drag-table li p[data-disable="false"] {background: #eee;cursor:no-drop;}';
            str += '.drag-table .current-patient {background: #06b;color:#fff;}';
            str += '.drag-table .typeBlock {display:flex;justify-content:flex-end;padding: 10px 20px;}';
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

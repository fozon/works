(function(window, document, undefined) {
    window.selectToInput = selectToInput;

    /**
     *  string：匹配的关键词  array：匹配数组  flag：开关为true时返回数值
     */
    function inArray(string, array, flag) {
        var res = {
            status: false
        };
        for (var index = 0; index < array.length; index++) {
            var element = array[index];
            if (!flag) {
                if (element.dmmc === string) {
                    res.status = true;
                    res.value = element.dmsb;
                    break;
                }
            } else {
                if (element.dmsb == string) {
                    res.status = true;
                    res.value = element.dmmc;
                    break;
                }
            }
        }
        return res;
    }

    function selectToInput(params) {
        var params = params || {};

        this.methods = {
            get: function get() {
                return params;
            },
            set: function set(params) {
                params = params;
            }
        };

        this.id = document.querySelector('#' + params.id);
        this.init();
    }

    selectToInput.prototype = {
        constructor: selectToInput,
        init: function() {
            var params = this.methods.get();
            this.createElement();
            this.bindEvent();

            if (params.style) {
                var style = this.createStyle();
                this.id.parentNode.insertBefore(style, this.id.parentNode.childNodes[0]);
            }
        },
        createElement: function() {
            var params = this.methods.get();
            params.dom = {};
            var elements = document.createDocumentFragment(),
                span = (params.dom.span = document.createElement('span')),
                down = (params.dom.down = document.createElement('button')),
                hidden = (params.dom.hidden = document.createElement('input')),
                a = document.createElement('a'),
                select = (params.dom.select = this.createSelect());

            span.innerHTML = params.title;

            down.type = 'button';
            down.name = params.id + '-text';
            down.dataset.input = 'down';
            down.classList.add('select');
            down.appendChild(document.createTextNode(''));
            down.appendChild(a);

            hidden.type = 'hidden';
            hidden.name = params.id;

            a.classList.add('down-arrow');

            elements.appendChild(span);
            elements.appendChild(down);
            elements.appendChild(hidden);

            // 是否创建联动input
            if (params.input) {
                var input = (params.dom.in = document.createElement('input'));
                input.type = 'text';
                input.dataset.input = 'in';
                params.maxLength !== undefined && (input.maxLength = params.maxLength);
                elements.appendChild(input);
            }
            elements.appendChild(select);

            this.id.classList.add('select-' + params.id);
            this.id.appendChild(elements);

            // 塞值
            this.methods.set(params);
        },
        createSelect: function() {
            var params = this.methods.get();

            var select = document.createElement('div');
            select.classList.add('select-ul');
            select.style.display = 'none';

            var ul = document.createElement('ul');

            var lis = document.createDocumentFragment();

            var data = params.data ? params.data : [{}];

            for (var index = 0; index < data.length; index++) {
                var element = data[index];
                var li = document.createElement('li');
                li.dataset.id = params.id;
                if (params.line) {
                    li.style.cssText = 'width:100%';
                }
                var dom = '<label>';
                dom += element.dmmc + '<input type="hidden" data-input-id="' + element.dmsb + '" value="' + element.dmmc + '" />';
                dom += '</label>';
                li.innerHTML = dom;
                lis.appendChild(li);
            }

            ul.appendChild(lis);
            select.appendChild(ul);

            return select;
        },
        bindEvent: function() {
            var _this = this,
                params = this.methods.get();

            // 局部事件委托 - 点击事件
            this.id.addEventListener(
                'click',
                function(event) {
                    var event = event || window.event;
                    event.stopPropagation();
                    event.preventDefault();

                    var el = event.target || event.toElement;

                    params.dom.select.style.display = 'none';

                    // 点击button
                    if (el === params.dom.down) {
                        params.dom.select.style.display = 'block';
                    }

                    // 点击下拉选项
                    var input = el.querySelector('input');
                    try {
                        if (input.getAttribute('data-input-id')) {
                            params.dom.down && (params.dom.down.childNodes[0].textContent = input.value);
                            params.valueType === 'text' ? params.dom.hidden && (params.dom.hidden.value = input.value) : params.dom.hidden && (params.dom.hidden.value = input.dataset.inputId);
                            params.dom.in && (params.dom.in.value = '');
                        }
                    } catch (error) {
                        console.warn(error);
                    }
                },
                false
            );

            // 局部事件委托 - 绑定输入事件
            this.id.addEventListener('input', function(event) {
                var event = event || window.event,
                    downValue = '',
                    value = '';
                event.stopPropagation();
                event.preventDefault();

                var el = event.target || event.toElement;

                // 输入框
                if (el === params.dom.in) {
                    value = el.value;

                    var res = inArray(value, params.data);

                    if (res.status) {
                        downValue = value;
                        value = params.valueType === 'text' ? value : res.value;
                        el.value = '';
                    }

                    params.dom.down.childNodes[0].textContent = downValue;
                    params.dom.hidden.value = value;
                }
            });

            // 全局事件委托 - 点击事件
            document.addEventListener(
                'click',
                function() {
                    params.dom.select.style.display = 'none';
                },
                false
            );
        },
        createStyle: function() {
            var style = document.createElement('style');
            var params = this.methods.get();
            var str = '';
            str += '.select-' + params.id + '{position:relative;}';
            str += '.select-' + params.id + '>div{display:none;position:absolute;top:25px;left: 83px;width: auto;background: #fff;border: 1px solid #3b5999;overflow: hidden;height: auto;overflow-y: auto;max-height: 135px;z-index:5;}';
            str += '.select-' + params.id + '>input,.select-' + params.id + '>button{width: 130px;height: 26px;display:inline-block;vertical-align:middle;box-sizing:border-box;margin-left:10px;cursor:pointer;background-color:#fff;vertical-align:middle;border:1px solid #ccc!important;outline:none!important;overflow:hidden;text-overflow:ellipsis;text-align:left;}';
            str += '.select-' + params.id + '>input:first-of-type{padding-right: 25px;}';
            str += '.select-' + params.id + '>span{display:inline-block;width:73px;text-align-last: justify;}';
            str += '.select-' + params.id + '>button{position:relative;color:#000;}';
            str += '.select-' + params.id + '>button>a{display: inline-block;width:0;height:0;right: 6px; top: 10px;position: absolute; opacity: 0.6;cursor: pointer;z-index:5;border: 6px solid transparent;border-top: 6px solid #999;}';
            str += '.select-' + params.id + ' ul{margin:0;padding:0;}';
            str += '.select-' + params.id + ' li{list-style-type: none;padding: 4px 10px!important;}';
            str += '.select-' + params.id + ' li:hover{color: #3b5999;}';
            str += '.select-' + params.id + ' [type="hidden"]{display:none;}';

            if (style.styleSheet) {
                style.styleSheet.cssText = str;
            } else {
                style.innerHTML = str;
            }

            return style;
        },
        setValue: function(a) {
            var params = this.methods.get(),
                value = a;

            // 是否为数字类型
            if (!isNaN(a)) {
                var res = inArray(a, params.data, true);
                if (res.status) {
                    value = res.value;
                }
            }

            params.dom.down.childNodes[0].textContent = value;
            params.dom.hidden.value = a;
        },
        getValue: function() {
            var params = this.methods.get();
            return params.dom.hidden.value;
        }
    };
})(window, document);

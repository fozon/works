; (function (window, document, undefined) {
    window.selectToInput = selectToInput;

    function selectToInput(params) {
        var params = params || {};

        this.get = function () {
            return params;
        }
        this.set = function (params) {
            params = params
        }

        this.id = document.querySelector('#' + params.id);
        this.init();
    }

    selectToInput.prototype = {
        constructor: selectToInput,
        init: function () {
            var params = this.get();
            this.createElement();
            this.bindEvent();
            if (params.style) {
                var style = this.createStyle();
                this.id.parentNode.insertBefore(style, this.id.parentNode.childNodes[0]);
            }
        },
        createElement: function () {
            var params = this.get();
            params.dom = {};
            var elements = document.createDocumentFragment(),
                span = params.dom.span = document.createElement('span'),
                down = params.dom.down = document.createElement('input'),
                input = params.dom.in = down.cloneNode(true),
                a = document.createElement('a'),
                select = params.dom.select = this.createSelect();

            span.innerHTML = params.title;

            down.type = 'text';
            down.name = params.id;
            down.dataset.input = 'down';
            down.classList.add('select');

            input.type = 'text';
            input.dataset.input = 'in';

            a.classList.add('down-arrow');

            elements.appendChild(span);
            elements.appendChild(document.createTextNode('：'));
            elements.appendChild(down);
            elements.appendChild(input);
            elements.appendChild(a);
            elements.appendChild(select);

            this.id.classList.add('select-' + params.id);
            this.id.appendChild(elements);

            this.set(params);
        },
        createSelect: function () {
            var params = this.get();

            var select = document.createElement('div');
            select.classList.add('select-ul');
            select.style.display = 'none';

            var ul = document.createElement('ul');

            var lis = document.createDocumentFragment();

            var data = params.dict ? params.dict : [{}];

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
        bindEvent: function () {
            var _this = this,
                params = this.get();

            // 局部事件委托 - 点击事件
            this.id.addEventListener('click', function (event) {
                var event = event || window.event;
                event.stopPropagation();
                event.preventDefault();

                var el = event.target || event.toElement;

                if (el.dataset.input === 'down' || el.nodeName.toLowerCase() === 'a') {
                    params.dom.select.style.display = 'block';
                } else {
                    params.dom.select.style.display = 'none';
                }

                var input = el.querySelector('input');
                if (input && input.dataset && input.dataset.inputId !== undefined) {
                    params.dom.down.value = input.value;
                    params.dom.in.value = '';
                }

            }, false);

            // 局部事件委托 - 绑定输入事件
            this.id.addEventListener('input', function (event) {
                var event = event || window.event;
                event.stopPropagation();
                event.preventDefault();

                var el = event.target || event.toElement;

                if (el.dataset.input === 'in') {
                    var value = el.value;
                    params.dom.down.value = '';
                }

            })

            // 全局事件委托 - 点击事件
            document.addEventListener('click', function () {
                params.dom.select.style.display = 'none';
            }, false);

        },
        createStyle: function () {
            var style = document.createElement('style');
            var params = this.get();
            var str = '';
            str += '.select-' + params.id + '{position:relative;}';
            str += '.select-' + params.id + '>div{display:none;position:absolute;top:25px;left: 89px;width: 264px;background: #fff;border: 1px solid #3b5999;overflow: hidden;height: auto;overflow-y: auto;max-height: 135px;}';
            str += '.select-' + params.id + '>input{width: 130px;height: 26px;display:inline-block;vertical-align:center;box-sizing:border-box;margin-right:6px;cursor:pointer;}';
            str += '.select-' + params.id + '>span{display:inline-block;width:73px;text-align-last: justify;}';
            str += '.select-' + params.id + '>a{display: inline-block;width:0;height:0;left: 198px; top: 10px;position: absolute; opacity: 0.6;cursor: pointer;z-index:5;border: 6px solid transparent;border-top: 6px solid #999;}';
            str += '.select-' + params.id + ' ul{margin:0;padding:0;}';
            str += '.select-' + params.id + ' li{list-style-type: none;padding: 4px 10px;}';
            str += '.select-' + params.id + ' li:hover{color: #3b5999;}';

            if (style.styleSheet) {
                style.styleSheet.cssText = str;
            } else {
                style.innerHTML = str
            }

            return style;

        }

    }

})(window, document);
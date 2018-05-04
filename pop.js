; (function (window, document, undefined) {

    window.Popup = Popup;

    // 弹窗
    function Popup(params) {
        var params = params || {};

        this.pop = document.createElement('div');
        this.masking = document.createElement('div');

        this.init(params);
    }

    Popup.prototype = {
        construtor: Popup,
        init: function (params) {
            this.create(params);
            this.update = this.update.bind(this, params);
        },
        create: function (params) {
            var body = document.querySelector('body');
            // 创建
            var pop = this.pop;
            pop.id = params.class;
            pop.classList.add('popup', params.class);
            pop.style.cssText = '';
            pop.style.display = 'none';

            var masking = this.masking;
            masking.classList.add('masking');
            masking.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:999999;background:#000;opacity:.6;';

            // 加头
            pop.appendChild(this.header(params));

            // 内容
            pop.appendChild(this.body(params));

            // 底部
            pop.appendChild(this.footer(params));

            if (params.style) {
                body.appendChild(this.createStyle(params));
            }

            body.appendChild(masking);
            body.appendChild(pop);
        },
        createStyle: function (params) {
            var style = document.createElement('style'),
                str = '';
            str += '.popup{position:absolute;width:' + params.width + 'px;height:' + params.height + 'px;left:50%;top:50%;margin-top:-' + (params.height / 2) + 'px;margin-left:-' + (params.width / 2) + 'px;z-index:1000000;background:#fff;border:1px solid #ccc;box-sizing:border-box;}';
            str += '.popup .header{width:100%;padding:10px;height: 40px;background:#3B5999;color:#fff;box-sizing:border-box;display:flex;justify-content: space-between;z-index:3;}';
            str += '.popup .header i{display:inline-block;width:20px;height:20px;margin-right:10px;vertical-align:middle;}';
            str += '.popup .header .close{cursor:pointer;width:30px;height:30px;position:relative;}';
            str += '.popup .header .close:before,.popup .header .close:after{position:absolute;left:50%;top:0;display:block;width:3px;height:20px;background:#fff;content:"";transform:rotate(-45deg);}';
            str += '.popup .header .close:after{transform:rotate(45deg);}';
            str += '.popup .content{position:relative;width:100%;height:' + (params.height - 40 - 60) + 'px;padding:0px 10px;box-sizing:border-box;z-index:1;overflow-y:auto;}';
            str += '.popup .footer{width:100%;height:60px;padding:10px;text-align:center;box-sizing:border-box;z-index:3;display:flex;justify-content:center;align-items: center;}';
            str += '.popup .footer button{margin:0px 10px;border:0px solid #3B5999;padding:5px 25px;background:#3B5999;color:#fff;cursor:pointer;border-radius:2px;font-size:16px;}';
            if (style.styleSheet) {
                style.styleSheet.cssText = str;
            } else {
                style.innerHTML = str;
            }
            return style;
        },
        header: function (params) {
            var header = document.createElement('div');
            // 头部
            header.classList.add('header');

            // 头部-titile
            var title = document.createElement('div');
            title.classList.add('title');
            title.innerHTML = '<i></i><span>' + params.title + '</span>';

            // 头部-button
            var close = document.createElement('div');
            close.classList.add('close');
            close.innerHTML = '';
            var closeEvent = params.closeEvent && params.closeEvent.bind(this, close, event);
            close.onclick = closeEvent;

            header.appendChild(title);
            header.appendChild(close);

            return header;
        },
        body: function (params) {
            var body = document.createElement('div');
            // 内容
            body.classList.add('content');

            var id = document.querySelector('#' + params.id);
            body.innerHTML = id.innerHTML;
            id.innerHTML = '';

            return body;
        },
        footer: function (params) {
            var _this = this,
                footer = document.createElement('div');
            // 底部
            footer.classList.add('footer');
            params.buttons.forEach(function (item, index) {
                var btn = document.createElement('button'),
                    clickEvent = item.event && item.event.bind(_this, btn);
                btn.classList.add(item.class);
                btn.innerHTML = item.title;
                btn.style.background = item.background || '#3B5999';
                btn.style.color = item.color || '';
                ; (function (btn) {
                    btn.onclick = clickEvent;
                })(btn);
                footer.appendChild(btn);
            });

            return footer;
        },
        show: function (params) {
            this.pop.style.display = 'block';
            this.pop.style.opacity = 1;
            this.masking.style.display = 'block';
            this.masking.style.opacity = .6;
            return this;
        },
        hide: function (params) {
            this.pop.style.display = 'none';
            this.masking.style.display = 'none';
            return this;
        },
        shown: function name(params, callback) {
            this.pop.style.display = 'block';
            this.pop.style.opacity = 0;
            this.masking.style.display = 'block';
            this.masking.style.opacity = 0;
            this.animation('show', 'opacity', function (params) {
                typeof callback == 'function' && callback();
            });
        },
        hidden: function (params, callback) {
            this.animation('hide', 'opacity', function (params) {
                this.pop.style.display = 'none';
                this.masking.style.display = 'none';
                typeof callback == 'function' && callback();
            })
            return this;
        },
        animation: function (obj, name, callback) {
            var i = obj == 'show' ? 0 : 6,
                auto = undefined,
                _this = this;

            auto = setTimeout(function () {
                if (i < 0 && obj == 'hide' || i > 6 && obj == 'show') {
                    clearTimeout(auto);
                    typeof callback == 'function' && callback.call(_this);
                    return;
                }
                _this.pop.style[name] = (i + 4) / 10;
                _this.masking.style[name] = i / 10;
                obj == 'show' ? i++ : i--;
                setTimeout(arguments.callee, 30);
            }, 30);

        },
        update: function (opts, params) {
            opts.buttons = params.buttons;
            opts.title = params.title;
            // 新增底部按钮
            var footer = this.footer(opts);
            var oldFooter = this.pop.querySelector('.' + footer.classList);
            oldFooter.parentNode.removeChild(oldFooter);
            this.pop.appendChild(footer);
            // 修改title
            this.pop.querySelector('.title span').innerHTML = opts.title;
            return this;
        }
    }

})(window, document);
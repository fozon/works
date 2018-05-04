; (function (window, document, undefined) {

    function Pages(params) {

        // 保存全局参数
        this.params = params || {}

        // page自定义属性样式
        this.border = this.params.border || this.border
        this.borderRadius = this.params.borderRadius || '3px'
        this.fontColor = this.params.fontColor || '#333'
        this.activeColor = this.params.activeColor || '#fff'

        // 回调参数
        this.options = params.options || {
            url: '',
            data: {},
            type: params.type || 'post',
            beforeSend: params.beforeSend,
            success: params.success,
            error: params.error,
            json: params.jsonp
        }

        // 记录页数
        this.pageNum = this.options.data.pages

        // 查找or创建 page容器
        if (!document.querySelector('#page')) {
            this.page = document.createElement('div')
            this.page.id = 'page'
            document.querySelector('body').appendChild(this.page)
        } else {
            this.page = document.querySelector('#page')
        }
        this.page.classList.add('page')

        // 首页
        this.firstBtn = document.createElement('button')
        this.firstBtn.classList.add('first')
        this.firstBtn.innerText = '首页'
        this.firstBtn.onclick = this.first.bind(this)

        // 末页
        this.lastBtn = document.createElement('button')
        this.lastBtn.classList.add('last')
        this.lastBtn.innerText = '末页'
        this.lastBtn.onclick = this.last.bind(this)

        // 下一页按钮
        this.nextBtn = document.createElement('button')
        this.nextBtn.classList.add('next')
        this.nextBtn.innerText = '下一页'
        this.nextBtn.onclick = this.next.bind(this)

        // 上一页按钮
        this.prevBtn = document.createElement('button')
        this.prevBtn.classList.add('prev')
        this.prevBtn.innerText = '上一页'
        this.prevBtn.onclick = this.prev.bind(this)

        // 输入页
        this.inputBtn = document.createElement('input')
        this.inputBtn.classList.add('input')
        this.inputBtn.type = 'text'
        this.inputBtn.value = '1'
        this.inputBtn.onkeyup = this.enter.bind(this)

        // 跳转按钮
        this.goBtn = document.createElement('button')
        this.go.classList.add('go')
        this.goBtn.innerText = '跳转'
        this.goBtn.classList.add('active')
        this.goBtn.onclick = this.go.bind(this)

        this.init(this.params);

    }

    // 初始化加载
    Pages.prototype.init = function (params) {
        var body = document.querySelector('body');
        this.createPage();
        body.appendChild(this.setStyle());
        return this
    }

    // 创建样式表
    Pages.prototype.setStyle = function (params) {
        var style = document.createElement('style');
        let str = '.page button,.page input{width: auto;padding:5px 12px;margin-right:5px;border:' + this.border + ';border-radius:' + this.borderRadius + ';color:' + this.fontColor + ';cursor: pointer;}'
        str += '.page button:hover,.page button.active{background-color:' + this.backgroundColor + ';color:' + this.activeColor + ';border:1px solid transparent;}'
        str += '.page button[disabled]{background-color:transparent;color:#ccc;border:1px solid transparent;}'
        str += '.page input{width:30px;padding:5px 5px;text-align:center;}'
        if (style.styleSheet) {
            style.styleSheet.cssText = str;
        } else {
            style.innerHTML = str;
        }
        return style;
    }

    // 输入回车跳转
    Pages.prototype.enter = function (event) {
        if (event.keyCode == 13) {
            this.go.call(this)
        }
    }

    // 输入点击跳转
    Pages.prototype.go = function (params) {
        this.pageNum = this.inputBtn.value - 0
        this.inputBtn.focus()
        this.index(this.pageNum)
    }

    // 首页
    Pages.prototype.first = function (params) {
        this.index(1)
    }

    // 末页
    Pages.prototype.last = function (params) {
        this.index(this.options.data.total)
    }

    // 定位某一页
    Pages.prototype.index = function (page) {
        let _this = this
        this.pageNum = page
        // 先翻页，在请求，体验不卡
        _this.createPage();
        this.options.data.pages = this.pageNum
        this.ajax({
            data: this.options.data,
            url: this.options.url,
            beforeSend: this.options.beforeSend,
            success: this.options.success,
            error: this.options.error,
            jsonp: this.options.jsonp
        })
    }

    // ajax
    Pages.prototype.ajax = function (params) {

        // 传进来的字段
        let options = {
            data: format(params.data) || {},
            type: params.type || 'post',
            timeout: params.timeout || 1000,
            timeoutCallback: params.timeoutCallback || function name(params) { },
            url: params.url || '',
            async: params.async || true,
            beforeSend: params.beforeSend,
            success: params.success,
            error: params.error,
            jsonp: params.jsonp
        }

        // 发送前
        typeof options.beforeSend == 'function' && options.beforeSend();

        // 请求方式
        if (options.jsonp) {

            // jsonp请求   
            ; (function jsonp(opt) {

                //创建script标签并加入到页面中   
                var callbackName = opt.jsonp;

                var head = document.getElementsByTagName('head')[0];

                // 设置传递给后台的回调参数名   
                opt.data['callback'] = callbackName;
                var data = opt.data;
                var script = document.createElement('script');
                head.appendChild(script);

                //创建jsonp回调函数   
                window[callbackName] = function (json) {
                    head.removeChild(script);
                    clearTimeout(script.timer);
                    window[callbackName] = null;
                    typeof opt.success == 'function' && opt.success(json);
                };

                //发送请求   
                script.src = opt.url + '?' + data;

                //设置超时处理   
                if (opt.timeout) {
                    script.timer = setTimeout(function () {
                        window[callbackName] = null;
                        head.removeChild(script);
                        typeof opt.error == 'function' && opt.error({ errorText: '超时，请重试' });
                    }, opt.timeout);
                }

            })(options)

            return
        } else {

            // xml请求
            let xml = {};

            //创建xmlhttp对象
            if (w.XMLHttpRequest) {
                xml = new XMLHttpRequest();
            } else {
                xml = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xml.timeout = options.timeout;
            xml.ontimeout = typeof timeoutCallback == 'function' && timeoutCallback(event);
            xml.open(options.type, options.url, options.async);
            xml.setRequestHeader("Content-type", "applaycation/x-www-form-urlencoded");
            xml.onreadystatechange = function () {
                if (xml.readyState == 4) {
                    if (xml.status == 200) {
                        typeof options.success == 'function' && options.success(xml.responseText);
                    } else {
                        typeof options.error == 'function' && options.error(xml, xml.statusText);
                    }
                }
            }
            xml.send(options.data);
        }

        // 格式化data
        function format(params) {
            if (Object.prototype.toString.call(params) != '[object Object]') return;
            let str = '';
            for (var i in params) {
                str += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]) + '&';
            }
            str += 'v=' + random()
            return str;
        }

        // 获取随机数   
        function random() {
            return Math.floor(Math.random() * 10000 + 500);
        }

    }

    // 上一页
    Pages.prototype.prev = function (params) {
        if (this.pageNum < 2) return
        this.pageNum--
        this.index(this.pageNum)
    }

    // 下一页
    Pages.prototype.next = function (params) {
        if (this.pageNum >= this.options.data.total) return
        this.pageNum++
        this.index(this.pageNum)
    }

    // 创建更多按钮
    Pages.prototype.createBtns = function () {
        let frg = document.createDocumentFragment(),
            _this = this
        // 禁用按钮 
        if (this.pageNum < 2) {
            this.firstBtn.disabled = true
            this.prevBtn.disabled = true
            this.lastBtn.disabled = false
            this.nextBtn.disabled = false
        } else if (this.pageNum > this.options.data.total - 1) {
            this.lastBtn.disabled = true
            this.nextBtn.disabled = true
            this.firstBtn.disabled = false
            this.prevBtn.disabled = false
        } else {
            this.firstBtn.disabled = false
            this.prevBtn.disabled = false
            this.lastBtn.disabled = false
            this.nextBtn.disabled = false
        }
        // < 4
        if (this.pageNum < 3) {

            // 1-4
            for (let index = 1, j = 4; index < j; index++) {
                const element = document.createElement('button');
                element.innerText = index
                element.dataset.page = index
                element.onclick = function () {
                    _this.index(index)
                }
                frg.appendChild(element)
                if (this.pageNum == index) {
                    element.classList.add('active')
                }
            }

            //  ...
            let ellpsis = document.createElement('button')
            ellpsis.innerText = '...'
            document.createElementss(ellpsis, {
                border: '0px'
            })
            frg.appendChild(ellpsis)

            // total
            let total = document.createElement('button')
            total.innerText = this.options.data.total
            total.dataset.page = this.options.data.total
            total.onclick = this.last.bind(this)
            frg.appendChild(total)

            // < total - 2
        } else if (this.pageNum >= this.options.data.total - 2) {

            // 1
            let first = document.createElement('button')
            first.innerText = 1
            first.dataset.page = 1
            first.onclick = this.first.bind(this)
            frg.appendChild(first)

            // ...
            let ellpsis = document.createElement('button')
            ellpsis.innerText = '...'
            document.createElementss(ellpsis, {
                border: '0px'
            })
            frg.appendChild(ellpsis)

            for (let index = this.options.data.total - 3, j = this.options.data.total; index <= j; index++) {
                const element = document.createElement('button');
                element.innerText = index
                element.dataset.page = index
                element.onclick = function () {
                    _this.index(index)
                }
                frg.appendChild(element)
                if (this.pageNum == index) {
                    element.classList.add('active')
                }
            }

            // > 4 and < total 区间
        } else {

            // 1
            let first = document.createElement('button')
            first.innerText = 1
            first.dataset.page = 1
            first.onclick = this.first.bind(this)
            frg.appendChild(first)

            // ...
            let ellpsis = document.createElement('button')
            ellpsis.innerText = '...'
            document.createElementss(ellpsis, {
                border: '0px'
            })
            frg.appendChild(ellpsis)

            // prev
            let prev = document.createElement('button')
            prev.innerText = this.pageNum - 1
            prev.dataset.page = this.pageNum - 1
            prev.onclick = this.prev.bind(this)
            frg.appendChild(prev)

            // cur
            let cur = document.createElement('button')
            cur.innerText = this.pageNum
            cur.dataset.page = this.pageNum
            cur.classList.add('active')
            frg.appendChild(cur)

            // next
            let next = document.createElement('button')
            next.innerText = this.pageNum + 1
            next.dataset.page = this.pageNum + 1
            next.onclick = this.next.bind(this)
            frg.appendChild(next)

            // ...
            let copy = ellpsis.cloneNode(true)
            frg.appendChild(copy)

            // total
            let total = document.createElement('button')
            total.innerText = this.options.data.total
            total.dataset.page = this.options.data.total
            total.onclick = this.last.bind(this)
            frg.appendChild(total)

        }

        return frg

    }

    // 创建page节点
    Pages.prototype.createPage = function (params) {
        this.page.innerHTML = ''
        this.page.appendChild(this.firstBtn)
        this.page.appendChild(this.prevBtn)
        this.page.appendChild(this.createBtns())
        this.page.appendChild(this.nextBtn)
        this.page.appendChild(this.lastBtn)
        this.page.appendChild(this.inputBtn)
        this.page.appendChild(this.goBtn)
        this.inputBtn.focus()
    }



})(window, document);
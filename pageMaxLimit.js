// 点击翻页页数最大数限制功能，输入页数的时候也做最大数限制，以及显示效果置灰
/**
 * Created by fozon on 16/10/24.
 */
(function (w, d, $, undefined) {
    //输入页数点击跳转
    function GoPage() {
        this.loca = w.location.href;
        this.goPageId = d.getElementById('goPageId');
        this.maxpage = d.getElementById('maxPage');
        this.goPageBtn = d.getElementById('goPageBtn');
    }
    GoPage.prototype = {
        //创建样式
        init: function () {
            var sty = d.createElement('style'), styHtml = '';
            styHtml += '.goPage{float: right;margin-left: 30px;color: #999;font-size: 14px;display: block!important;}';
            styHtml += '.goPage input{display: inline-block;width: 58px;height: 32px;margin-left: 20px;border: 1px solid #ddd;border-left: 1px solid #ddd;border-radius: 3px 0 0 3px;-webkit-appearance: none;-moz-appearance: none;background-color: #fff;vertical-align: middle;outline: none;}';
            styHtml += '.goPage input[type=button]{height: 34px;margin-left: 0px;border-left: 0px solid #ddd;border-radius: 0 3px 3px 0;background: #3179bc;color: #fff;cursor: pointer;}';
            var body = d.getElementsByTagName('body')[0];
            body.insertBefore(sty, body.childNodes[0]);
            if(sty.styleSheet){
                sty.styleSheet.cssText = styHtml;
            }else{
                sty.innerText = styHtml;
            }
        },
        //点击执行
        clickEvent: function () {
            var goPageId = this.goPageId.value;
            if (!goPageId)return;
            else if (!Number(goPageId) || goPageId > Number(this.maxpage.value)) return;
            if (/(\/p\/)/g.test(this.loca)) {
                var locaResult = /(.*)(\/p\/)/g.exec(this.loca);
                w.location.href = RegExp.$1 + RegExp.$2 + goPageId + '.html';
            } else {
                var locaResult = /(.*)(\.html)/g.exec(this.loca);
                w.location.href = RegExp.$1 + '/p/' + goPageId + RegExp.$2;
            }

        },
        //输入执行
        keyupEvent: function () {
            if (this.goPageId.value > Number(this.maxpage.value)) {
                this.goPageBtn.setAttribute('disabled', 'disabled');
                this.goPageBtn.style.cssText = 'background-color:#ccc;color:#999;';
            } else {
                this.goPageBtn.removeAttribute('disabled');
                this.goPageBtn.style.cssText = '';
            }
        }
    };
    //加载时
    w.onload = function () {
        var goPage = new GoPage();
        if(!goPage.maxpage)return;
        if(!Number(goPage.maxpage.value)){
            goPage.goPageBtn.parentNode.style.display = '';
            return;
        }
        if (goPage.goPageBtn) {
            goPage.init();
            goPage.goPageBtn.onclick = goPage.clickEvent.bind(goPage);
            goPage.goPageId.onkeyup = goPage.keyupEvent.bind(goPage);
        }
    };
})(window, document, jQuery);


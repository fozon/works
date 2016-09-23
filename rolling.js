var InitObj = {
id: 'laohuji', //设置入口
class: 'laohuji',
parentId: 'body'
};

var InitParam = { //设置参数
i: 1,
speed: 50,
state: 0,
namesArry: [ //测试用的假数据
'77747:落十一:/avatar/77747.png',
'77741:付震:/avatar/77737.png',
'77742:白子画:/avatar/77727.png',
'77743:笙箫默:/avatar/77717.png',
'77744:单春秋:/avatar/77707.png',
'77745:夏紫熏:/avatar/77757.png',
'77746:东方彧卿:/avatar/77767.png',
'77748:杀阡陌:/avatar/77777.png',
'77749:花千骨:/avatar/77787.png',
'77737:轻水:/avatar/77797.png',
'77727:糖宝:/avatar/777107.png',
'77728:霓漫天:/avatar/777117.png',
'77729:摩严:/avatar/777127.png'
]
}


//老虎机效果
function LaohujiClass(obj, param) {

var scrollEleUl, animspace, myanim, myNmb, reSult, reSultData, reSultAvatar, _that;
this.obj = obj;
this.param = param;
_that = this;

this._creStyle = function(){
$(this.obj.parentId).append($('<style></style>', {
type: 'text/css', html: '' +
'*{ margin: 0px;padding: 0px;}' +
'.laohuji{width: 356px; height: 450px;font-family: "microsoft yahei";background: url(laohuji_bg.png) no-repeat; position: relative; }' +
'.laohuji .light{width: 100%;height: 100%;position: absolute;right: 0px;top: 0px;background: url(deng.gif) no-repeat;z-index: 1;}' +
'.laohuji .rocker{width: 40px;height: 164px;position: absolute; right: -40px;top: 30%;background: url(rocker.png) no-repeat;transform-origin: 0 80%;transition: all 0.3s;}' +
'.laohuji .rollback{transform: rotateX(180deg); }' +
'.laohuji .title{width: 30%;height: 168px;margin: 0 auto;text-align: center;font-size: 18px;margin-bottom: 40px;color: #fcfcfc; }' +
'.laohuji .title img{width: 70px;height: 70px;border-radius: 500px; display: inline-block; margin-top: 35px;border: 2px solid #efc849; }' +
'.laohuji .title p{ margin-top: 4px;display: inline-block;}' +
'.scrollanimate{width: 310px;height: 126px; margin: 0 auto; text-align: center; overflow: hidden;margin-bottom: 35px;border-radius: 6px;box-shadow: inset 0px 0px 20px #bbb;}' +
'.scrollanimate ul{ display: none;}' +
'.scrollanimate ul li,.scrollanimate .result{list-style-type: none; height: 126px;line-height: 126px;color: #666;font-size: 42px;}' +
'.scrollanimate .result{display: block; }' +
'.laohuji .btn{ text-align: center; margin-top: 10px;position: relative;z-index: 2;}' +
'.laohuji .btn input{width: 300px;height: 62px; border: 0px solid #bbb; border-bottom: 6px solid #c25041;background-color: #e05b4a; font-size: 28px;font-family: "microsoft yahei"; color: #fffbec; border-radius: 6px;cursor: pointer; outline: none;transition: all 0.3s; }' +
'.laohuji .btn input:hover:not(.disabled){background-color: #e0664a;transform: scaleX(1.02);}' +
'.laohuji .btn input.disabled{background-color: #999;border-bottom: 6px solid #777; color: #ddd;}' +
'.laohuji .btn input.disabled:hover{cursor: no-drop;}'
}));
this._creDom();
}


this._creDom = function () {
$(this.obj.parentId).append($('<div></div>', {
id: this.obj.id, class: this.obj.id, html: '<div class="rocker"></div>'
+ '<div class="light"></div>'
+ '<div class="title">'
+ '<img src="laohuji_bg.png">'
+ '<p>准备开始</p>'
+ '</div>'
+ '<div class="scrollanimate" id="scrollanimate">'
+ '<div class="result">准备开始</div>'
+ '<ul>'
+ '</ul>'
+ '</div>'
+ '<div class="btn">'
+ '<input type="button" name="" id="confirm" value="开 始" />'
+ '</div>'
//<input type="button" name="" id="cancle" value="停止" />
}));
this._creListDom();
}

//拿数据创建dom节点
this._creListDom = function () {
scrollEleUl = $('#scrollanimate');
for (var i = 0; i < this.param.namesArry.length; i++) {
var curDatas = this.param.namesArry[i].split(':');
var $curLi = $("<li></li>");
$($curLi).attr('id', curDatas[0]);
$($curLi).text(curDatas[1]);
$(scrollEleUl).children('ul').append($curLi);
}
this._bindClickEvent();
}


//动画过程
this._anim = function () {

animspace = $(scrollEleUl).height();

//动画效果 就是个假象，@#￥%……
$(scrollEleUl).children('.result').hide().siblings('ul').show().animate({'margin-top': -animspace + 'px'}, _that.param.speed, function () {
$(this).css('margin-top', '0px');
$(this).children().first().appendTo(this);
})

if (_that.param.state == 0) {
_that.param.i++;
if(_that.param.i > 20){
_that.param.state = 1;
}
} else {
_that.param.i--;
if (_that.param.i == 0) {
_that.param.state = 0;
_that._stopAni();
}
}

}

//输出结果
this._result = function () {
$(scrollEleUl).children('.result').show().text(reSult).siblings('ul').hide();
$('#' + this.obj.id).find('.title').children('p').text(reSult);
$('#' + this.obj.id).find('.title').children('img').attr('src', reSultAvatar);
$('#confirm').removeAttr('disabled');
$('#confirm').removeClass('disabled');
$('.' + this.obj.class + ' .rocker').removeClass('rollback');
}

//开始循环
this._startAni = function () {
myanim = setInterval(this._anim, this.param.speed);
}

//停止循环
this._stopAni = function () {
clearInterval(myanim);
this._result();
}

//冥冥之中，早有定数！
this._bindClickEvent = function () {
$('#confirm').on('click', function () {
$(this).attr('disabled', 'true');
$(this).addClass('disabled');
$('.' + _that.obj.class + ' .rocker').addClass('rollback');
myNmb = Math.floor(Math.random() * _that.param.namesArry.length);
reSultData = _that.param.namesArry[myNmb].split(':');
reSult = reSultData[1];
reSultAvatar = reSultData[2];
_that._startAni();
})
//老虎机能手控停止吗？能吗？能吗？能吗？或许能？我就不让你点
$('#cancle').on('click', function () {
_that.param.state = 1;
_that._stopAni();
})
}
}

function Laohuji(obj,param){
LaohujiClass.apply(this,[obj,param]);
this._run = function(){
this._creStyle();
}
}

var laohuji = new Laohuji(InitObj, InitParam);
laohuji._run();
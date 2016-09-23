# fojquery.js
fojquery一个类似于jQuery框架的简单的demo.

//调用方法

$fo('li').each(function(){

  $fo(this).click(function(){
  
    $fo(this).addClass('color').attr('title','hello').siblings().removeClass('color').removeAttr('title')
    
  })
  
})

# wordRolling.js
wordRolling是一个数字滚动插件，目前依赖于jQuery，后期优化为原生

//调用方法

wordRolling({

	word : 1000000,	//字符
	id: ‘wordRolling’, //设定控件
	width : 1000,	//宽度
	height :  300,	//高度
	flag : 1	//是否逗号分隔开关

})

# rolling.js
rolling是一个面向对象程序设计的老虎机效果

//调用方法

var laohuji = new Laohuji(InitObj, InitParam);
laohuji._run();

//设置参数

var InitObj = {
id: 'laohuji', //控件入口
class: 'laohuji',
parentId: 'body'
};

var InitParam = { //设置参数
i: 1,
speed: 50,
state: 0,
namesArry: [ //api
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

# limitLen.js
limitLen设定几行文字出现省略号，同时还可以查找指定元素节点

//调用方法

personReason('li',2,'span');  // obj为文本对象的父级  line为限制几行出现省略号  more为展开的元素设定


# selectText.js
selectText.js选中左边文字，获取整句，右边根据整句自动定位

//调用方法

new SelectTextPostion('a1','showresult'); //选择区ID，滚动ID样式名

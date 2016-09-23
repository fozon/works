# works
fojquery一个类似于jQuery框架的简单的demo.

//调用方法

$fo('li').each(function(){

  $fo(this).click(function(){
  
    $fo(this).addClass('color').attr('title','hello').siblings().removeClass('color').removeAttr('title')
    
  })
  
})

wordRolling是一个数字滚动插件，目前依赖于jQuery，后期优化为原生

//调用方法

wordRolling({

	word : 1000000,	//字符
	id: ‘wordRolling’, //设定控件
	width : 1000,	//宽度
	height :  300,	//高度
	flag : 1	//是否逗号分隔开关

})
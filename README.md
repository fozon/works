# works
fojquery一个类似于jQuery框架的简单的demo.

//调用方法

$fo('li').each(function(){

  $(this).click(function(){
  
    $(this).addClass('color').attr('title','hello').siblings().removeClass('color').removeAttr('title')
    
  })
  
})

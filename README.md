# drageCell.js
拖拽单元格插件

//调用方法

// 默认加载接口
var dc = new DragCell({
    data: api,
    id: '#table',
    dragable: true,
    options: {
        // 传进来的患者id
        patientId: '999',
        // 诊室id
        orderWaitRoom: '100',
        name: '哈哈'
    }
})

// 暴露打包方法
document.querySelector('#ok').onclick = function (params) {
    // render为返回打包的json数据
    var render = dc.renderArray;
    document.querySelector('#result').innerHTML = JSON.stringify(render);
}

// 更新数据方法 用于ajax翻页后
document.querySelector('#update').onclick = function (params) {
    return
    dc && dc.update({
        data: api2,
        id: '#table',
        dragable: true
    })
}

# pageMaxLimit.js
原生点击翻页页数最大数限制功能，输入页数的时候也做最大数限制，以及显示效果置灰

//调用方法

w.onload = function () {

        var goPage = new GoPage();

        if (goPage.goPageBtn) {

            goPage.init();

            goPage.goPageBtn.onclick = goPage.clickEvent.bind(goPage);

            goPage.goPageId.onkeyup = goPage.keyupEvent.bind(goPage);

        }

    };

    

# myPlugins.js
myPlugins自己整合的一个自己日常使用的插件集合，日后还会完善，目前部分动画还依赖JQ

//调用方法

myPlugins.方法名();

# foQuery.js
foQuery一个类似于jQuery框架的简单demo,主要是展现面向对象的实现模式.

//自定义插件调用方法

$f.fn.text() = function(){
	console.log($fo(this));
}

//调用方法

$fo('li').each(function(){

  $fo(this).click(function(){
  
    $fo(this).addClass('color').attr('title','hello').siblings().removeClass('color').removeAttr('title');
    
  })
  
})

# rolling.js
rolling是一个面向对象程序设计的老虎机效果

//调用方法

var laohuji = new Laohuji({

id: 'laohuji', //控件入口
class: 'laohuji',
parentId: 'body'

},{

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

});

laohuji._run();

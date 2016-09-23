//展示数字及字符翻滚效果
function numberRolling(param) {
    this.num = param.number || 10000000;//传入用户设定的数值,如果没有使用默认
    this.id = param.id || 'number_rolling'; //是否指定控件，否则为默认控件
    this.flag = param.flag; //是否使用逗号分割模式
    this.width = param.width || 'auto'; //宽度默认自动
    this.height = param.height || 36;  //高度默认36
    _shelf = this;
    if(this.flag){
        this.num = this.num.toString().replace(/(?!^)(\d{3})(?=(?:\d{3})*$)/g,',$1'); //三个数字加一个逗号
    }
    this.num = this.num.toString();
    var nums = this.num.split(''),
        numsLen = nums.length,
        liLen = 10,
        rol = document.getElementById(this.id),
        uls = [],
        index = 0;//动画加速度初始化

    //创建单元格 li
    function creLi(param, str) {
        var curLiLen = param || liLen,
            lis = [],
            strValue = str || '.';
        for (var i = 0, j = 0; i < curLiLen; i++) {
            lis[j] = document.createElement('li');
            if (!str) {
                lis[j].innerText = i;
            } else {
                lis[j].innerText = strValue;
            }
            j++;
        }
        return lis;
    }

    //创建列 ul,追加 li
    for (var i = 0; i < numsLen; i++) {
        uls[i] = document.createElement('ul');
        var cfLi = document.createDocumentFragment();
        if (nums[i] == ',') {
            cfLi.appendChild(creLi(1, ',')[0]);
        } else {
            for (var j = 0; j < liLen; j++) {
                cfLi.appendChild(creLi()[j]);
            }
        }

        uls[i].appendChild(cfLi);
    }

    //ul虚拟节点
    var cfUl = document.createDocumentFragment();
    for (var i = 0; i < numsLen; i++) {
        cfUl.appendChild(uls[i]);
    }

    //追加到指定的控件中
    rol.innerHTML = '';
    rol.appendChild(cfUl);
    rol.style.cssText = 'width:'+ this.width + ';height:' + this.height + 'px;overflow:hidden;';

    //遍历每一个 ul 并指定动画效果
    setTimeout(function () {
        $(uls).each(function () {
            var _that = this;
            $(_that).css('position', 'relative');
            (function (index) {
                setTimeout(function () {
                    $(_that).animate({'top': -_shelf.height * parseInt(nums[index])}, 1000, function () {
                    });
                }, 100 * index);
            })(index);
            index++;
        });
    }, 1000);

}
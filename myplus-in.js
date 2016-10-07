;(function (w, doc, $, undefined) {

	var MyplusIn = function (param) {
		this.param = param || {};
	};

	MyplusIn.prototype = {

		//限制字符显示更多
		limitLen: function doLimitLen(obj,line,more){ 
			var _this = obj,
				elesize = document.defaultView.getComputedStyle(_this).fontSize || _this.currentStyle.fontSize, //兼容浏览器
				limitCount = parseInt(_this.offsetWidth/parseInt(elesize))*line,
				text = findChild(_this)?findChild(_this).textContent:'',
				textstate ;
		 		//查找子元素
		 		function findChild(obj,str){
		 			var i = 0,state=0,strv;
		 			str?strv=str:strv='';
		 			switch(strv){
		 				case 'text':case '':
		 				state = 3;
		 				break;
		 				default:
		 				state = 1;
		 				break;
		 			}
		 			for(var i=0;i<obj.childNodes.length;i++){
		 				if(state == 1){
		 					if(obj.childNodes[i].nodeType == state){
		 						if(obj.childNodes[i].tagName.toLowerCase()==str){
		 							return obj.childNodes[i];
		 						};
		 					}
		 				}else if(state == 3){
		 					if(obj.childNodes[i].nodeType == state){
		 						return obj.childNodes[i];
		 					}
		 				}
		 			}
		 		}
			//判断text是否全部为空字符串
			for(var i in text){  
				if(text[i]!=' '){
					textstate = true;
					break;
				}else{
					textstate = false;
				}
			}
			//text如果全部为空字符串则隐藏
			if(!textstate){    
				obj.style.display='none';
				return;
			}else{
				obj.style.display='block';
			}
			if(text.length>=limitCount){
				findChild(_this).textContent = text.substr(0,limitCount-3)+'...';
				findChild(_this,more).style.display = "inline";
			}else{
				findChild(_this).textContent = text;
				findChild(_this,more).style.display = "none";
			}
			findChild(_this,more).onclick = function(){
				if(this.innerText != '收起'){
					this.innerText = '收起';
					findChild(_this).textContent = text;
				}else{
					this.innerText = '展开';
					findChild(_this).textContent = text.substr(0,limitCount-3)+'...';
				}
			}
		},

		//选中左边文字定位右边内容
		selectTextPos: function doSelectTextPostion(select,iscontrl){
			var text = document.getElementById(select),
			contrl = document.getElementById(iscontrl),
			subt = text.value,
			newsubt;
			text.onmouseup = function(){
				var diffvalue = text.selectionStart - text.selectionEnd;
				if(diffvalue){
					findPos(text.selectionStart);
				}
			}
			function findPos(pos){
				var ar = ['.','!','?'],arc=[-1];
				for(var i=0;i<ar.length;i++){
					var index=0;
					for(var j=0;j<subt.length;j++){
						if(subt[j] == ar[i]){
							arc.push(subt.indexOf(subt[j],index+1));
							index = subt.indexOf(subt[j]);
						}
					}
				}
				arc.sort();
				for(var i=0;i<arc.length;i++){
					if(arc[i]<pos && pos<arc[i+1]){
						newsubt = subt.substr(arc[i]+1,arc[i+1]-arc[i]-1);
						console.log(newsubt);
						break;
					}
				}
				var sele = document.querySelectorAll('.'+iscontrl+' span');
				for(var i=0;i<sele.length;i++){
					if(sele[i].innerText.indexOf(newsubt)>-1){
						contrl.scrollTop = sele[i].offsetTop-contrl.offsetTop;
						break;
					}
				}
			}
		},	

        //检测邮箱地址是否正常
        isEmail: function doIsEmail(str) {
        	var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        	return reg.test(str);
        },

        //计算中间内容的自动高度居中
        autoHeight: function doAutoHeight(cur) {
        	var log = $('.' + cur), winHeight = $(w).height(), logHeight = $(log).outerHeight(true), bodyHeight = $('body').outerHeight(true);
            if (winHeight > logHeight + 58 + 60 + 50) {  //58为头部高度，60为底部高度，50手动设定的最小高度，为了体验
            	$(log).css({
            		'margin-top': (winHeight - logHeight) / 2 - 58,
            		'margin-bottom': (winHeight - logHeight) / 2 - 58
            	});
            } else {
            	$(log).css({'margin-top': bodyHeight / 3 - 58, 'margin-bottom': bodyHeight / 3 - 58});
            }
        },

        //兼容ie8模拟placeholder
        checkPlaceholder: function doCheckplaceholder() {
        	$('input[placeholder],textarea[placeholder]').each(function () {
        		var _this = $(this),
        		text = _this.attr('placeholder'),
        		siblings = _this.next('input[type=text]'),
        		oldText = '';
        		if (!_this.val()) {
        			_this.addClass('placeholder').val(text);
        			if (_this.attr('id') == 'password' || _this.attr('id') == 'repassword') {
        				siblings.show().css('color', '#999');
        				;
        				_this.hide();
        				_this.on({
                            // 'keyup': function () {
                            //     if (!_this.val()) {
                            //         _this.hide();
                            //         siblings.show();
                            //     }
                            // },
                            'blur': function () {
                            	if (!_this.val()) {
                            		siblings.show();
                            		_this.hide();
                            	}
                            }
                        });
        				siblings.on('focus', function () {
        					$(this).hide();
        					_this.show().focus();


        				});
        			}
        		}
        		_this.on({
        			'focus': function () {
        				if (_this.val() == text) {
        					oldText = _this.val();
        					_this.val("").attr('placeholder', '');
        				}
        				_this.css('color', '#333');
        			},
        			'blur': function () {
        				if (!_this.val()) {
        					_this.val(oldText).attr('placeholder', text);
        					;
        				}
        				_this.css('color', '#999');
        			}
        		});

        	})
        },
        //展示数字及字符翻滚效果
        numberRolling: function (param) {
            this.num = param.number || 10000000;//传入用户设定的数值,如果没有使用默认
            this.id = param.id || 'number_rolling'; //是否指定控件，否则为默认控件
            this.flag = param.flag; //是否使用逗号分割模式
            this.width = param.width || 'auto'; //宽度默认自动
            this.height = param.height || 36;  //高度默认36
            _shelf = this;
            if (this.flag) {
                this.num = this.num.toString().replace(/(?!^)(\d{3})(?=(?:\d{3})*$)/g, ',$1'); //三个数字加一个逗号
            }
            this.num = this.num.toString();
            var nums = this.num.split(''),
            numsLen = nums.length,
            liLen = 10,
            rol = doc.getElementById(this.id),
            uls = [],
                index = 0;//动画加速度初始化

            //创建单元格 li
            function creLi(param, str) {
            	var curLiLen = param || liLen,
            	lis = [],
            	strValue = str || '.';
            	for (var i = 0, j = 0; i < curLiLen; i++) {
            		lis[j] = doc.createElement('li');
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
            	uls[i] = doc.createElement('ul');
            	var cfLi = doc.createDocumentFragment();
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
            var cfUl = doc.createDocumentFragment();
            for (var i = 0; i < numsLen; i++) {
            	cfUl.appendChild(uls[i]);
            }

            //追加到指定的控件中
            rol.innerHTML = '';
            rol.appendChild(cfUl);
            rol.style.cssText = 'width:' + this.width + ';height:' + this.height + 'px;overflow:hidden;';

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

    };

    window.myplusIn = new MyplusIn();

})(window, document, jQuery);
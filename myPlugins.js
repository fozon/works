/**
 * Created by fuzhen on 16/9/7.
 * 此插件集成了以下功能：
 * 1、邮箱、账号、手机号，非空及格式校验
 * 2、模拟placeholder兼容ie9以下
 * 3、select选择切换时的选中高亮显示效果
 * 4、canvas画圆，显示百分比圆
 * 5、初始化00000到具体数字及字符的有序翻滚动画效果
 * 6、选项前后比较大小校验，以及submit时校验
 * 7、获取cookie
 * 8、设置cookie
 * 9、勾选记住账号
 * 10、底部跟随 or 固定
 * 11、关键词标红
 */
;(function (w, doc, $, undefined) {

	function MyPlugins(param) {
		this.param = param || {};
		this.init();
	}

	MyPlugins.prototype = {
		/*
		 * 初始化
		 * */
		init: function () {
			Array.prototype.forEach = function (callback, index) {
			};
		},
		//检测邮箱地址是否正常
		isEmail: function doIsEmail(str) {
			var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
			return reg.test(str);
		},

		isCheck: function (param) {
			var par = param || '';
			switch (par) {
				case '':
					var reg = /(^\s*)(\s)*(\s*$)/g;
					break;
				case 'email':
					var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g;
					break;
				case 'username':
					var reg = /^[1][\d]{10}$|^([\w.])+@([\w])+(\.[a-zA-Z]+)+$/g;
					break;
			}
			function Checks() {
			}

			Checks.prototype.test = function (str) {
				var str = str || '';
				return reg.test(str);
			}
			return new Checks();
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
		//用户名为手机号格式或者是邮箱格式，以及为空时
		isCheckUsername: function doisCheckUsername(str, state) {
			if (state) {
				// return /^[1][\d]{10}$|^([\w.])+@([\w])+(\.[a-zA-Z]+)+$/.test(str);
				return /^(1)[35789](\d){9}|^(.*)+@(.*)+(.*)+$/.test(str);
			} else {
				return /(^\s*)(\s)*(\s*$)/.test(str);
			}
		},
		//兼容ie8模拟placeholder
		checkPlaceholder: function doCheckplaceholder() {
			var _this, next, placeholderText, curPlaceholderText, isPlaceHolder = true;
			if (!('placeholder' in document.createElement('input'))) {
				isPlaceHolder = false;
			}
			$('input[placeholder],textarea[placeholder]').each(function () {
				//不支持placeholder 考虑默认文字
				if (!isPlaceHolder) {
					_this = $(this);
					if (!_this.val()) {
						placeholderText = _this.attr('placeholder');
						_this.val(placeholderText).css('color', '#bbb');
					}
					var events = {
						'focus.place': function () {
							curPlaceholderText = $(this).attr('placeholder');
							if ($(this).val() == curPlaceholderText) {
								$(this).val('');
							}
							$(this).css('color', '#333');
						},
						'blur.place': function () {
							curPlaceholderText = $(this).attr('placeholder');
							if (!$(this).val()) {
								$(this).val(curPlaceholderText);
							}
							$(this).css('color', '#bbb');
							if ($(this)[0].type == 'password' && !$(this).val()) {
								$(this).hide().next().show();
							}
						}
					}
					_this.on ? _this.on(events) : _this.bind(events);
				} else {
					_this = $(this);
					//支持placeholder 不用考虑默认文字
					if (_this[0].type == 'password') {
						var events = {
							'blur': function () {
								if (!$(this).val()) {
									$(this).hide().next().show();
								}
							}

						}
						_this.on ? _this.on(events) : _this.bind(events);
					}
				}

				//所有的密码文字显示，只能模拟显示
				if (_this[0].type == 'password') {
					if (_this.val() && _this.val() != _this.attr('placeholder')) {
						_this.show();
						_this.next().hide();
					} else {
						var that = _this;
						next = _this.next().css('color', '#bbb');
						var passwordEvent = {
							'focus': function () {
								that.show().focus();
								next.hide();
							}
						}
						next.on ? next.on(passwordEvent) : next.bind(passwordEvent);
					}
				}


			});

		},
		//select切换
		selectedStyle: function doSelectStyle() {
			var not;
			if (arguments[0] && typeof arguments[0] == 'string' && (not = document.getElementById(arguments[0]))) {
			}//ID，过滤指定select对象
			else if (Object.prototype.toString.call(arguments[0]) == '[object Object]') { //OBJ，指定的select单独调用方法
				selectedStyle(arguments[0]);
				return;
			}

			var selects = document.getElementsByTagName('select');

			function selectedStyle(obj) {
				if (!obj.selectedIndex) {
					obj.style.cssText = obj.style.cssText + ';color:#bbb';
				} else {
					obj.style.cssText = obj.style.cssText + ';color:#000';
				}
			}

			for (var i = 0, j; j = selects[i++];) {
				selectedStyle(j);
				if (not && j === not) {
					continue;
				}
				(function (j) {
					if (j.onchange) {
						j.onchange = null;
					}
					j.onchange = function () {
						selectedStyle(this);
					}
				})(j)
			}
		},
		//圆圈读取效果
		strokeArcFun: function doStrokeArcFun() { //4个参数，第一个id，第二个百分比，第三个圆的背景色，第四个圆的边框色
			if (typeof arguments[0] != 'object')return;
			var params = arguments[0];
			var _that = this;
			for (var i in params) {
				this[i] = params[i];
			}
			var numStart = 1.5, numEnd = 1.5, numMax = this.percent / 100 * 2 - .5 >= 0 ? this.percent / 100 * 2 - .5 : this.percent / 100 * 2 + 1.5;
			(function strokeArc() {
				var c = document.getElementById(_that.id);
				var ctx = c.getContext("2d");
				ctx.font = '14px Microsoft Yahei';
				ctx.beginPath();
				ctx.strokeStyle = _that.bgColor;
				ctx.lineWidth = _that.lineWidth || 5;
				ctx.arc(_that.left, _that.top, 49, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = _that.fontColor;
				ctx.strokeStyle = _that.lineColor;
				ctx.lineWidth = this.lineWidth;
				if (_that.percent >= 100) {
					ctx.arc(_that.left, _that.top, 70, 0, 2 * Math.PI, false);
					ctx.stroke();
					ctx.fillText(_that.percent + '%', 20, 85);
					return;
				}
				ctx.arc(_that.left, _that.top, 49, numStart * Math.PI, numMax * Math.PI);
				ctx.stroke();
				ctx.fillText(_that.percent + '%', _that.textX, 60);
			})(numEnd);
		},
		//展示数字及字符翻滚效果
		numberRolling: function (param) {
			if (typeof param != 'object')return;
			var par = {};
			par.num = param.number || 10000000;//传入用户设定的数值,如果没有使用默认
			par.id = param.id || 'number_rolling'; //是否指定控件，否则为默认控件
			par.flag = param.flag; //是否使用逗号分割模式
			par.width = param.width || 'auto'; //宽度默认自动
			par.height = param.height || 36;  //高度默认36
			var _shelf = par;
			if (par.flag) {
				par.num = par.num.toString().replace(/(?!^)(\d{3})(?=(?:\d{3})*$)/g, ',$1'); //三个数字加一个逗号
			}
			par.num = par.num.toString();
			var nums = par.num.split(''),
				numsLen = nums.length,
				liLen = 10,
				rol = doc.getElementById(par.id),
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
			rol.style.cssText = 'width:' + par.width + ';height:' + par.height + 'px;overflow:hidden;';

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

		},
		/*前后比较大小校验
		 * complist参数是对象或者对象数组 例如：
		 * [{
		 * 'first':$('#ageForm'),
		 * 'last':$('#ageTo'),
		 * 'name':'年龄' //主要是弹出提示来用的文案
		 * }]
		 * first是第一个对象，last最后一个对象，name是比较对象名字
		 * */
		compareValue: function (complist) {
			var _this = this;
			if (typeof complist === 'object' && Object.prototype.toString.call(complist) !== '[object Array]') {
				complist = Array.prototype.slice.call(arguments, 0)
			}
			if (complist.length < 1) {
				return false
			}
			list:for (var i = 0, len = complist.length; i < len; i++) {
				(function (i) {
					var j = complist[i],
						first = j.first && j.first[0] || {},
						last = j.last && j.last[0] || {};

					if (first.onchange) {
						first.onchange = null;
					}
					first.onchange = compareResult;
					if (last.onchange) {
						last.onchange = null;
					}
					last.onchange = compareResult;
					function compareResult() {
						if (first.value - 0 > last.value - 0 && last.value - 0) {
							alert('请确保' + j.name + '结束值大于起始值！', i);
							_this.param.result = false;
						} else {
							_this.param.result = true;
						}
					}

					compareResult();
				})(i);
				if (!_this.param.result) {
					break;
				}
			}
			return {
				//事件用来校验判断的方法
				checkComp: function () {
					return _this.param.result;
				}
			}
		},
		//获取cookie
		getCookie: function (name) {
			if (!name || typeof name != 'string')return false;
			var ck = document.cookie;
			var pattern = new RegExp('' + name + '=([\\w@.,%]+)[;]*', 'gi'), arr;
			if (arr = pattern.exec(ck))return RegExp.$1;
			else return null;
		},
		/*设置cookie
		 * param为对象字段{}
		 * 分别为三个属性：name，value，overdue（过期时间）
		 * */
		setCookie: function (param) {
			var param = param && (Object.prototype.toString.call(param) === '[object Object]')?param:{};
			var time = new Date();
			time.setTime(time.getTime() + param.overdue);
			document.cookie = param.name + "=" + escape(param.value) + ";expires=" + time.toGMTString()+";Path=/";
		},
		//记住账号
		/*
		 * 参数:
		 * 1、id: 表单form的id，如果不写则通过全局document查找,
		 * 2、username: form表单下对应的需要记住帐号input元素的name名(可以自定义)，
		 * 3、overdue: 自定义过期时间，如果没有则默认
		 * 两个方法:
		 * 1、set()在表单提交时设置cookie
		 * 2、get()在页面加载时读取cookie
		 * */
		rememberAccount: function (id, username) {
			var _this = this, id = id, username = username;

			function RememberAccountClass() {
				this.form = document.getElementById(id) || document || {},
					this.username = this.form.querySelector('input[name=' + (username ? username : 'username') + ']'),
					this.cookieName = 'isremember';
			};
			RememberAccountClass.prototype = {
				constructor: RememberAccountClass,
				get: function () {
					var hasAccount = _this.getCookie(this.cookieName);
					if (hasAccount) {
						this.username.value = hasAccount;
					}
				},
				set: function (overdue) {
					var par = {
						name: this.cookieName,
						value: this.username.value,
						overdue: overdue || 7 * 24 * 60 * 60 * 1000
					};
					_this.setCookie(par);
				}
			};
			return new RememberAccountClass();
		},
		/*
		 * 底部固定or跟随
		 * footer参数手动指定footer的classname，没有则默认
		 * */
		footerAutoFixed: function (footer) {
			var winHe = doc.documentElement.clientHeight,
				bodyHe = doc.getElementsByTagName('body')[0].offsetHeight,
				footer = doc.getElementsByClassName(footer || 'footer')[0];
			if (bodyHe < winHe) {
				footer.style.position = 'fixed';
			} else {
				footer.style.position = 'relative';
			}
		},
		/*
		 * 标红
		 * 三个参数：
		 * 第一个要遍历的列表tr或者div，第二个标红的关键词，第三个关键词的父级元素（如果不指定父级，整个正则替换会影响到img，a，input）
		 * */
		selectMarked: function (list, key, parent) {
			var list = list, key = key, parent = parent;
			key = key.indexOf('+')>-1?key.replace(/\+/g,'\\+'):key;
			for (var i = 0, len = list.length; i < len; i++) {
				if (i < 1) {
					continue;
				}
				var cur = list[i];
				if (!(i % 2)) {
					var div = typeof parent == 'string' ? cur.querySelectorAll(parent) : '';
					listDiv(div);
				} else {
					var div = cur.querySelectorAll('div');
					listDiv(div);
				}
			}
			function listDiv(div) {
				for (var j = 0, len2 = div.length; j < len2; j++) {
					var _this = div[j];
					result(_this);
				}
			}
			function result(obj) {
				obj.innerHTML = obj.innerHTML.replace(eval('\/' + key + '\/gi'), function (text) {
					return '<b style="color:#f00;font-weight: normal;">' + text + '</b>';
				});
			}
		}
	};

	w.myPlugins = new MyPlugins();

})(window, document, (function ($) {
	return $ || {};
})(jQuery));

;(function(w,doc,undefined){
	var $f = function(){
		this.fn = {};
	};
	w.$f = new $f();
	var $fo = function(a){
		var fo = {};
		fo.FoProtoFun = function(){
			this.deepCopy = function(target){
				if(typeof target != 'object'){
					return target;	
				}
				for(var i in target){
					this[i] = this.deepCopy(target[i]);
				}
			};
			this.findele = function(eles){
				var arr = [];
				for(var i=0,j=0;i<eles.length;i++){
					if(eles[i].nodeType == 1){
						arr[j++] = eles[i];
					}
				}
				return arr;
			};

			this.deepCopy(w.$f);
			return this;
		};
		
		fo.FoProtoFun.prototype = {	
			each : function(a){
				if(!a)return;
				var arr = this.findele(this);
				for(var i=0;i<arr.length;i++){
					arr[i].fn = a;
					var result = arr[i].fn();
					if(result==true){
						continue;
					}else if(result==false){
						break;
					};
				}
			},
			addClass : function(a){
				if(!a)return;
				if(!this.length)return;
				for(var i=0;i<this.length;i++){
					if(this[i].className.indexOf(a)<0) {
						this[i].className = this[i].className?this[i].className + ' ' + a:a;
					}
				}

				return this;
			},
			removeClass : function(a){
				if(!a)return;
				try{
					if(this.length){
						for(var i=0;i<this.length;i++){
							if(!this[i].className){
								continue;
							}else if(this[i].className.indexOf(a)>-1){
								this[i].className = this[i].className.replace(eval("/([\\s]*"+ a +")/"),'');
							}
						}
					}
				}catch(e){
					return;
				}
				return this;
			},
			attr : function(a,b){
				this[0].setAttribute(a,b);
				return this;
			},
			removeAttr : function(a){
				if(this.length>1){
					for(var i=0;i<this.length;i++){
						if(!this[i].hasAttribute(a)){
							continue;
						}
						this[i].removeAttribute(a);
					}
				}else{
					this[0].removeAttribute(a);
				}
				return this;
			},
			click : function(a){
				if(!a)return;
				for(var i=0;i<this.length;i++){
					this[i].onclick = function(){
						this.fn = a;
						this.fn();
					}
				}
			},
			siblings : function(a){
				var eleo=[],newarr=[],_this;
				var arr = this.findele(this[0].parentNode.childNodes);
				for(var i=0,j=0;i<arr.length;i++){
					if(arr[i]==this[0]){
						continue;
					}
					newarr[j++]=arr[i];
				}
				if(a && a!=''){
					for(var i=0,j=0;i<newarr.length;i++){
						if(newarr[i].className.indexOf(a.split('.')[1])>-1){
							eleo[j++] = newarr[i];
						}else if(newarr[i].id.indexOf(a.split('#')[1])>-1){
							eleo = newarr[i];
							break;
						}else if(newarr[i].tagName.indexOf(a.toUpperCase())>-1){
							eleo[j++] = newarr[i];
						}else{
							continue;
						}
					}
					_this = eleo;
				}else{
					_this = newarr;
				}
				return fo.FoEleArr(_this);
			},
			one : function(a,b){
				if(!b)return;
				switch(a){
					case 'click':
					for(var i=0;i<this.length;i++){
						this.click(b);
					}
					break;
				}
			}
		}

		fo.FoEleArr = function(a){

		    if(typeof a == 'string'){
		    	if(!doc.querySelector(a))throw new Error(a+' is not found!');
		    };

			var arr = [],
			_this = typeof a == 'string' && a !='' ? doc.querySelectorAll(a):a,
			thisArr = toArr(_this);
			function toArr(arr){
				var eleArr = [];
				if(arr.length){
					eleArr = Array.prototype.slice.call(arr);
				}else{
					eleArr.push(arr);
				}
				return eleArr;
			}
			for(var i in thisArr){
				arr[i]=thisArr[i];
			}

			arr.context = doc;
			arr.selector = a;

			Object.setPrototypeOf(arr,new fo.FoProtoFun());

			return arr;
		}
		fo.FoEleArr.constructor = fo.FoEleArr;
		return new fo.FoEleArr(a);
	};
	window.$fo = $fo;
})(window,document)


e if(typeof $f != "object")
throw new Error('$f already exists and is not object');

if(!$f.fn)$f.fn = {};
else if(typeof $f.fn != "object")
throw new Error('$f.fn already exists and is not object');

var $fo;
if(!$fo)$fo = function(a){
var fo = {};
fo.FoProtoFun = function(){
var findele = function(eles){
var arr = [];
for(var i=0,j=0;i<eles.length;i++){
if(eles[i].nodeType == 1){
arr[j++] = eles[i];
}
}
return arr;
};
this.each = function(a){
if(!a)return;
var arr = findele(this);
for(var i=0;i<arr.length;i++){
arr[i].fn = a;
var result = arr[i].fn();
if(result==true){
continue;
}else if(result==false){
break;
};
}
};
this.addClass = function(a){
if(!a)return;
if(this.length){
for(var i=0;i<this.length;i++){
if(this[i].className.indexOf(a)<0) {
this[i].className = this[i].className + ' ' + a;
}
}
}else{
if(this.className.indexOf(a)<0){
this.className = this.className + ' ' + a;
}
}
return this;
};
this.removeClass = function(a){
if(!a)return;
try{
if(this.length){
for(var i=0;i<this.length;i++){
if(!this[i].className){
continue;
}else if(this[i].className==''){
continue;
}else if(this[i].className.indexOf(' '+a)>-1){
this[i].className = this[i].className.replace(' '+a,'');
}else if(this[i].className.indexOf(a)>-1){
this[i].className = this[i].className.replace(a,'');
}
}
}
}catch(e){
return;
}
return this;
};
this.attr = function(a,b){
this[0].setAttribute(a,b);
return this;
};
this.removeAttr = function(a){
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
};
this.click = function(a){
if(!a)return;
for(var i=0;i<this.length;i++){
this[i].onclick = function(){
this.fn = a;
this.fn();
}
}
};
this.siblings = function(a){
var eleo=[],newarr=[],_this;
var arr = findele(this[0].parentNode.childNodes);
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
};
this.one = function(a,b){
if(!b)return;
switch(a){
case 'click':
for(var i=0;i<this.length;i++){
this.click(b);
}
break;
}
}
return this;
};
fo.FoEleArr = function(a,b){
var arr = [],
_this = typeof a == 'string' && a !='' ? document.querySelectorAll(a):a,
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
fo.FoProtoFun.prototype = $f.fn;
fo.FoProtoFun.constructor = fo.FoProtoFun;
arr.context = document;
arr.selector = a;
Object.setPrototypeOf(arr,new fo.FoProtoFun());
return arr;
}
fo.FoEleArr.constructor = fo.FoEleArr;
return new fo.FoEleArr(a);
};
else if(typeof $fo != 'function')
throw new Error("$fo already exists and is not function");

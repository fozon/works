function findChild(obj,str){ //查找子元素
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
if(state == 1){ //设置了你要查找的元素
if(obj.childNodes[i].nodeType == state){
if(obj.childNodes[i].tagName.toLowerCase()==str){
return obj.childNodes[i];
};
}
}else if(state == 3){ //默认查找的text元素
if(obj.childNodes[i].nodeType == state){
return obj.childNodes[i];
}
}
};
}

function personReason(obj,line,more){ 
var _this = obj,
elesize = document.defaultView.getComputedStyle(_this).fontSize || _this.currentStyle.fontSize, //兼容浏览器
limitCount = parseInt(_this.offsetWidth/parseInt(elesize))*line,
text = findChild(_this)?findChild(_this).textContent:'',
textstate ;

for(var i in text){  //判断text是否全部为空字符串
if(text[i]!=' '){
textstate = true;
break;
}else{
textstate = false;
}
}

if(!textstate){    //text如果全部为空字符串则隐藏
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
}
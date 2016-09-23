function SelectTextPostion(select,iscontrl){
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
}
let path=require('path');
let fs=require('fs');
const render=require('../render.json'); 
const config=require('../config.json');
const reg_id=/^(#|\.)(\s*)?(\S+)/;
const temp=/{{(.*)?}}/;
const ur=path.normalize(`${__dirname}/..`);
let _data='';
(function(){
	_data=fs.readFileSync(`${ur}${config.fs.them}${config.temp}`,'utf-8').replace(/\r\n/g,"");
})();
//const reg_class=/^\.(\s*)?(\S+)/;
let tem=[];
tem.id=[];
tem.class=[];
let clas=[];
let id=[];
for (dom in render) {
	let _dom=reg_id.exec(dom);
	switch (_dom[1]) {
		case '#':
				id.push(_dom[3]);
				tem.id[_dom[3]]=dom;
			// statements_1
			break;
		case '.':
				clas.push(_dom[3]);
				tem.class[_dom[3]]=dom;
			break;
		default:
			// statements_def
			break;
	}
}
while(clas.length>0){
	findDom('class',clas.pop());
}
while(id.length>0){
	findDom('id',id.pop());
}
//console.log(`${ur}${config.fs.them}`)

function findDom(type,val) {
	//console.log(val);
	//let re= new RegExp(`<div(\S+)${type}="${val}"[^>]*?>(.*?)<\/div>?`,'g');		//这里有问题
	let re= new RegExp(`<div[^\S]${type}[^\S<>]*="${val}">(.*?)<\/div>`,'g');		//这里有问题
	let red=re.exec(_data);	
	let node=tem[type][val];
	//console.log(re.exec(_data))
	if(red!=null){
		let ind=/\$\d/g;
		var cache='';
		let level=0;
		let l_data=null;
		while (level<render[node].length) {
			cache+=replaceTemp(red[0],ind,render[node][level]);
			level++;
		}

		_data=_data.replace(red[0],cache);
	}

}


 // http.createServer(function (req,res) {
 // 	res.end(_data);
 // 	//console.log(_data);
 // }).listen(8080);
function replaceTemp(text,reg,value){		//将模块进行匹配，替换$1-$9为data中的数据
	let data=[];
	let n_data=text;
	let arr=text.match(reg);
	let pos=0;
	for(a in value){
		data=value[a];
	}

	if(arr !=null){
		while (pos<data.length) {
		n_data=n_data.replace(arr[pos],data[pos]);
		pos++;
	}
		return n_data;
	}else{
		console.log('data temp is null');
	}
}
module.exports={
	'data':_data,
	'root':`${ur}${config.fs.them}`
}
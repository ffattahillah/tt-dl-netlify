export async function handler(event){
const url=event.queryStringParameters.url;
if(!url)return res({error:'URL tidak ada'},400);
const apis=[
`https://tikwm.com/api/?url=${encodeURIComponent(url)}`,
`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`,
`https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
];
for(const api of apis){
try{
const r=await fetch(api);
if(!r.ok)continue;
const j=await r.json();
if(!j?.data)continue;
const video=j.data.hdplay||j.data.play||j.data.wmplay;
if(!video)continue;
return res({
video,
audio:j.data.music||null,
cover:j.data.cover||null,
title:j.data.title||'TikTok'
});
}catch(e){}
}
return res({error:'Server sibuk'},503);
}
function res(body,status=200){
return{
statusCode:status,
headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
body:JSON.stringify(body)
};
}
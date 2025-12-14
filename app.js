document.addEventListener('DOMContentLoaded',()=>{
const urlInput=document.getElementById('url-input');
const btn=document.getElementById('download-btn');
const loader=document.getElementById('loader');
const result=document.getElementById('result');
const errorBox=document.getElementById('error-message');
const errorText=document.getElementById('error-text');
const video=document.getElementById('video-player');
const vdl=document.getElementById('video-download');
const adl=document.getElementById('audio-download');

btn.onclick=async()=>{
const url=urlInput.value.trim();
if(!url)return showError('Masukkan URL TikTok');
loader.style.display='block';errorBox.style.display='none';result.style.display='none';
try{
const res=await fetch(`/api/tiktok?url=${encodeURIComponent(url)}`);
const j=await res.json();
if(!res.ok||j.error)throw new Error(j.error||'Gagal');
video.src=j.video;
vdl.href=j.video;
vdl.download='tiktok.mp4';
if(j.audio){adl.href=j.audio;adl.download='tiktok.mp3';adl.style.display='block'}
else adl.style.display='none';
result.style.display='block';
}catch(e){showError(e.message)}
loader.style.display='none';
};
function showError(t){errorText.textContent=t;errorBox.style.display='block'}
});
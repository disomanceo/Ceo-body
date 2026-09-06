import {spawn,spawnSync} from 'node:child_process';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));process.chdir(root);
const url='http://127.0.0.1:5188';
async function status(){try{const r=await fetch(url,{signal:AbortSignal.timeout(1000)});return (await r.text()).includes('<title>Ceo-body')?'ready':'occupied';}catch{return 'offline';}}
async function main(){
 const current=await status();
 if(process.argv.includes('--check')){console.log(current);process.exitCode=current==='ready'?0:1;return;}
 if(current==='occupied')throw Error('Port 5188 belongs to another application. Ceo-body did not stop it.');
 if(current!=='ready'){
 if(!fs.existsSync('dist/index.html')){
 for(const cmd of ['npm install','npm run models','npm run build']){const r=spawnSync(cmd,{cwd:root,shell:true,stdio:'inherit'});if(r.status!==0)throw Error('Setup failed: '+cmd);}
 }
 const log=fs.openSync(path.join(root,'ceo-body.log'),'a');
 const p=spawn(process.execPath,['server.mjs'],{cwd:root,detached:true,stdio:['ignore',log,log],windowsHide:true});p.unref();fs.closeSync(log);
 let ready=false;for(let i=0;i<25;i++){if(await status()==='ready'){ready=true;break;}await new Promise(r=>setTimeout(r,200));}
 if(!ready)throw Error('Ceo-body could not start. See ceo-body.log.');
 }
 console.log('Ceo-body ready: http://localhost:5188');
 if(process.platform==='win32')spawn('cmd.exe',['/d','/s','/c','start "" "http://localhost:5188"'],{windowsHide:true,stdio:'ignore'}).unref();
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});

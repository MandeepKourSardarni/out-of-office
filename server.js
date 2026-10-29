import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Games,GameError} from './game.js';
export function createApp({games=new Games({ttl:Number(process.env.SESSION_TTL_HOURS||6)*3600000}),trustProxy=process.env.TRUST_PROXY==='1'}={}){
 const rates=new Map();let lastSweep=0;
 return http.createServer(async(req,res)=>{
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"};
 const send=(status,data)=>{res.writeHead(status,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify(data));};
 try{const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/')){
 if(!['GET','POST'].includes(req.method))return send(405,{error:'Method not allowed'});
 if(req.method==='POST'){
 // Same-origin writes: browsers must supply a JSON content type; cross-origin preflights get no CORS grant.
 if(!String(req.headers['content-type']||'').startsWith('application/json'))throw new GameError(415,'Use JSON.');
 if(req.headers['sec-fetch-site']==='cross-site')throw new GameError(403,'Cross-site request blocked.');
 const origin=req.headers.origin;const host=req.headers.host;if(origin&&new URL(origin).host!==host)throw new GameError(403,'Origin does not match this server.');
 }
 const ip=trustProxy?String(req.headers['x-forwarded-for']||req.socket.remoteAddress).split(',')[0].trim():req.socket.remoteAddress;
 const now=Date.now();if(now-lastSweep>60000){for(const [k,v]of rates)if(now>v.reset)rates.delete(k);lastSweep=now;}
 const bucketKey=ip+(url.pathname==='/api/state'?':poll':':write');let bucket=rates.get(bucketKey);if(!bucket||now>bucket.reset){bucket={count:0,reset:now+60000};rates.set(bucketKey,bucket);}if(++bucket.count>(url.pathname==='/api/state'?3000:180))throw new GameError(429,'Too many requests. Please wait a minute.');
 let body={};if(req.method==='POST'){let raw='';for await(const c of req){raw+=c;if(raw.length>4096)throw new GameError(413,'Request too large.');}try{body=JSON.parse(raw);}catch{throw new GameError(400,'Invalid JSON.');}if(!body||typeof body!=='object'||Array.isArray(body))throw new GameError(400,'Invalid request.');}
 const t=String(req.headers.authorization||'').replace(/^Bearer /,'');
 if(req.method==='POST'&&url.pathname==='/api/create')return send(201,games.create());
 if(req.method==='POST'&&url.pathname==='/api/join')return send(200,games.join(body.code));
 if(req.method==='GET'&&url.pathname==='/api/state')return send(200,games.state(t));
 if(req.method==='POST'&&url.pathname==='/api/action')return send(200,games.action(t,body));
 return send(404,{error:'Not found'});
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return send(405,{error:'Method not allowed'});
 const files={'/':['index.html','text/html; charset=utf-8'],'/style.css':['style.css','text/css'],'/app.js':['app.js','text/javascript'],'/music.js':['music.js','text/javascript']};const item=files[url.pathname];if(!item)return send(404,{error:'Not found'});const data=await readFile(new URL('./public/'+item[0],import.meta.url));res.writeHead(200,{...headers,'Content-Type':item[1]});res.end(req.method==='HEAD'?undefined:data);
 }catch(e){if(!(e instanceof GameError))console.error(e.message);send(e.status||500,{error:e.status?e.message:'Something went wrong. Try again.'});}
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const arg=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};const port=Number(arg('--port')||process.env.PORT||3000),host=arg('--host')||process.env.HOST||'0.0.0.0';createApp().listen(port,host,()=>console.log(`OUT OF OFFICE is running at http://localhost:${port}\nSame Wi-Fi: open http://<this computer's LAN IP>:${port} on other devices.`));}

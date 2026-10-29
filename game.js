import { randomBytes, randomInt } from 'node:crypto';
import { WORDS } from './words.js';
export class GameError extends Error { constructor(status,message){super(message);this.status=status;} }
const fail=(status,msg)=>{throw new GameError(status,msg)};
const token=()=>randomBytes(32).toString('base64url');
function deck(){const d=[...WORDS];for(let i=d.length-1;i>0;i--){const j=randomInt(i+1);[d[i],d[j]]=[d[j],d[i]];}return d;}
export class Games {
 constructor({now=Date.now,ttl=6*60*60*1000,maxSessions=1000}={}){this.now=now;this.ttl=ttl;this.maxSessions=maxSessions;this.sessions=new Map();this.tokens=new Map();}
 sweep(){for(const [code,s] of this.sessions)if(this.now()>=s.expires){this.sessions.delete(code);for(const t of s.tokens)this.tokens.delete(t);}}
 create(){this.sweep();if(this.sessions.size>=this.maxSessions)fail(503,'The office is full. Try again later.');let code;do{code=Array.from({length:8},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[randomInt(32)]).join('');}while(this.sessions.has(code));const t=token(),s={code,expires:this.now()+this.ttl,tokens:[t],owner:t,host:null,revision:0,duration:30,round:0,deck:deck(),word:null,phase:'ready',endAt:null,lastSeen:{}};this.sessions.set(code,s);this.tokens.set(t,{s,role:'participant'});return {token:t,...this.view(s,'participant',t)};}
 join(code){this.sweep();const s=this.sessions.get(String(code).toUpperCase().replace(/\s/g,''));if(!s)fail(404,'Code not found or session expired. Ask the participant to create a new session.');if(s.tokens.length>=100)fail(429,'This session has reached its device limit.');const t=token();if(!s.host)s.host=t;s.tokens.push(t);this.tokens.set(t,{s,role:'audience'});return {token:t,...this.view(s,'audience',t)};}
 auth(t){this.sweep();const a=this.tokens.get(t);if(!a)fail(401,'Session expired or server restarted. Create or join a new session.');return a;}
 view(s,role,t){const now=this.now();s.lastSeen[t]=now;const phase=s.phase==='running'&&now>=s.endAt?'ended':s.phase;const v={role,isHost:t===s.host,code:s.code,expiresAt:s.expires,revision:s.revision,duration:s.duration,round:s.round,used:s.round,total:50,phase,endAt:s.endAt,serverNow:now,participantOnline:!!s.lastSeen[s.owner]&&now-s.lastSeen[s.owner]<6000,audienceOnline:s.tokens.filter(x=>x!==s.owner&&now-(s.lastSeen[x]||0)<6000).length};if(role==='participant'||phase==='revealed')v.word=s.word;return v;}
 state(t){const {s,role}=this.auth(t);return this.view(s,role,t);}
 action(t,body){const {s,role}=this.auth(t);if(!Number.isInteger(body.revision)||body.revision!==s.revision)fail(409,'The round changed. Your screen is refreshing; try again.');const phase=s.phase==='running'&&this.now()>=s.endAt?'ended':s.phase;const participant=()=>{if(role!=='participant')fail(403,'Only the participant can do that.');};const control=()=>{if(role!=='participant'&&t!==s.host)fail(403,'Only the participant or audience host can do that.');};
 switch(body.action){
 case 'duration':control();if(phase==='running')fail(409,'Duration is locked during a round.');if(![20,30,40].includes(body.duration))fail(400,'Choose 20, 30 or 40 seconds.');s.duration=body.duration;break;
 case 'advance':participant();if(!s.deck.length)fail(409,'All 50 prompts used. Reshuffle to play again.');s.word=s.deck.pop();s.round++;s.phase='running';s.endAt=this.now()+s.duration*1000;break;
 case 'start':participant();if(phase!=='ready')fail(409,'This round has already started.');if(!s.deck.length)fail(409,'All 50 prompts used. Reshuffle to play again.');s.word=s.deck.pop();s.round++;s.phase='running';s.endAt=this.now()+s.duration*1000;break;
 case 'reveal':control();if(phase!=='ended')fail(403,'Reveal is available only after the countdown ends.');s.phase='revealed';break;
 case 'next':participant();if(phase!=='revealed')fail(409,'Ask the host to reveal the answer first.');s.word=null;s.endAt=null;s.phase=s.deck.length?'ready':'complete';break;
 case 'restart':participant();if(body.confirm!==true)fail(400,'Restart confirmation required.');s.deck=deck();s.round=0;s.word=null;s.phase='ready';s.endAt=null;break;
 default:fail(400,'Unknown action.');
 }s.revision++;return this.view(s,role,t);}
}

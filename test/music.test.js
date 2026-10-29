import test from 'node:test';
import assert from 'node:assert/strict';
import {OfficeMusic} from '../public/music.js';
test('music schedules across loop boundaries; pause, resume, mute, volume and saved preferences',async()=>{
 const values=new Map(),notes=[];globalThis.localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 class Param{setValueAtTime(v){this.value=v;}linearRampToValueAtTime(v){this.value=v;}exponentialRampToValueAtTime(v){this.value=v;}setTargetAtTime(v){this.value=v;}}
 class Context{constructor(){this.currentTime=0;this.state='suspended';this.destination={};}createGain(){return {gain:new Param(),connect(){},disconnect(){}};}createOscillator(){return {frequency:{},connect(){},disconnect(){},start(t){notes.push(t);},stop(){}};}async resume(){this.state='running';}async suspend(){this.state='suspended';}}
 globalThis.window={AudioContext:Context};const m=new OfficeMusic();try{assert.equal(m.ctx,null);assert.equal(m.playing,false);assert.equal(m.volume,.18);await m.play();assert(m.playing);for(let i=0;i<200;i++){m.ctx.currentTime=i*.25;m.schedule();}assert(m.step>128,'more than four complete phrase loops were scheduled');assert(notes.length>100);assert(notes.every((t,i)=>i===0||Number.isFinite(t)));m.setVolume(.35);assert.equal(m.gain.gain.value,.35);m.toggleMute();assert.equal(m.gain.gain.value,0);await m.pause();assert.equal(m.playing,false);assert.equal(m.ctx.state,'suspended');const restored=new OfficeMusic();assert.equal(restored.volume,.35);assert.equal(restored.muted,true);assert.equal(restored.preferredPlay,false);await m.play();assert.equal(m.ctx.state,'running');m.toggleMute();assert.equal(m.gain.gain.value,.35);}finally{clearInterval(m.loop);delete globalThis.window;delete globalThis.localStorage;}
});

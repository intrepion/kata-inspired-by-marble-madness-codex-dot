export const courses = [
 {name:'PRACTICE', color:'#6ed9df', width:3.2, length:34, time:60, hazards:[]},
 {name:'BEGINNER', color:'#e8a3dc', width:2.7, length:39, time:35, hazards:[{y:15,type:'steel'},{y:27,type:'bumper'}]},
 {name:'INTERMEDIATE', color:'#f8c878', width:2.5, length:43, time:35, hazards:[{y:12,type:'steel'},{y:23,type:'acid'},{y:33,type:'bumper'}]},
 {name:'SILLY', color:'#acb4f8', width:2.35, length:45, time:35, hazards:[{y:12,type:'bumper'},{y:22,type:'steel'},{y:34,type:'acid'}]},
 {name:'ULTIMATE', color:'#8ce4b6', width:2.15, length:48, time:40, hazards:[{y:10,type:'steel'},{y:21,type:'acid'},{y:31,type:'bumper'},{y:40,type:'steel'}]},
 {name:'FINAL', color:'#ed9f8c', width:2.05, length:50, time:45, hazards:[{y:10,type:'bumper'},{y:19,type:'steel'},{y:28,type:'acid'},{y:38,type:'steel'},{y:44,type:'bumper'}]}
];
export function center(c,y){return Math.sin(y*.16)*(.45+c*.1)+Math.sin(y*.39)*.2}
export function width(c,y){const a=courses[c]; return a.width-(y>8&&y<a.length-4 ? .35*(.5+.5*Math.sin(y*.37)):0)}
export function createGame(){return {course:0,x:0,y:1,vx:0,vy:0,time:60,score:0,falls:0,checkpoint:1,state:'ready',invuln:0,elapsed:0,notice:''}}
export function start(g){if(g.state==='ready'||g.state==='over'||g.state==='won'){Object.assign(g,createGame(),{state:'playing'})}}
export function step(g,input,dt){if(g.state!=='playing')return; dt=Math.min(dt,.05); g.elapsed+=dt;g.time=Math.max(0,g.time-dt);g.invuln=Math.max(0,g.invuln-dt); if(!g.time){g.state='over';return}
 let c=courses[g.course], ax=(input.right?1:0)-(input.left?1:0), ay=(input.down?1:0)-(input.up?1:0);let n=Math.hypot(ax,ay)||1; ax/=n;ay/=n;
 const ice=g.course>=1 && g.y>c.length*.48 && g.y<c.length*.62;const drag=ice?.985:.94;
 g.vx=(g.vx+ax*13*dt)*Math.pow(drag,dt*60);g.vy=(g.vy+ay*13*dt+1.0*dt)*Math.pow(drag,dt*60);let speed=Math.hypot(g.vx,g.vy);if(speed>6){g.vx*=6/speed;g.vy*=6/speed} g.x+=g.vx*dt;g.y+=g.vy*dt;
 if(g.y<0){g.y=0;g.vy=0} if(g.y>g.checkpoint+7){g.checkpoint=Math.floor(g.y/7)*7}
 if(Math.abs(g.x-center(g.course,g.y))>width(g.course,g.y)){fall(g);return}
 for(const h of c.hazards){let hx=center(g.course,h.y)+Math.sin(g.elapsed*1.8+h.y)*width(g.course,h.y)*.55; if(Math.hypot(g.x-hx,g.y-h.y)<.72&&g.invuln<=0){if(h.type==='acid'){fall(g);return}let dx=g.x-hx,dy=g.y-h.y, d=Math.hypot(dx,dy)||1;g.vx=dx/d*5;g.vy=dy/d*5;g.invuln=.8;g.notice='BUMP!'}}
 if(g.y>=c.length){g.score+=1000+Math.ceil(g.time)*10+(g.falls===0?500:0);if(g.course===courses.length-1){g.state='won';return}g.course++;g.time+=courses[g.course].time;g.x=center(g.course,1);g.y=1;g.vx=g.vy=0;g.checkpoint=1;g.falls=0;g.invuln=1;g.notice='TIME CARRIED FORWARD'}
}
function fall(g){g.falls++;g.time=Math.max(0,g.time-3);g.x=center(g.course,g.checkpoint);g.y=g.checkpoint;g.vx=g.vy=0;g.invuln=1;g.notice='−3 SECONDS';if(!g.time)g.state='over'}

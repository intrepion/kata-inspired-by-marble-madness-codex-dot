// Each point is [distance down-course, center, half-width]. Gaps use integer edges.
export const courses = [
 {name:'PRACTICE',color:'#6ed9df',length:40,time:80,points:[[0,0,2.7],[6,0,2.7],[12,3,2.2],[18,3,1.35],[24,0,2.2],[30,-2.5,2.1],[36,-2.5,2.2],[40,0,2.5]],gaps:[[20,22]],hazards:[]},
 {name:'BEGINNER',color:'#e8a3dc',length:46,time:55,points:[[0,0,2.5],[7,0,2.5],[13,-3,1.7],[19,-3,1.4],[25,0,2.1],[31,3,1.5],[38,3,1.8],[46,0,2.4]],gaps:[[21,23],[35,37]],hazards:[{y:16,type:'steel'},{y:41,type:'bumper'}]},
 {name:'INTERMEDIATE',color:'#f8c878',length:50,time:60,points:[[0,0,2.5],[7,0,2.4],[14,3.4,1.6],[21,3.4,1.35],[28,0,2],[34,-3.4,1.5],[42,-3.4,1.65],[50,0,2.4]],gaps:[[23,25],[38,40]],hazards:[{y:17,type:'steel'},{y:31,type:'acid'},{y:45,type:'bumper'}]},
 {name:'SILLY',color:'#acb4f8',length:52,time:65,points:[[0,0,2.5],[7,0,2.4],[14,-3.5,1.55],[20,-3.5,1.4],[27,0,2],[34,3.5,1.45],[43,3.5,1.5],[52,0,2.4]],gaps:[[22,24],[38,40]],hazards:[{y:17,type:'bumper'},{y:30,type:'steel'},{y:46,type:'acid'}]},
 {name:'ULTIMATE',color:'#8ce4b6',length:54,time:70,points:[[0,0,2.4],[7,0,2.2],[14,3.7,1.5],[22,3.7,1.35],[29,0,1.9],[36,-3.7,1.4],[45,-3.7,1.5],[54,0,2.3]],gaps:[[24,26],[40,42]],hazards:[{y:17,type:'steel'},{y:32,type:'acid'},{y:48,type:'bumper'}]},
 {name:'FINAL',color:'#ed9f8c',length:56,time:75,points:[[0,0,2.4],[7,0,2.2],[15,-4,1.5],[23,-4,1.3],[30,0,1.9],[38,4,1.4],[47,4,1.5],[56,0,2.3]],gaps:[[25,27],[42,44]],hazards:[{y:18,type:'bumper'},{y:33,type:'steel'},{y:50,type:'acid'}]}
];
function interpolate(c,y,index){const pts=courses[c].points;for(let i=1;i<pts.length;i++){if(y<=pts[i][0]){let a=pts[i-1],b=pts[i],t=Math.max(0,Math.min(1,(y-a[0])/(b[0]-a[0])));return a[index]+(b[index]-a[index])*t}}return pts.at(-1)[index]}
export const center=(c,y)=>interpolate(c,y,1);
export const width=(c,y)=>interpolate(c,y,2);
export const gapAt=(c,y)=>courses[c].gaps.find(([a,b])=>y>=a&&y<b);
export function createGame(){return {course:0,x:0,y:1,vx:0,vy:0,time:80,score:0,falls:0,checkpoint:1,state:'ready',invuln:0,elapsed:0,notice:'',airborne:false}}
export function start(g){if(['ready','over','won'].includes(g.state))Object.assign(g,createGame(),{state:'playing'})}
// Screen-space drag impulses compensate for the course's oblique projection.
export function roll(g,dx,dy){
 if(g.state!=='playing'||!Number.isFinite(dx)||!Number.isFinite(dy))return;
 g.vx+=(dx-dy*.5)*.035;g.vy+=dy*.06;
 const speed=Math.hypot(g.vx,g.vy);if(speed>6){g.vx*=6/speed;g.vy*=6/speed;}
}
export function step(g,input,dt){if(g.state!=='playing')return;dt=Math.min(dt,.05);g.elapsed+=dt;g.time=Math.max(0,g.time-dt);g.invuln=Math.max(0,g.invuln-dt);if(!g.time){g.state='over';return}
 let c=courses[g.course], ax=(input.right?1:0)-(input.left?1:0),ay=(input.down?1:0)-(input.up?1:0),n=Math.hypot(ax,ay)||1;ax/=n;ay/=n;
 const ice=g.course>=1&&g.y>c.length*.48&&g.y<c.length*.62,drag=ice?.975:.94;
 g.vx=(g.vx+ax*13*dt)*Math.pow(drag,dt*60);g.vy=(g.vy+ay*13*dt+1*dt)*Math.pow(drag,dt*60);let speed=Math.hypot(g.vx,g.vy);if(speed>6){g.vx*=6/speed;g.vy*=6/speed}const oldY=g.y;g.x+=g.vx*dt;g.y+=g.vy*dt;if(g.y<0){g.y=0;g.vy=0}
 const gap=gapAt(g.course,g.y);if(gap&&!g.airborne){if(!gapAt(g.course,oldY)&&g.vy>=2.4){g.airborne=true;g.notice='JUMP!'}else{fall(g);return}}if(g.airborne&&!gap){g.airborne=false;g.notice='LANDED'}
 if(!g.airborne&&Math.abs(g.x-center(g.course,g.y))>width(g.course,g.y)){fall(g);return}
 // Checkpoints are placed on solid ground, at least two units before a gap.
 if(!g.airborne&&g.y>g.checkpoint+7&&!gapAt(g.course,g.y)&&!c.gaps.some(([a,b])=>g.y>a-2&&g.y<b+1)&&!c.hazards.some(h=>Math.abs(g.y-h.y)<4)){g.checkpoint=Math.floor(g.y)}
 for(const h of c.hazards){let hx=center(g.course,h.y)+Math.sin(g.elapsed*1.8+h.y)*width(g.course,h.y)*.55;if(!g.airborne&&Math.hypot(g.x-hx,g.y-h.y)<.72&&g.invuln<=0){if(h.type==='acid'){fall(g);return}let dx=g.x-hx,dy=g.y-h.y,d=Math.hypot(dx,dy)||1;g.vx=dx/d*5;g.vy=dy/d*5;g.invuln=.8;g.notice='BUMP!'}}
 if(g.y>=c.length){g.score+=1000+Math.ceil(g.time)*10+(g.falls===0?500:0);if(g.course===courses.length-1){g.state='won';return}g.course++;g.time+=courses[g.course].time;g.x=center(g.course,1);g.y=1;g.vx=g.vy=0;g.checkpoint=1;g.falls=0;g.airborne=false;g.invuln=1;g.notice='TIME CARRIED FORWARD'}
}
function fall(g){g.falls++;g.time=Math.max(0,g.time-3);g.x=center(g.course,g.checkpoint);g.y=g.checkpoint;g.vx=g.vy=0;g.airborne=false;g.invuln=1;g.notice='−3 SECONDS';if(!g.time)g.state='over'}

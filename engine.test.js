import {test} from 'node:test';import assert from 'node:assert/strict';import {createGame,start,step,courses,center,roll} from './engine.js';
test('clock and momentum advance only during play',()=>{let g=createGame();step(g,{down:true},.05);assert.equal(g.time,80);start(g);for(let i=0;i<20;i++)step(g,{down:true},.05);assert.ok(g.y>1);assert.ok(g.time<80);assert.ok(g.vy>0)});
test('fall costs time and returns to checkpoint',()=>{let g=createGame();start(g);g.x=20;step(g,{},.05);assert.equal(g.falls,1);assert.ok(g.time<77);assert.equal(g.y,1)});
test('finish carries remaining time and awards points',()=>{let g=createGame();start(g);g.y=courses[0].length;g.x=center(0,g.y);step(g,{},.01);assert.equal(g.course,1);assert.ok(g.time>90);assert.ok(g.score>=1500)});
test('timeout ends play',()=>{let g=createGame();start(g);g.time=.01;step(g,{},.05);assert.equal(g.state,'over')});
test('last goal wins',()=>{let g=createGame();start(g);g.course=5;g.y=courses[5].length;g.x=center(5,g.y);step(g,{},.01);assert.equal(g.state,'won')});

test('every course has bends, narrow sections, and traversable gaps',()=>{for(let i=0;i<courses.length;i++){const c=courses[i],xs=c.points.map(p=>p[1]);assert.ok(Math.max(...xs)-Math.min(...xs)>=5,c.name);assert.ok(c.points.some(p=>p[2]<=1.5),c.name);assert.ok(c.gaps.length>0,c.name);for(const [a,b] of c.gaps){assert.ok(b-a<=2);assert.ok(a>5&&b<c.length-3)}}});
test('a fast approach jumps a gap and a slow approach falls',()=>{let g=createGame();start(g);g.y=19.9;g.x=center(0,g.y);g.vy=4;step(g,{down:true},.05);assert.equal(g.airborne,true);for(let i=0;i<20&&g.airborne;i++)step(g,{down:true},.05);assert.equal(g.falls,0);assert.ok(g.y>=22);let h=createGame();start(h);h.y=19.99;h.x=center(0,h.y);h.vy=.5;step(h,{},.05);assert.equal(h.falls,1);assert.equal(h.y,1)});
test('holding straight ahead cannot finish a winding course',()=>{let g=createGame();start(g);for(let i=0;i<1000&&g.state==='playing'&&g.course===0;i++)step(g,{down:true},.05);assert.equal(g.course,0);assert.ok(g.falls>0)});

test('each raceway has a steerable route to its goal with live hazards',()=>{const looks=[1,2,1,3,1,2];for(let c=0;c<courses.length;c++){let g=createGame();start(g);g.course=c;g.x=center(c,1);g.time=80;for(let i=0;i<2400&&g.state==='playing'&&g.course===c;i++){const error=center(c,g.y+looks[c])-1-g.x-g.vx*.45;step(g,{down:true,left:error<-.18,right:error>.18},.05)}assert.ok(g.course!==c||g.state==='won',`${courses[c].name} did not finish`);assert.ok(g.time>0,`${courses[c].name} timed out`)}});

test('pointer rolling follows projected direction, coasts, brakes and caps speed',()=>{
 let g=createGame();roll(g,100,100);assert.equal(g.vx,0);start(g);
 roll(g,50,100);assert.equal(g.vx,0);assert.ok(g.vy>0);const speed=g.vy;
 step(g,{},.05);assert.ok(g.vy>0&&g.vy<speed);
 roll(g,0,-30);assert.ok(g.vy<speed-1);
 roll(g,10000,10000);assert.ok(Math.hypot(g.vx,g.vy)<=6.000001);
 const before={...g};roll(g,NaN,0);assert.deepEqual(g,before);
});

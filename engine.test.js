import {test} from 'node:test';import assert from 'node:assert/strict';import {createGame,start,step,courses,center} from './engine.js';
test('clock and momentum advance only during play',()=>{let g=createGame();step(g,{down:true},.05);assert.equal(g.time,60);start(g);for(let i=0;i<20;i++)step(g,{down:true},.05);assert.ok(g.y>1);assert.ok(g.time<60);assert.ok(g.vy>0)});
test('fall costs time and returns to checkpoint',()=>{let g=createGame();start(g);g.x=20;step(g,{},.05);assert.equal(g.falls,1);assert.ok(g.time<57);assert.equal(g.y,1)});
test('finish carries remaining time and awards points',()=>{let g=createGame();start(g);g.y=courses[0].length;g.x=center(0,g.y);step(g,{},.01);assert.equal(g.course,1);assert.ok(g.time>90);assert.ok(g.score>=1500)});
test('timeout ends play',()=>{let g=createGame();start(g);g.time=.01;step(g,{},.05);assert.equal(g.state,'over')});
test('last goal wins',()=>{let g=createGame();start(g);g.course=5;g.y=courses[5].length;g.x=center(5,g.y);step(g,{},.01);assert.equal(g.state,'won')});

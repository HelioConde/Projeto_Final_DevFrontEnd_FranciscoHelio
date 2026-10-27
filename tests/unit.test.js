import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanName,cleanRegion,legacyFriends,normalizeState,loadState,saveState,validateBackup} from '../src/storage.js';
test('limpa nomes e regiões',()=>{assert.equal(cleanName('  Ana   Silva '),'Ana Silva');assert.equal(cleanRegion('unknown'),'BR1');});
test('migra e deduplica dados legados',()=>{
 const old=JSON.stringify(['{"name":"Ahri"}',{name:'Ahri'},{name:'Lux'}]);
 assert.equal(normalizeState({friends:legacyFriends(old)}).friends.length,2);
});
test('filtra favoritos inválidos',()=>{
 assert.deepEqual(normalizeState({favorites:['Ahri','Ahri','<script>']}).favorites,['Ahri']);
});
test('persistência local e armazenamento bloqueado',()=>{
 const memory=new Map();
 const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 assert.equal(saveState('key',{friends:[{name:'Ashe',region:'BR1'}]},storage),true);
 assert.equal(loadState('key',storage).friends[0].name,'Ashe');
 assert.equal(loadState('key',{getItem:()=>'{invalid'}).friends.length,0);
 assert.equal(saveState('key',{}, {setItem:()=>{throw Error('blocked');}}),false);
});

test('validação de backup impede truncamento silencioso, duplicação e campos inesperados',()=>{
 assert.equal(validateBackup({friends:[{name:'Luna#BR1',region:'BR1'}],favorites:['Ahri']}),'');
 assert.match(validateBackup({friends:new Array(101).fill({name:'Teste',region:'BR1'}),favorites:[]}),/limite/);
 assert.match(validateBackup({friends:[{name:'Teste',region:'WRONG'}],favorites:[]}),/inválidos/);
 assert.match(validateBackup({friends:[{name:'Teste',region:'BR1'},{name:'Teste',region:'BR1'}],favorites:[]}),/duplicados/);
 assert.match(validateBackup({friends:[],favorites:['Ahri','Ahri']}),/duplicados/);
 assert.match(validateBackup(null),/inválido/);
});

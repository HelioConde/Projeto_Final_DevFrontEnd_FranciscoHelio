export function cleanName(v){ return typeof v==='string'?v.trim().replace(/\s+/g,' ').slice(0,40):''; }
export function cleanRegion(v){ return ['BR1','NA1','EUW1','EUN1','LA1','LA2','KR','JP1'].includes(v)?v:'BR1'; }
export function legacyFriends(input){
  let list; try{list=typeof input==='string'?JSON.parse(input):input;}catch{return [];}
  if(!Array.isArray(list))return [];
  return list.map(item=>{try{
    const x=typeof item==='string'?JSON.parse(item):item;
    const name=cleanName(typeof x==='string'?x:(x?.name||x?.gameName||''));
    return name?{name,region:cleanRegion(x?.region)}:null;
  }catch{return null;}}).filter(Boolean);
}
export function normalizeState(value){
 const obj=value&&typeof value==='object'?value:{};
 const seen=new Set();
 const friends=legacyFriends(obj.friends).filter(f=>{
   const key=(f.region+f.name).toLocaleLowerCase('pt-BR');
   if(seen.has(key))return false;
   seen.add(key);return true;
 }).slice(0,100);
 const favorites=Array.isArray(obj.favorites)?[...new Set(obj.favorites.filter(v=>typeof v==='string'&&/^[A-Za-z0-9]{1,32}$/.test(v)))].slice(0,200):[];
 return {friends,favorites};
}
export function loadState(key,storage=globalThis.localStorage){
 try{return normalizeState(storage.getItem(key)?JSON.parse(storage.getItem(key)):{friends:legacyFriends(storage.getItem('tbAmigos')||storage.getItem('tbfriends'))});}
 catch{return normalizeState({});}
}
export function saveState(key,state,storage=globalThis.localStorage){
 try{storage.setItem(key,JSON.stringify(normalizeState(state)));return true;}catch{return false;}
}

export function validateBackup(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||!Array.isArray(input.friends)||!Array.isArray(input.favorites))return 'Backup inválido.';
 if(input.friends.length>100||input.favorites.length>200)return 'Backup excede o limite de 100 amigos ou 200 favoritos.';
 const regions=new Set(['BR1','NA1','EUW1','EUN1','LA1','LA2','KR','JP1']);
 const friends=new Set(),favorites=new Set();
 for(const friend of input.friends){
  if(!friend||typeof friend!=='object'||Array.isArray(friend)||typeof friend.name!=='string'||
     cleanName(friend.name).length<2||friend.name.length>80||!regions.has(friend.region))return 'Backup contém amigos inválidos.';
  const key=friend.region+'|'+cleanName(friend.name).toLocaleLowerCase('pt-BR');
  if(friends.has(key))return 'Backup contém amigos duplicados.';
  friends.add(key);
 }
 for(const id of input.favorites){
  if(typeof id!=='string'||!/^[A-Za-z0-9]{1,32}$/.test(id)||favorites.has(id))return 'Backup contém favoritos inválidos ou duplicados.';
  favorites.add(id);
 }
 return '';
}

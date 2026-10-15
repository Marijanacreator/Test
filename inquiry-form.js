/* Centralizovan izbor jednog proizvoda. Podaci se učitavaju odvojeno od UI-ja. */
(function () {
'use strict';
const catalog = window.INQUIRY_CATALOG;
const byId = id => document.getElementById(id);
const form = byId('inquiry-form'), category = byId('category'), type = byId('product-type'), product = byId('product'), search = byId('product-search'), general = byId('general'), message = byId('message'), result = byId('result'), send = byId('send-inquiry');
if (!catalog) { result.hidden=false; result.textContent='Podaci o proizvodima nisu učitani. Osveži stranicu i pokušaj ponovo.'; return; }
const normalize = text => text.toLocaleLowerCase('sr-Latn').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'dj').trim();
const typesFor = cid => catalog.types.filter(t => t.categoryId === cid);
const productsFor = (cid, tid, query='') => catalog.products.filter(p => p.categoryId === cid && p.typeId === tid && normalize(p.name+' '+p.code).includes(normalize(query)));
function selectedRecord() { return catalog.products.find(p => p.id === product.value && p.categoryId === category.value && p.typeId === type.value); }
function options(select, entries, placeholder) { select.replaceChildren(new Option(placeholder,'')); entries.forEach(e => select.add(new Option(e.label,e.value))); }
function clearStatus() { result.hidden=true; }
function summary() { const p=selectedRecord(); byId('selection-summary').textContent = general.checked ? 'Opšti upit — nije potreban konkretan proizvod.' : p ? 'Izabrano: '+p.name+' | '+p.code : 'Proizvod još nije izabran.'; product.setCustomValidity(''); }
function refreshProducts() {
 const previous=product.value;
 const matches=productsFor(category.value,type.value,search.value);
 options(product,matches.map(p=>({value:p.id,label:p.name+' | '+p.code})),!type.value?'Prvo izaberi vrstu proizvoda':matches.length?'Izaberi proizvod':'Nema proizvoda za ovu pretragu');
 if(matches.some(p=>p.id===previous))product.value=previous;
 byId('search-help').textContent=type.value ? matches.length+' proizvoda za izabranu vrstu. Pretraži po nazivu ili TEST šifri.' : 'Prvo izaberi kategoriju i vrstu proizvoda.';
 summary();
}
function resetType() { options(type,typesFor(category.value).map(t=>({value:t.id,label:t.name})),'Izaberi vrstu proizvoda'); type.disabled=general.checked||!category.value; resetProduct(); }
function resetProduct() { search.value=''; product.value='';search.disabled=product.disabled=general.checked||!type.value;refreshProducts();clearStatus(); }
function generalMode() {
 category.disabled=general.checked;category.required=!general.checked;
 type.required=product.required=!general.checked;
 message.required=general.checked;
 byId('message-label').textContent=general.checked?'Poruka * — opiši šta ti je potrebno':'Poruka (opciono)';
 if(general.checked){category.value='';resetType();}else{resetType();}
 message.setCustomValidity('');summary();clearStatus();
}
function resetSelection() { general.checked=false;category.value='';generalMode(); }
options(category,catalog.categories.map(c=>({value:c.id,label:c.name})),'Izaberi kategoriju proizvoda');resetSelection();send.disabled=false;
category.addEventListener('change',()=>{resetType();clearStatus();});type.addEventListener('change',resetProduct);
search.addEventListener('input',()=>{refreshProducts();clearStatus();});product.addEventListener('change',()=>{summary();clearStatus();});general.addEventListener('change',generalMode);
message.addEventListener('input',()=>message.setCustomValidity(''));
function buildPayload() {
 const cat=catalog.categories.find(c=>c.id===category.value),kind=catalog.types.find(t=>t.id===type.value&&t.categoryId===category.value),p=selectedRecord();
 if(!general.checked&&(!cat||!kind||!p))throw new Error('Izaberi kategoriju, vrstu i proizvod iz liste.');
 if(general.checked&&!message.value.trim())throw new Error('Opiši koji proizvod ili pomoć su ti potrebni.');
 // Naziv i šifra dolaze iz ISTOG zapisa, nikad iz slobodno unetog teksta.
 const items = general.checked ? [] : [{category:cat.name,type:kind.name,name:p.name,code:p.code}];
 const data=new FormData(form);data.delete('botcheck');
 const payload=Object.fromEntries(data);
 payload.subject=general.checked?'Opšti upit za proizvod — TEST katalog':'Upit za proizvod — '+p.code;
 payload['Tip upita']=general.checked?'Opšti upit':'Upit za jedan proizvod';
 payload['Kategorija proizvoda']=items[0]?.category||'Nije izabrana — opšti upit';
 payload['Vrsta proizvoda']=items[0]?.type||'Nije izabrana — opšti upit';
 payload['Naziv proizvoda']=items[0]?.name||'Nije izabran — opšti upit';
 payload['Šifra proizvoda']=items[0]?.code||'Nema — opšti upit';
 payload['Podaci kataloga']='Privremeni TEST podaci; nisu stvarni artikli Rekord Erdeša';
 payload['Ime i prezime']=payload.name;payload['Telefon']=payload.phone;payload['Email adresa']=payload.email;payload['Poruka']=message.value.trim();delete payload.name;delete payload.phone;delete payload.message;
 return payload;
}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(send.disabled||form.elements.botcheck.checked)return;
 if(general.checked&&!message.value.trim()){message.setCustomValidity('Opiši šta ti je potrebno.');message.reportValidity();return;}
 if(!form.reportValidity())return;
 let data;try{data=buildPayload();}catch(error){product.setCustomValidity(error.message);form.reportValidity();return;}
 send.disabled=true;form.setAttribute('aria-busy','true');send.textContent='Slanje…';result.hidden=false;result.style.background='#e9f2df';result.textContent='Upit se šalje…';
 const controls=[...form.querySelectorAll('input, select, textarea')];const disabledBefore=controls.map(c=>c.disabled);controls.forEach(c=>c.disabled=true);
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
 try {const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data),signal:controller.signal});const reply=await response.json();if(!response.ok||!reply.success)throw new Error('Slanje nije potvrđeno');form.reset();controls.forEach((c,i)=>c.disabled=disabledBefore[i]);resetSelection();result.textContent='Hvala! Tvoj upit je uspešno poslat.';result.hidden=false;}
 catch(error){controls.forEach((c,i)=>c.disabled=disabledBefore[i]);result.style.background='#fbe8df';result.textContent=error.name==='AbortError'?'Potvrda slanja nije stigla na vreme. Proveri da li je upit primljen pre ponovnog slanja. Podaci su ostali u formi.':'Slanje nije potvrđeno. Proveri internet vezu i pokušaj ponovo. Podaci su ostali u formi.';result.hidden=false;}
 finally {clearTimeout(timeout);send.disabled=false;form.removeAttribute('aria-busy');send.innerHTML='Pošalji upit <span>↗</span>';}
});
})();

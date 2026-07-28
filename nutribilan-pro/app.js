"use strict";
(() => {
  const loader = document.createElement("script");
  loader.src = "foods.js";
  loader.onload = start;
  loader.onerror = () => alert("Impossible de charger la base alimentaire.");
  document.head.appendChild(loader);

  function start(){
    const KEY="nutribilan-pro-v2";
    const MEALS=["Petit-déjeuner","Déjeuner","Collation / Goûter","Dîner","Autre"];
    const EQUIVS=[
      ["VPO maigre","Poulet, dinde, thon, cabillaud",100,130,24,3,0],
      ["VPO intermédiaire","Bœuf maigre, porc maigre, saumon",100,185,23,10,0],
      ["Œuf","1 œuf moyen",60,86,7.5,6.2,.4],
      ["Laitage maigre","Skyr, yaourt 0 %, fromage blanc 0 %",125,60,7.5,.5,5.5],
      ["Laitage standard","Yaourt entier, lait demi-écrémé",125,90,5,3.5,8],
      ["Fromage","Emmental, camembert, mozzarella",30,110,7.5,9,.5],
      ["Pain","Baguette, pain complet",50,135,4.5,1,27],
      ["Féculents cuits","Riz, pâtes, semoule, quinoa",100,130,3.5,1,25],
      ["Légumineuses cuites","Lentilles, pois chiches, haricots",100,125,8,1,20],
      ["Légumes","Légumes variés hors féculents",100,30,1.8,.3,4.5],
      ["Fruit","1 fruit moyen ou 150 g",150,80,1,.3,19],
      ["Matière grasse","10 g d'huile ou beurre",10,90,0,10,0],
      ["Oléagineux","Amandes, noix, noisettes",20,120,4,10,3],
      ["Produit sucré / plaisir","Biscuit, chocolat, confiture",20,80,1,3,13],
      ["Alcool","Environ 10 g d'éthanol",10,70,0,0,0],
      ["Poudre protéinée","Whey ou caséine",30,115,24,1,2]
    ].map((r,i)=>({id:"eq"+i,name:r[0],examples:r[1],g:r[2],kcal:r[3],p:r[4],l:r[5],c:r[6],meals:[0,0,0,0]}));
    const DEF={profile:{name:"Exemple – à remplacer",sex:"Femme",age:35,height:165,weight:68,targetWeight:60,goal:"Perte de poids",formula:"henry",pal:1.375,dejAdjust:-.20,surveyAdjust:-.20,dejWeight:.50,proteinTarget:1.20},survey:[],customFoods:[],equivalents:EQUIVS,targets:{pMin:10,pMax:20,lMin:35,lMax:40,cMin:40,cMax:55}};
    let state=load();
    const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)], num=v=>Number(v)||0;
    const fmt=(v,d=0)=>new Intl.NumberFormat("fr-FR",{minimumFractionDigits:d,maximumFractionDigits:d}).format(num(v));
    const clone=v=>JSON.parse(JSON.stringify(v)), uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

    function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");return x?{...clone(DEF),...x,profile:{...DEF.profile,...x.profile},targets:{...DEF.targets,...x.targets},equivalents:x.equivalents?.length?x.equivalents:clone(EQUIVS)}:clone(DEF)}catch{return clone(DEF)}}
    function save(show=false){localStorage.setItem(KEY,JSON.stringify(state));if(show)toast("Données enregistrées")}
    function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(toast.x);toast.x=setTimeout(()=>e.classList.remove("show"),1800)}
    function foods(){return [...BUILTIN_FOODS,...state.customFoods]}
    function food(name){return foods().find(f=>f.name===name)}
    function bmiClass(v){return v<16?"Maigreur sévère":v<17?"Maigreur modérée":v<18.5?"Insuffisance pondérale":v<25?"Corpulence normale":v<30?"Surpoids":v<35?"Obésité modérée":v<40?"Obésité sévère":"Obésité morbide"}
    function bmr(){const p=state.profile,w=num(p.weight),h=num(p.height),a=num(p.age),m=p.sex==="Homme";if(p.formula==="harris")return m?88.362+13.397*w+4.799*h-5.677*a:447.593+9.247*w+3.098*h-4.330*a;if(p.formula==="black")return(m?259:230)*w**.48*(h/100)**.5*a**-.13;if(p.formula==="schofield")return m?(a<=30?15.057*w+692.2:a<=60?11.472*w+873.1:11.711*w+587.7):(a<=30?14.818*w+486.6:a<=60?8.126*w+845.6:9.082*w+658.5);return m?(a<=30?14.4*w+313*h/100+113:a<=60?11.4*w+541*h/100-137:11.4*w+541*h/100-256):(a<=30?10.4*w+615*h/100-282:a<=60?8.18*w+502*h/100-11.6:8.52*w+421*h/100+10.7)}
    function surveyTotals(){return state.survey.reduce((t,r)=>{const f=food(r.food),q=num(r.qty)/100;if(f){t.kcal+=f.kcal*q;t.p+=f.p*q;t.l+=f.l*q;t.c+=f.c*q}return t},{kcal:0,p:0,l:0,c:0})}
    function calc(){const p=state.profile,bmi=num(p.weight)/(num(p.height)/100)**2,mb=bmr(),dej=mb*num(p.pal),dejAdj=dej*(1+num(p.dejAdjust)),s=surveyTotals(),surveyAdj=s.kcal*(1+num(p.surveyAdjust)),target=s.kcal?dejAdj*num(p.dejWeight)+surveyAdj*(1-num(p.dejWeight)):dejAdj;return{bmi,mb,dej,dejAdj,surveyAdj,target}}
    function dist(){return state.equivalents.reduce((t,e)=>{const q=(e.meals||[]).reduce((a,b)=>a+num(b),0);t.portions+=q;t.kcal+=q*num(e.kcal);t.p+=q*num(e.p);t.l+=q*num(e.l);t.c+=q*num(e.c);return t},{portions:0,kcal:0,p:0,l:0,c:0})}
    function mealTotal(i){return state.equivalents.reduce((t,e)=>{const q=num(e.meals?.[i]);t.kcal+=q*num(e.kcal);t.p+=q*num(e.p);t.l+=q*num(e.l);t.c+=q*num(e.c);return t},{kcal:0,p:0,l:0,c:0})}
    function metric(l,v,s="",c=""){return `<div class="metric ${c}"><div class="label">${l}</div><div class="value">${v}</div><div class="sub">${s}</div></div>`}

    function renderProfile(){
      $$('[data-profile]').forEach(e=>{const v=state.profile[e.dataset.profile];e.value=e.dataset.percent!==undefined?num(v)*100:v});
      const c=calc();
      $("#profileMetrics").innerHTML=[metric("IMC",fmt(c.bmi,1),bmiClass(c.bmi),"accent"),metric("Métabolisme de base",fmt(c.mb)+" kcal"),metric("Dépense énergétique",fmt(c.dej)+" kcal","MB × NAP"),metric("DEJ ajustée",fmt(c.dejAdj)+" kcal",fmt(state.profile.dejAdjust*100)+" %"),metric("Enquête ajustée",fmt(c.surveyAdj)+" kcal"),metric("Cible de décision",fmt(c.target)+" kcal","Objectif calculé","good")].join("")
    }
    const foodOptions=s=>'<option value="">Choisir…</option>'+foods().slice().sort((a,b)=>a.name.localeCompare(b.name,"fr")).map(f=>`<option ${f.name===s?"selected":""}>${f.name}</option>`).join("");
    const mealOptions=s=>MEALS.map(m=>`<option ${m===s?"selected":""}>${m}</option>`).join("");
    function renderSurvey(){
      $("#surveyTable tbody").innerHTML=state.survey.map((r,i)=>{const f=food(r.food),q=num(r.qty),x=q/100;return `<tr><td>${i+1}</td><td><select data-sid="${r.id}" data-key="meal">${mealOptions(r.meal)}</select></td><td><select data-sid="${r.id}" data-key="food">${foodOptions(r.food)}</select></td><td class="num"><input class="compact-input" data-sid="${r.id}" data-key="qty" type="number" min="0" value="${q}"></td><td class="num">${f?fmt(q/f.portion,2):"—"}</td><td class="num">${f?fmt(f.kcal*x):"—"}</td><td class="num">${f?fmt(f.p*x,1):"—"}</td><td class="num">${f?fmt(f.l*x,1):"—"}</td><td class="num">${f?fmt(f.c*x,1):"—"}</td><td>${f?f.category:"—"}</td><td class="no-print"><div class="row-actions"><button class="icon-btn" data-dup="${r.id}">Dupliquer</button><button class="icon-btn" data-del="${r.id}">Suppr.</button></div></td></tr>`}).join("")||'<tr><td colspan="11" class="empty">Aucun aliment saisi.</td></tr>';
      const t=surveyTotals(),c=calc();$("#surveyKcalTotal").textContent=fmt(t.kcal);$("#surveyPTotal").textContent=fmt(t.p,1);$("#surveyLTotal").textContent=fmt(t.l,1);$("#surveyCTotal").textContent=fmt(t.c,1);$("#surveySummary").innerHTML=[metric("Calories",fmt(t.kcal)+" kcal"),metric("Protéines",fmt(t.p,1)+" g"),metric("Lipides",fmt(t.l,1)+" g"),metric("Glucides",fmt(t.c,1)+" g"),metric("Cible",fmt(c.target)+" kcal")].join("");
      $$('[data-sid]').forEach(e=>e.onchange=()=>{const r=state.survey.find(x=>x.id===e.dataset.sid);r[e.dataset.key]=e.dataset.key==="qty"?num(e.value):e.value;renderAll();save()});$$('[data-del]').forEach(b=>b.onclick=()=>{state.survey=state.survey.filter(r=>r.id!==b.dataset.del);renderAll();save()});$$('[data-dup]').forEach(b=>b.onclick=()=>{const r=state.survey.find(x=>x.id===b.dataset.dup);state.survey.push({...r,id:uid()});renderAll();save()})
    }
    function renderDist(){
      const edit=$("#editEquivs").checked;$("#equivTable tbody").innerHTML=state.equivalents.map((e,i)=>{const q=e.meals.reduce((a,b)=>a+num(b),0),v=k=>edit?`<input class="compact-input" data-eval="${i}" data-key="${k}" type="number" min="0" step="0.1" value="${e[k]}">`:fmt(e[k],1);return `<tr><td><strong>${e.name}</strong></td><td>${e.examples}</td><td class="num">${v("g")}</td><td class="num">${v("kcal")}</td><td class="num">${v("p")}</td><td class="num">${v("l")}</td><td class="num">${v("c")}</td>${[0,1,2,3].map(m=>`<td class="num"><input class="compact-input" data-eq="${i}" data-meal="${m}" type="number" min="0" step="0.25" value="${num(e.meals[m])}"></td>`).join("")}<td class="num">${fmt(q,2)}</td><td class="num">${fmt(q*e.kcal)}</td></tr>`}).join("");
      const d=dist(),c=calc(),gap=c.target?(d.kcal-c.target)/c.target*100:0;$("#distPortions").textContent=fmt(d.portions,2);$("#distKcal").textContent=fmt(d.kcal);$("#distributionSummary").innerHTML=[metric("Cible",fmt(c.target)+" kcal"),metric("Répartition",fmt(d.kcal)+" kcal"),metric("Écart",fmt(d.kcal-c.target)+" kcal",fmt(gap,1)+" %",Math.abs(gap)<=5?"good":""),metric("Protéines",fmt(d.p,1)+" g"),metric("Protéines / kg",fmt(d.p/num(state.profile.weight),2)+" g/kg")].join("");
      $("#mealBreakdown").innerHTML=["Petit-déjeuner","Déjeuner","Collation / Goûter","Dîner"].map((m,i)=>{const t=mealTotal(i);return `<div class="macro-row"><strong>${m}</strong><span>${fmt(t.kcal)} kcal</span><div class="progress"><span style="width:${d.kcal?Math.min(100,t.kcal/d.kcal*100):0}%"></span></div><span class="target">${fmt(t.p,1)} g P</span></div>`}).join("");
      $$('[data-eq]').forEach(e=>e.onchange=()=>{state.equivalents[num(e.dataset.eq)].meals[num(e.dataset.meal)]=num(e.value);renderAll();save()});$$('[data-eval]').forEach(e=>e.onchange=()=>{state.equivalents[num(e.dataset.eval)][e.dataset.key]=num(e.value);renderAll();save()})
    }
    const badge=(v,min,max)=>v>=min&&v<=max?'<span class="badge good">Dans la cible</span>':v>=min-5&&v<=max+5?'<span class="badge warn">Écart modéré</span>':'<span class="badge bad">Écart important</span>';
    function renderBilan(){
      const d=dist(),c=calc(),e=d.p*4+d.l*9+d.c*4,pp=e?d.p*4/e*100:0,lp=e?d.l*9/e*100:0,cp=e?d.c*4/e*100:0,gap=c.target?(d.kcal-c.target)/c.target*100:0,t=state.targets;
      $("#bilanSummary").innerHTML=[metric("Cible",fmt(c.target)+" kcal"),metric("Enquête",fmt(surveyTotals().kcal)+" kcal"),metric("Répartition",fmt(d.kcal)+" kcal"),metric("Écart",fmt(d.kcal-c.target)+" kcal",fmt(gap,1)+" %",Math.abs(gap)<=5?"good":""),metric("IMC",fmt(c.bmi,1),bmiClass(c.bmi))].join("");$("#macroEnergy").textContent=fmt(e);$("#macroDonut").style.background=`conic-gradient(var(--accent) 0 ${pp}%,#4f8fbf ${pp}% ${pp+lp}%,#63a56f ${pp+lp}% 100%)`;$("#macroLegend").innerHTML=[["p","Protéines",d.p,pp],["l","Lipides",d.l,lp],["c","Glucides",d.c,cp]].map(x=>`<div class="legend-item"><span class="dot ${x[0]}"></span><span>${x[1]} · ${fmt(x[2],1)} g</span><strong>${fmt(x[3],1)} %</strong></div>`).join("");$("#macroControls").innerHTML=[["Protéines",pp,t.pMin,t.pMax],["Lipides",lp,t.lMin,t.lMax],["Glucides",cp,t.cMin,t.cMax]].map(x=>`<div class="macro-row"><strong>${x[0]}</strong><span>${fmt(x[1],1)} %</span><div class="progress"><span style="width:${Math.min(100,x[1])}%"></span></div><span class="target">${badge(x[1],x[2],x[3])}</span></div>`).join("");$("#secondaryChecks").innerHTML=`<div class="kpi-line"><span>Protéines / kg</span><strong>${fmt(d.p/num(state.profile.weight),2)} g/kg</strong></div><div class="kpi-line"><span>Cible protéique</span><strong>${fmt(state.profile.proteinTarget,2)} g/kg</strong></div><div class="kpi-line"><span>Écart calories</span><strong>${fmt(gap,1)} %</strong></div><div class="kpi-line"><span>Écart kcal vs macros</span><strong>${fmt(d.kcal-e)} kcal</strong></div>`;$$('[data-target]').forEach(x=>x.value=t[x.dataset.target])
    }
    function renderFoods(){const q=$("#foodSearch").value.trim().toLocaleLowerCase("fr"),list=foods().filter(f=>(f.name+" "+f.category).toLocaleLowerCase("fr").includes(q)).sort((a,b)=>a.category.localeCompare(b.category,"fr")||a.name.localeCompare(b.name,"fr"));$("#foodCount").textContent=list.length+" aliments";$("#foodTable tbody").innerHTML=list.map(f=>`<tr><td><strong>${f.name}</strong></td><td>${f.category}</td><td class="num">${fmt(f.portion)}</td><td class="num">${fmt(f.kcal,1)}</td><td class="num">${fmt(f.p,1)}</td><td class="num">${fmt(f.l,1)}</td><td class="num">${fmt(f.c,1)}</td><td>${f.custom?'<span class="badge warn">Personnalisé</span>':'Moyenne intégrée'}</td><td class="no-print">${f.custom?`<button class="icon-btn" data-food-del="${f.id}">Supprimer</button>`:"—"}</td></tr>`).join("");$$('[data-food-del]').forEach(b=>b.onclick=()=>{state.customFoods=state.customFoods.filter(f=>f.id!==b.dataset.foodDel);renderAll();save()})}
    function renderAll(){renderProfile();renderSurvey();renderDist();renderBilan();renderFoods()}
    function download(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},300)}
    function exportJSON(){download(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),"nutribilan-dossier.json")}
    function exportCSV(){const rows=[["Repas","Aliment","Quantité","kcal","Protéines","Lipides","Glucides"]];state.survey.forEach(r=>{const f=food(r.food);if(f){const q=num(r.qty)/100;rows.push([r.meal,r.food,r.qty,f.kcal*q,f.p*q,f.l*q,f.c*q])}});download(new Blob(["\ufeff"+rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(";")).join("\n")],{type:"text/csv"}),"enquete.csv")}
    function example(){const s=[["Petit-déjeuner","Flocons d'avoine",50],["Petit-déjeuner","Lait écrémé",250],["Petit-déjeuner","Banane",120],["Déjeuner","Blanc de poulet cuit",160],["Déjeuner","Riz blanc cuit",200],["Déjeuner","Brocoli cuit",250],["Déjeuner","Huile d'olive",10],["Collation / Goûter","Skyr nature",150],["Collation / Goûter","Amandes",20],["Dîner","Escalope de dinde cuite",180],["Dîner","Pomme de terre vapeur",250],["Dîner","Haricots verts cuits",300],["Dîner","Huile de colza",10]];state.survey=s.map(x=>({id:uid(),meal:x[0],food:x[1],qty:x[2]}));renderAll();save();}

    $$(".tab").forEach(b=>b.onclick=()=>{$$(".tab").forEach(x=>x.classList.remove("active"));$$(".panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active");scrollTo(0,0)});
    $$('[data-profile]').forEach(e=>e.oninput=()=>{state.profile[e.dataset.profile]=e.dataset.percent!==undefined?num(e.value)/100:(e.type==="number"?num(e.value):e.value);renderAll();save()});
    $("#targetForm").oninput=e=>{if(e.target.dataset.target){state.targets[e.target.dataset.target]=num(e.target.value);renderBilan();save()}};
    ["#addSurveyRow","#addSurveyRow2"].forEach(id=>$(id).onclick=()=>{state.survey.push({id:uid(),meal:"Petit-déjeuner",food:"",qty:100});renderAll();save()});
    $("#addExampleDay").onclick=example;$("#clearSurvey").onclick=()=>{if(confirm("Vider toute l'enquête ?")){state.survey=[];renderAll();save()}};$("#clearDistribution").onclick=()=>{if(confirm("Réinitialiser les portions ?")){state.equivalents.forEach(e=>e.meals=[0,0,0,0]);renderAll();save()}};$("#editEquivs").onchange=renderDist;$("#foodSearch").oninput=renderFoods;
    $("#addCustomFood").onclick=()=>{const name=$("#cfName").value.trim(),category=$("#cfCategory").value.trim();if(!name||!category)return alert("Renseigner le nom et la catégorie.");state.customFoods.push({id:uid(),name,category,portion:num($("#cfPortion").value)||100,kcal:num($("#cfKcal").value),p:num($("#cfP").value),l:num($("#cfL").value),c:num($("#cfC").value),custom:true});["#cfName","#cfCategory","#cfKcal","#cfP","#cfL","#cfC"].forEach(i=>$(i).value="");$("#cfPortion").value=100;renderAll();save(true)};
    ["#saveBtn","#saveBtn2"].forEach(i=>$(i).onclick=()=>save(true));["#exportBtn","#exportBtn2"].forEach(i=>$(i).onclick=exportJSON);["#importBtn","#importBtn2"].forEach(i=>$(i).onclick=()=>$("#importFile").click());$("#importFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);state={...clone(DEF),...x,profile:{...DEF.profile,...x.profile},targets:{...DEF.targets,...x.targets}};renderAll();save(true)}catch{alert("Fichier JSON invalide")}};r.readAsText(f);e.target.value=""};$("#csvBtn").onclick=exportCSV;["#printBtn","#printBtn2"].forEach(i=>$(i).onclick=()=>{$$(".panel").forEach(x=>x.classList.toggle("active",x.id==="bilan"));setTimeout(print,100)});$("#resetAll").onclick=()=>{if(confirm("Effacer toutes les données ?")){state=clone(DEF);renderAll();save(true)}};
    addEventListener("beforeunload",()=>save());renderAll();
    if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
  }
})();

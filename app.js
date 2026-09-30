// EDITA AQUÍ: tu número con código de país, sin + ni espacios (Venezuela = 58)
var WA="584248484818";
// Las camisas se cargan desde catalogo.js (se edita con el administrador)
var DEF=30;
var P=CATALOGO;
function pr(p){return +p.pr>0?+p.pr:DEF}
function off(p){return !!p.of&&+p.dc>0&&+p.dc<pr(p)}
function fin(p){return off(p)?+p.dc:pr(p)}
function money(n){return "$"+String(Math.round(n*100)/100)}
function priceH(p){return off(p)?"<s>"+money(pr(p))+"</s> "+money(fin(p))+' <em class="of">Oferta</em> <small>a tasa BCV</small>':money(fin(p))+" <small>a tasa BCV</small>"}
function cprice(x){var p=P.filter(function(y){return y.eq===x.eq})[0];return p?fin(p):DEF}
P.forEach(function(p){p.j=p.jug[0][0];p.n=p.jug[0][1]});
function wa(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t)}
function card(p,i){
var msg="Hola BROWN, quiero la camisa de "+p.eq+". ¿Qué jugadores y tallas tienen?";
return '<article class="card" data-v="'+i+'">'+cover(p)+'<h3>'+p.eq+'</h3><p class="meta">Jugadores: '+p.jug.map(function(x){return x[0]}).join(", ")+'</p><p>'+p.d+'</p><p class="price">'+priceH(p)+'</p><div class="sizes" aria-label="Tallas disponibles">'+(ut(p).map(function(t){return '<b>'+t+'</b>'}).join("")||'<b class="ag">Agotado</b>')+'</div><button type="button" class="btn" data-v="'+i+'">Ver y elegir</button></article>'}
// Para fotos reales: agrega en cada camisa imgs:["data:image/jpeg;base64,...", (hasta 4)]
var PATH='<path d="M35 8 20 14 4 32l12 12 10-6v54h48V38l10 6 12-12L80 14 65 8Q50 22 35 8Z" fill="#F0CDBD"/>';
function sv(vb,inner,al){return '<svg viewBox="'+vb+'" role="img" aria-label="'+al+'">'+inner+'</svg>'}
function views(p){
if(p.imgs&&p.imgs.length)return p.imgs.slice(0,4).map(function(u,k){return '<img src="'+u+'" alt="Camisa de '+p.eq+', foto '+(k+1)+'">'});
var T='font-family="Anton,Impact,sans-serif" text-anchor="middle" fill="#000"';
return [
sv("0 0 100 100",PATH+'<text x="50" y="66" '+T+' font-size="30">'+p.n+'</text>',"Frente de la camisa de "+p.eq),
sv("0 0 100 100",PATH+'<text x="50" y="40" '+T+' font-size="6.5">'+p.j.toUpperCase()+'</text><text x="50" y="72" '+T+' font-size="34">'+p.n+'</text>',"Espalda con nombre y número"),
sv("25 0 50 40",PATH+'<path d="M35 8Q50 22 65 8" stroke="#000" stroke-width="2" fill="none"/>',"Detalle del cuello"),
sv("0 8 46 42",PATH+'<path d="M16 44 26 38" stroke="#000" stroke-width="2"/>',"Detalle de la manga")]}
function tl(p,k){var j=p.jug[k],x=j[2]||p.tallas;if(x&&!Array.isArray(x))return ["S","M","L","XL"].filter(function(t){return x[t]>0});return x||["S","M","L","XL"]}
function ut(p){var u=[];p.jug.forEach(function(j,k){tl(p,k).forEach(function(t){if(u.indexOf(t)<0)u.push(t)})});return ["S","M","L","XL"].filter(function(t){return u.indexOf(t)>-1})}
function cover(p){var u=p.imgs&&p.imgs[0];return u?'<div class="cph"><img src="'+u+'" alt="Camisa de '+p.eq+'" loading="lazy"></div>':shirt(p)}
function shirt(p){return p.img?'<img src="'+p.img+'" alt="Camisa de '+p.eq+'">':'<svg viewBox="0 0 100 100" role="img" aria-label="Camisa de '+p.eq+'"><path d="M35 8 20 14 4 32l12 12 10-6v54h48V38l10 6 12-12L80 14 65 8Q50 22 35 8Z" fill="#F0CDBD"/><text x="50" y="66" text-anchor="middle" font-family="Anton,Impact,sans-serif" font-size="30" fill="#000">'+p.n+'</text></svg>'}
var dv=document.getElementById("dv"),dvb=document.getElementById("dvb");
function openV(i){var p=P[i],s="L",kk=0;for(var z=0;z<p.jug.length;z++){if(tl(p,z).length){kk=z;break}}p.j=p.jug[kk][0];p.n=p.jug[kk][1];
dvb.innerHTML='<div class="big" id="dvm"></div><div class="thumbs" id="dvth"></div><h2 id="dvt" style="font-size:2.4rem">'+p.eq+'</h2><p class="meta" style="margin:6px 0" id="dvj"></p><p style="margin:0 0 10px">'+p.d+'</p><p class="price" style="margin:0 0 14px">'+priceH(p)+'</p><p style="margin:0 0 8px;font-weight:600">Elige tu jugador</p><div class="sizes" style="gap:8px;flex-wrap:wrap;margin:0 0 16px">'+p.jug.map(function(x,k){return '<button type="button" class="pl" aria-pressed="'+(k===kk)+'"'+(tl(p,k).length?'':' disabled')+'>'+x[0]+' #'+x[1]+(tl(p,k).length?'':' (agotado)')+'</button>'}).join("")+'</div><p style="margin:0 0 8px;font-weight:600">Elige tu talla</p><div class="sizes" id="dvs" style="gap:8px;margin:0 0 18px"></div><button type="button" class="btn" id="dva" style="width:100%">Agregar al carrito</button><a class="btn ghost" id="dvo" target="_blank" rel="noopener" style="display:block;text-align:center;margin-top:10px">Pedir solo esta por WhatsApp</a>';
var o=document.getElementById("dvo");
var V,m=document.getElementById("dvm"),th=document.getElementById("dvth");
function show(k){m.innerHTML=V[k];th.querySelectorAll("button").forEach(function(b,j){b.setAttribute("aria-pressed",j===k)})}
function build(){V=views(p);th.innerHTML=V.map(function(h,k){return '<button type="button" class="th" aria-label="Ver imagen '+(k+1)+' de 4">'+h+'</button>'}).join("");th.querySelectorAll("button").forEach(function(b,k){b.onclick=function(){show(k)}});show(0)}
build();
dvb.querySelectorAll(".pl").forEach(function(b,k){b.onclick=function(){p.j=p.jug[k][0];p.n=p.jug[k][1];dvb.querySelectorAll(".pl").forEach(function(x){x.setAttribute("aria-pressed",x===b)});kk=k;build();drawS()}});
var dvs=document.getElementById("dvs");
function drawS(){var L=tl(p,kk);if(L.indexOf(s)<0)s=L.indexOf("L")>-1?"L":(L[0]||"");
dvs.innerHTML=L.length?L.map(function(t){return '<button type="button" class="sz" aria-pressed="'+(t===s)+'">'+t+'</button>'}).join(""):'<b class="ag">Agotado</b>';
document.getElementById("dva").disabled=!L.length;up()}
function up(){document.getElementById("dvj").textContent="Jugador: "+p.j+", número "+p.n;o.href=wa("Hola BROWN, quiero la camisa de "+p.eq+" ("+p.j+", #"+p.n+") en talla "+s+".");o.textContent="Pedir solo esta en talla "+s+" por WhatsApp"}
drawS();
o.style.display=C.length?"none":"block";
document.getElementById("dva").onclick=function(){add(p.eq,p.j,p.n,s);dv.close()};
dvs.onclick=function(e){var b=e.target.closest(".sz");if(!b)return;s=b.textContent;dvs.querySelectorAll(".sz").forEach(function(x){x.setAttribute("aria-pressed",x===b)});up()};
dv.showModal()}
document.addEventListener("click",function(e){var b=e.target.closest("[data-v]");if(b)openV(+b.dataset.v);if(e.target===dv||e.target.id==="dvx")dv.close()});
var fd=P.map(function(p,i){return [p,i]}).filter(function(x){return x[0].dest});if(!fd.length)fd=P.map(function(p,i){return [p,i]}).slice(0,4);
document.getElementById("dest").innerHTML=fd.map(function(x){return card(x[0],x[1])}).join("");
var PRICE=30,C=[];
try{C=JSON.parse(localStorage.getItem("brown_c")||"[]")}catch(e){C=[]}
function save(){try{localStorage.setItem("brown_c",JSON.stringify(C))}catch(e){}}
function cnt(){var q=C.reduce(function(a,x){return a+x.q},0);document.getElementById("cc").textContent=q;document.getElementById("cb").setAttribute("aria-label","Abrir carrito, "+q+" camisas")}
function toast(m){var t=document.getElementById("toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove("on")},2200)}
function add(eq,j,n,t){var k=eq+"|"+j+"|"+t,f=C.filter(function(x){return x.k===k})[0];if(f)f.q++;else C.push({k:k,eq:eq,j:j,n:n,t:t,q:1});save();cnt();toast("Agregada al carrito")}
var cd=document.getElementById("cart"),cbd=document.getElementById("cbody");
function cthumb(x){var p=P.filter(function(y){return y.eq===x.eq})[0]||{};return views({eq:x.eq,imgs:p.imgs,j:x.j,n:x.n})[0]}
function drawCart(){
if(!C.length){cbd.innerHTML='<p>Tu carrito está vacío. Elige una camisa y agrégala.</p><a class="btn" href="#camisas" data-close style="display:inline-block">Ver camisas</a>';return}
var tot=0,rows=C.map(function(x,i){tot+=x.q*cprice(x);return '<div class="ci"><div class="cth">'+cthumb(x)+'</div><div style="flex:1;min-width:0"><strong>'+x.eq+'</strong><br><span class="meta">'+x.j+' #'+x.n+', talla '+x.t+'</span></div><div class="qty"><button type="button" data-q="'+i+'" data-d="-1" aria-label="Quitar una">−</button><span>'+x.q+'</span><button type="button" data-q="'+i+'" data-d="1" aria-label="Agregar una">+</button></div></div>'}).join("");
cbd.innerHTML=rows+'<p class="price" style="margin:16px 0 10px">Total '+money(tot)+' <small>a tasa BCV</small></p><a class="btn" id="cs" target="_blank" rel="noopener" style="display:block;text-align:center">Enviar pedido por WhatsApp</a><button type="button" class="btn ghost" id="cv" style="width:100%;margin-top:10px">Vaciar carrito</button>';
document.getElementById("cs").href=wa("Hola BROWN, quiero hacer este pedido:\n"+C.map(function(x){return "- "+x.q+" x "+x.eq+", "+x.j+" #"+x.n+", talla "+x.t}).join("\n")+"\nTotal: "+money(tot)+" a tasa BCV")}
document.addEventListener("click",function(e){
var b=e.target.closest("[data-q]");
if(b){var i=+b.dataset.q;C[i].q+=+b.dataset.d;if(C[i].q<1)C.splice(i,1);save();cnt();drawCart();return}
if(e.target.id==="cv"){C=[];save();cnt();drawCart();return}
if(e.target.closest("#cb")){drawCart();cd.showModal();return}
if(e.target===cd||e.target.id==="cx"||e.target.closest("[data-close]"))cd.close()});
var CAT={retro:"Retro",sel:"Selecciones",club:"Clubes actuales"},cat="all",qi=document.getElementById("q");
function nz(x){return x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function list(){var q=nz(qi.value.trim());
var r=P.map(function(p,i){return [p,i]}).filter(function(x){var p=x[0];return (cat==="all"||p.cat===cat)&&nz(p.eq+" "+p.jug.map(function(j){return j[0]}).join(" ")+" "+CAT[p.cat]).indexOf(q)>-1});
document.getElementById("todas").innerHTML=r.length?r.map(function(x){return card(x[0],x[1])}).join(""):'<p>No encontramos esa camisa. <a href="'+wa("Hola BROWN, ¿pueden conseguirme una camisa? Busco: "+qi.value)+'" target="_blank" rel="noopener">Escríbenos por WhatsApp</a> y la buscamos.</p>';
document.getElementById("cnt").textContent=r.length+(r.length===1?" camisa":" camisas")}
qi.addEventListener("input",list);
document.getElementById("chips").addEventListener("click",function(e){var b=e.target.closest("[data-c]");if(!b)return;cat=b.dataset.c;this.querySelectorAll(".chip").forEach(function(x){x.setAttribute("aria-pressed",x===b)});list()});
list();cnt();
document.querySelectorAll("[data-wa]").forEach(function(a){a.href=wa(a.dataset.wa);a.target="_blank";a.rel="noopener"});
document.getElementById("f").addEventListener("submit",function(e){e.preventDefault();var d=e.target;
var t="Hola BROWN, soy "+d.n.value+". Me interesa: "+(d.c.value||"ver camisas")+". Talla: "+d.t.value+"."+(d.m.value?" "+d.m.value:"");
window.open(wa(t),"_blank","noopener")});
var T={inicio:"BROWN | Camisas de fútbol en El Tigre, Venezuela",camisas:"Camisas de fútbol en El Tigre | BROWN",contacto:"Contacto y WhatsApp | BROWN"};
function route(){var h=(location.hash||"#inicio").slice(1);if(!T[h])h="inicio";
document.querySelectorAll(".page").forEach(function(p){p.classList.toggle("on",p.id===h)});
document.querySelectorAll("nav a").forEach(function(a){a.getAttribute("href")==="#"+h?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")});
document.title=T[h];window.scrollTo(0,0)}
document.documentElement.classList.add("js");
window.addEventListener("hashchange",route);route();

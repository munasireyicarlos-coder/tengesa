const API = "/api";
document.querySelector(".menu-toggle")?.addEventListener("click",()=>document.querySelector(".nav-links")?.classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach(a=>{if(a.href===location.href)a.classList.add("active")});
document.getElementById("year")?.replaceChildren(document.createTextNode(new Date().getFullYear()));

const money = (n,c) => `${c || "USD"} ${Number(n || 0).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2})}`;
function listingCard(item){
 const img=item.imageUrl || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=900&q=80";
 return `<article class="card"><img src="${img.replace(/"/g,"%22")}" alt="${String(item.title).replace(/"/g,"&quot;")}" loading="lazy"><div class="card-body"><div class="card-meta"><span>${item.category}</span>${item.featured?'<span class="pill">Featured</span>':''}</div><h3>${item.title}</h3><div class="price">${money(item.price,item.currency)}</div><p class="muted small">${item.sellerName || "Tengesa seller"}</p><p class="muted small">${item.description || ""}</p><a class="btn btn-outline" href="contact.html?type=Buyer%20Support">Enquire about item</a></div></article>`;
}
async function loadListings(){
 const grid=document.getElementById("listing-grid"); if(!grid)return;
 try{const r=await fetch(`${API}/listings`);const data=await r.json();if(!r.ok)throw new Error(data.error||"Could not load listings");grid.innerHTML=data.listings.length?data.listings.map(listingCard).join(""):'<div class="empty">No listings yet. Check back soon.</div>';}
 catch(e){grid.innerHTML='<div class="empty">Marketplace listings are temporarily unavailable. Please check back soon.</div>';}
}
loadListings();

document.getElementById("contact-form")?.addEventListener("submit",async e=>{
 e.preventDefault();const form=e.currentTarget;const msg=document.getElementById("contact-message");const data=Object.fromEntries(new FormData(form).entries());
 msg.className="notice";msg.textContent="Sending your enquiry…";
 try{const r=await fetch(`${API}/contact`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const out=await r.json();if(!r.ok)throw new Error(out.error||"Could not send");msg.textContent=out.message+(out.emailSent?" A confirmation email has been sent.":" Our team will follow up; email notifications may be temporarily unavailable.");form.reset();}
 catch(err){msg.textContent=err.message;}
});
const params=new URLSearchParams(location.search);if(params.get("type")&&document.getElementById("inquiryType"))document.getElementById("inquiryType").value=params.get("type");

document.getElementById("newsletter-form")?.addEventListener("submit",async e=>{
 e.preventDefault();const form=e.currentTarget;const msg=document.getElementById("newsletter-message");msg.className="notice";msg.textContent="Submitting…";
 try{const r=await fetch(`${API}/subscribe`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:new FormData(form).get("email")})});const d=await r.json();if(!r.ok)throw new Error(d.error);msg.textContent=d.message;form.reset();}
 catch(err){msg.textContent=err.message||"Subscription could not be completed.";}
});

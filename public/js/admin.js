const adminAPI="/api";
let adminToken=sessionStorage.getItem("tengesaAdminToken")||"";
const byId=id=>document.getElementById(id);
function showAdmin(){byId("login-panel").classList.toggle("hidden",!!adminToken);byId("admin-content").classList.toggle("hidden",!adminToken);if(adminToken)loadInquiries();}
async function api(path,opts={}){const r=await fetch(adminAPI+path,{...opts,headers:{...(opts.headers||{}),Authorization:`Bearer ${adminToken}`}});const d=await r.json();if(!r.ok)throw new Error(d.error||"Request failed");return d;}
byId("admin-login")?.addEventListener("submit",async e=>{e.preventDefault();adminToken=byId("admin-password").value;sessionStorage.setItem("tengesaAdminToken",adminToken);try{await api("/inquiries");byId("admin-login-message").textContent="Signed in.";showAdmin();}catch(err){adminToken="";sessionStorage.removeItem("tengesaAdminToken");byId("admin-login-message").textContent=err.message;}});
byId("logout-btn")?.addEventListener("click",()=>{adminToken="";sessionStorage.removeItem("tengesaAdminToken");showAdmin();});
async function loadInquiries(){const el=byId("inquiries-list");try{const d=await api("/inquiries");if(!d.inquiries.length){el.innerHTML='<div class="empty">No enquiries received yet.</div>';return;}el.innerHTML=`<div class="table-wrap"><table><thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Type</th><th>Message</th><th></th></tr></thead><tbody>${d.inquiries.map(i=>`<tr><td>${new Date(i.createdAt).toLocaleDateString()}</td><td>${i.name}</td><td>${i.email}</td><td>${i.inquiryType}</td><td>${i.message}</td><td><button class="btn btn-outline" data-delete-inquiry="${i._id}">Delete</button></td></tr>`).join("")}</tbody></table></div>`;}catch(e){el.textContent=e.message;}}
byId("inquiries-list")?.addEventListener("click",async e=>{const id=e.target.dataset.deleteInquiry;if(!id)return;if(!confirm("Delete this enquiry?"))return;try{await api(`/inquiries/${id}`,{method:"DELETE"});loadInquiries();}catch(err){alert(err.message);}});
byId("listing-image")?.addEventListener("change",async e=>{
 const file=e.target.files[0];if(!file)return;const message=byId("listing-message");message.textContent="Preparing secure image upload…";
 try{
  const auth=await api("/imagekit-auth");
  if(!window.ImageKit)throw new Error("ImageKit upload library did not load. Check your internet connection and refresh.");
  const client=new ImageKit({publicKey:auth.publicKey,urlEndpoint:auth.urlEndpoint});
  client.upload({file,fileName:file.name,token:auth.token,signature:auth.signature,expire:auth.expire,tags:["tengesa-marketplace"]},(err,result)=>{
   if(err){message.textContent=err.message;return;}
   byId("image-url").value=result.url+"?tr=f-auto";
   message.textContent="Image uploaded successfully.";
  });
 }catch(err){message.textContent=err.message;}
});
byId("listing-form")?.addEventListener("submit",async e=>{
 e.preventDefault();const form=e.currentTarget;const fd=new FormData(form);const data=Object.fromEntries(fd.entries());data.price=Number(data.price);data.featured=fd.get("featured")==="on";
 try{await api("/listings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});byId("listing-message").textContent="Listing saved.";form.reset();}catch(err){byId("listing-message").textContent=err.message;}
});
showAdmin();


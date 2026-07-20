// ================================
// BharatPlate Meta Pixel
// Pixel ID: 2207825566632731
// ================================

(function(f,b,e,v,n,t,s){
if(f.fbq)return;
n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;
n.push=n;
n.loaded=!0;
n.version='2.0';
n.queue=[];
t=b.createElement(e);
t.async=!0;
t.src=v;
s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s);
})(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init','2207825566632731');
fbq('track','PageView');

// Product viewed
fbq('track','ViewContent');

// Vehicle Number
const plate=document.getElementById("plateInput");
if(plate){
let done=false;
plate.addEventListener("input",()=>{
if(done) return;
if(plate.value.length>=4){
done=true;
fbq("track","Lead");
}
});
}

// Book Now
const book=document.getElementById("bookBtn");
if(book){
book.addEventListener("click",()=>{
fbq("track","InitiateCheckout");
});
}

// Address Started
["addrName","addrPhone","addrStreet","addrCity","addrPin"].forEach(id=>{
const el=document.getElementById(id);
if(el){
el.addEventListener("focus",()=>{
fbq("track","AddPaymentInfo");
},{once:true});
}
});

// Purchase
window.metaPurchase=function(amount){
fbq("track","Purchase",{
value:amount,
currency:"INR"
});
};

// Payment Failed
window.metaFailed=function(){
fbq("trackCustom","PaymentFailed");
};
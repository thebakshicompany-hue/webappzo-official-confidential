import React, { useEffect, useRef } from 'react'; 
  
 const TwoFilloutSlidersSideBySide = () => { 
   const slider1Ref = useRef(null); 
   const slider2Ref = useRef(null); 
  
   useEffect(() => { 
     const scriptSrc = 'https://fillout.com/embed/sdk.js'; 
     const script = document.createElement('script'); 
     script.src = scriptSrc; 
     script.async = true; 
  
     if (slider1Ref.current) { 
       const clone1 = script.cloneNode(true); 
       slider1Ref.current.appendChild(clone1); 
     } 
     if (slider2Ref.current) { 
       const clone2 = script.cloneNode(true); 
       slider2Ref.current.appendChild(clone2); 
     } 
  
     return () => { 
       if (slider1Ref.current) { 
         const scripts1 = slider1Ref.current.querySelectorAll(`script[src="${scriptSrc}"]`); 
         scripts1.forEach(s => slider1Ref.current.removeChild(s)); 
       } 
       if (slider2Ref.current) { 
         const scripts2 = slider2Ref.current.querySelectorAll(`script[src="${scriptSrc}"]`); 
         scripts2.forEach(s => slider2Ref.current.removeChild(s)); 
       } 
     }; 
   }, []); 
  
   return ( 
     <div 
       style={{ 
         display: 'flex', 
         flexDirection: 'row', 
         justifyContent: 'space-around', 
         alignItems: 'flex-start',  // align both sliders at top 
         gap: '20px', 
         padding: '20px' 
       }} 
     > 
       {/* First slider: “Create your website” */} 
       <div 
         ref={slider1Ref} 
         data-fillout-id="sbU4qFwACJus" 
         data-fillout-embed-type="slider" 
         data-fillout-button-text="Create your website" 
         data-fillout-button-float="top-right" 
         data-fillout-slider-direction="right" 
         data-fillout-inherit-parameters 
         data-fillout-popup-size="medium" 
         style={{ 
           flex: '1', 
           position: 'relative', 
           zIndex: 1000, 
           // optional: you can give some extra top margin/padding if you want this one even more “upper” 
           marginTop: '20px' 
         }} 
       > 
         {/* script will be injected here */} 
       </div> 
  
       {/* Second slider: “Create your app” */} 
       <div 
         ref={slider2Ref} 
         data-fillout-id="r9HKBZHwbjus" 
         data-fillout-embed-type="slider" 
         data-fillout-button-text="Create your app" 
         data-fillout-button-float="bottom-right" 
         data-fillout-slider-direction="right" 
         data-fillout-inherit-parameters 
         data-fillout-popup-size="medium" 
         style={{ 
           flex: '1', 
           position: 'relative', 
           zIndex: 1000, 
           // maybe add less top margin so it appears slightly lower 
           marginTop: '80px' 
         }} 
       > 
         {/* script will be injected here */} 
       </div> 
     </div> 
   ); 
 }; 
  
 export default TwoFilloutSlidersSideBySide;
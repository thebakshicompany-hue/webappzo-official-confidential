import React, { useEffect, useRef } from 'react';

const TwoFilloutSliders = () => {
  const slider1Ref = useRef(null);
  const slider2Ref = useRef(null);

  useEffect(() => {
    const scriptSrc = 'https://server.fillout.com/embed/v1/';
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;

    // Append script to first slider (website)
    if (slider1Ref.current) {
      const clone1 = script.cloneNode(true);
      slider1Ref.current.appendChild(clone1);
    }
    // Append script to second slider (app)
    if (slider2Ref.current) {
      const clone2 = script.cloneNode(true);
      slider2Ref.current.appendChild(clone2);
    }

    // Cleanup on unmount
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
    <div>
      {/* First slider: “Create your website”, positioned top-right */}
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
          position: 'fixed',
          top: '200px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        {/* The script for this slider will be injected dynamically */}
      </div>

      {/* Second slider: “Create your app”, positioned bottom-right */}
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
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        {/* The script for this slider will be injected dynamically */}
      </div>
    </div>
  );
};

export default TwoFilloutSliders;
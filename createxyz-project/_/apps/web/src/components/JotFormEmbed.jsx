import React, { useEffect } from "react";

/**
 * Embeds a Jotform "Agent" widget (floating button that opens chat/form).
 * The external script attaches itself to the DOM and initializes automatically.
 *
 * Notes:
 * 1. Script tags included directly in JSX are not executed when rendered by React.
 *    Therefore we create and append the <script> element imperatively in `useEffect`.
 * 2. We guard against injecting the script multiple times by checking existing tags.
 */
const JotFormEmbed = () => {
  useEffect(() => {
    const src =
      "https://cdn.jotfor.ms/agent/embedjs/01998a3b3f757c41a015cb1e8c8094b48578/embed.js";

    // Prevent duplicating the script if component mounts multiple times
    if (document.querySelector(`script[src=\"${src}\"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional cleanup: remove script and any injected container if needed
      script.remove();
      const injected = document.getElementById("jotform-agent-container");
      injected?.remove();
    };
  }, []);

  // The Jotform script appends its own container. Rendering a placeholder div
  // helps keep React DOM happy and provides a predictable anchor.
  return <div id="jotform-agent-container" />;
};

export default JotFormEmbed;
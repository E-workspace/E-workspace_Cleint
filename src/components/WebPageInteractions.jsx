import { useEffect } from "react";

const WebPageInteractions = () => {
  useEffect(() => {
    const sendCursorData = (x, y) => {
      const data = {
        type: "cursor",
        x,
        y,
        timestamp: Date.now(),
      };
      // Send the cursor data to the parent window (allowing multiple origins)
      window.parent.postMessage(data, "*");  // Use "*" to allow all origins (for multiple origins)
    };

    const sendScrollData = () => {
      const data = {
        type: "scroll",
        x: window.scrollX,
        y: window.scrollY,
        height: document.documentElement.scrollHeight,
      };
      // Send the scroll data to the parent window (allowing multiple origins)
      window.parent.postMessage(data, "*");  // Use "*" to allow all origins (for multiple origins)
    };

    const handleMouseMove = (event) => {
      const x = event.clientX + window.scrollX;
      const y = event.clientY + window.scrollY;
      sendCursorData(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", sendScrollData);

    // Send initial scroll data
    sendScrollData();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", sendScrollData);
    };
  }, []);

  return null;
};

export default WebPageInteractions;

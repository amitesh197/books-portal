import React, { useState, useEffect } from "react";

function ScrollToTopBtn() {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsShown(true);
      } else {
        setIsShown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Add smooth behavior for scrolling
    });
  };

  return (
    isShown && (
      <button
        className="fixed bottom-10 right-5 py-2 px-4 rounded-lg bg-theme-yellow-dark opacity-70"
        id="scrollToTopBtn"
        onClick={scrollToTop}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    )
  );
}

export default ScrollToTopBtn;

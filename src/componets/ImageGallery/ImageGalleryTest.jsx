// Import React hooks for state and effect management
import { useState, useEffect } from "react";
// Import the ImageGallery component to display individual images
import ImageGallery from "./ImageGallery";
import ImageGallerySkeleton from "./ImageGallerySkeleton";

// ImageGalleryTest component displays a list of images with infinite scroll
const ImageGalleryTest = () => {
  // Array of image URLs to display
  const images = [
    "https://static0.moviewebimages.com/wordpress/wp-content/uploads/2025/02/solo-leveling.jpg?w=1200&h=675&fit=crop",
    "https://sm.ign.com/ign_ap/feature/t/the-top-25/the-top-25-greatest-anime-characters-of-all-time_ge1p.jpg",
    "https://www.pixelstalk.net/wp-content/uploads/images6/Anime-Boy-Wallpaper-Desktop.jpg",
    "https://dnm.nflximg.net/api/v6/BvVbc2Wxr2w6QuoANoSpJKEIWjQ/AAAAQdijaddVypbSMdE-2LSv3sPRMibAe-OvndSlA_z-XFhHiD8hNTj_SGKHXBXTaC5AlBn4kRNZOUuGeJx6Z2Qp1_4uswbQjjS9lieaYdeIfznjWnuDL9S5y26dceo_b4T82l6tds2usbuXuOcErYu2SAjzGLU.jpg?r=007",
    "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/F382/production/_123883326_852a3a31-69d7-4849-81c7-8087bf630251.jpg",
    "https://static.toiimg.com/thumb/msid-121340289,width-1280,height-720,resizemode-4/121340289.jpg",
    "https://static0.colliderimages.com/wordpress/wp-content/uploads/2023/03/jujutsu-kaisen-gojo-season-2.png?w=1200&h=675&fit=crop",
  ];

  // State to track how many images are currently visible
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ///Simulate loading ex. 1 sec
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Effect to handle infinite scroll: loads more images when user scrolls near the bottom
  useEffect(() => {
    const handleScroll = () => {
      // If user is within 100px of the bottom and there are more images to show, load more
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        visibleCount < images.length
      ) {
        setVisibleCount((prev) => Math.min(prev + 6, images.length));
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);
    // Clean up the event listener on unmount or when dependencies change
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, images.length]);

  return (
    <>
      {/* Container for the image gallery cards */}
      <div className="card-list">
        {/* Render only the visible images */}
        {loading ? (
          <ImageGallerySkeleton count={images.length} />
        ) : (
          images
            .slice(0, visibleCount)
            .map((src, i) => <ImageGallery key={i} src={src} />)
        )}
      </div>
    </>
  );
};

// Export the test component for use in App or elsewhere
export default ImageGalleryTest;

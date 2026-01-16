// Import React's useState hook for managing component state
import { useState } from "react";
// Import the CSS file for styling the component
import "./ImageGallery.css";

// ImageGallery component displays an image with a button to view it in a modal
const ImageGallery = ({ src }) => {
  // State to control whether the modal is open or closed
  const [modalOpen, setModalOpen] = useState(false);

  // Open the modal when the button is clicked
  const handleViewFullImage = () => {
    setModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* Image container with the main image and the view button */}
      <div className="image-container">
        {/* Display the image */}
        <img src={src} alt="Placeholder image" />
        {/* Button overlays the image, opens modal on click */}
        <button onClick={handleViewFullImage}>
          <span>View Full Image</span>
        </button>
      </div>
      {/* Modal: only rendered if modalOpen is true */}
      {modalOpen && (
        <div className="image-modal" onClick={handleCloseModal}>
          {/* Prevent modal from closing when clicking inside the content */}
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full-size image in the modal */}
            <img src={src} alt="Full size" />
            {/* Close button for the modal */}
            <button onClick={handleCloseModal}>X</button>
          </div>
        </div>
      )}
    </>
  );
};

// Export the component for use in other files
export default ImageGallery;

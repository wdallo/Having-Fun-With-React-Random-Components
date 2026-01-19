const ImageGallerySkeleton = ({ count }) => (
  <div className="card-list">
    {Array.from({ length: count }).map((_, i) => (
      <div className="image-skeleton" key={i}>
        <div className="image-skeleton-loading-bars">
          <div className="image-skeleton-loading-bar"></div>
          <div className="image-skeleton-loading-bar"></div>
          <div className="image-skeleton-loading-bar"></div>
        </div>
      </div>
    ))}
  </div>
);

export default ImageGallerySkeleton;

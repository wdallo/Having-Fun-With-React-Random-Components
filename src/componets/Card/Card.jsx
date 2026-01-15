import "./Card.css";
import lionImg from "./img.png";

const Card = () => {
  return (
    <div className="card-container">
      <div className="card">
        <img src={lionImg} alt="The Lion King" />
        <div className="card-content">
          <h2 className="card-title">The Lion King</h2>
          <p className="card-subtext">2019. Jon Favreau</p>
          <div className="card-duration">2h 22m</div>
          <div className="card-stars">★ ★ ★ ★ ★</div>
          <div className="card-genres">
            <span className="card-genre">#drama</span>
            <span className="card-genre">#adventure</span>
            <span className="card-genre">#family</span>
          </div>
        </div>
        <button className="card-watch-now">WATCH NOW</button>
      </div>
    </div>
  );
};

export default Card;

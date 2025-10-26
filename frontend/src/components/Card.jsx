import "../styles/Card.css";

export default function Card({ title, description, buttonLabel, onButtonClick }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      {buttonLabel && <button onClick={onButtonClick}>{buttonLabel}</button>}
    </div>
  );
}
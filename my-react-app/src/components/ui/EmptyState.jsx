import { Link } from "react-router-dom";

const EmptyState = ({
  title = "Nothing here yet",
  text = "No data available.",
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{text}</p>

      {buttonText && buttonLink && (
        <Link to={buttonLink} className="primary-btn empty-state-btn">
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

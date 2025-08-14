import "../style/invitado/featureCard.css"
import { icons } from "./icons"

export default function FeatureCard({ feature }) {
  const { iconName, title, description } = feature;

  return (
    <div className="card">
      <div className="icon-container">{icons[iconName]}</div>
      <h3 className="title">{title}</h3>
      <p className="description">{description}</p>
    </div>
  );
}

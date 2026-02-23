import "../style/invitado/featurecard.css";
import { ListSvg } from "./Icons"

export default function FeatureCard({ feature }) {
  const { iconName, title, description } = feature;

  return (
    <div className="card">
      <div className="icon-container"><ListSvg name={iconName} height={32} width={32}/></div>
      <h3 className="title">{title}</h3>
      <p className="description">{description}</p>
    </div>
  );
}

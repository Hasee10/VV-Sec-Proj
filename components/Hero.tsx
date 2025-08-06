import { Hero3D } from './3D/Hero3D';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <Hero3D
      badge="For Your Digital Future"
      subtitle="We are a Digital Agency that"
      title="Made Usability"
      description="Helps Brands become the Digital Be Made. We combine AI, design, and development to create extraordinary digital experiences that drive growth and innovation."
      primaryCTA={{
        text: "View Showreel",
        onClick: () => navigate('/projects')
      }}
      secondaryCTA={{
        text: "Get Started",
        onClick: () => navigate('/contact')
      }}
    />
  );
}
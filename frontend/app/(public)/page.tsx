import SplashScreen from '@/components/auth/SplashScreen';

export const metadata = {
  title: 'RaituSevak360 - Smart Agriculture Platform',
  description: 'Empowering Indian Agriculture with AI-powered tools',
};

export default function HomePage() {
  return <SplashScreen autoRedirect={true} redirectUrl="/language-selection" />;
}

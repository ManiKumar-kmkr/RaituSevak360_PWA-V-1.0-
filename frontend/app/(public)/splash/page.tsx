import SplashScreen from '@/components/auth/SplashScreen';

export const metadata = {
  title: 'Welcome to RaituSevak360',
  description: 'Empowering Indian Agriculture with smart digital tools',
};

export default function SplashPage() {
  return <SplashScreen autoRedirect={true} redirectUrl="/language-selection" />;
}

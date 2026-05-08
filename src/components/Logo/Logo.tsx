import './logo.pcss';
import { appVersion } from '../../appVersion';

export function Logo() {
  return (
    <div className="logo">
      <span className="logo__todos">TODOS<sup className="logo__version">v{appVersion}</sup></span>
      <span className="logo__daily">daily</span>
    </div>
  );
}

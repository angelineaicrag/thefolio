// src/components/Footer.js
import wlogo from '../assets/wlogo.png';
import fbImg from '../assets/fb.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-icons">
          <img src={wlogo} width="30" height="30" alt="Wattpad logo" />
          <img src={fbImg} width="30" height="30" alt="Facebook logo" />
        </div>
        <p>Wattpad: GuardianAngel</p>
        <p>FB: Angeline Garcia</p>
        <p>Email: ange@student.dmmmsu.edu.ph</p>
        <p>&copy; All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
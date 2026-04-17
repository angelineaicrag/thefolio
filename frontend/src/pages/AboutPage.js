// src/pages/AboutPage.js
import moonImg from '../assets/moon.jpg';
import mlImg from '../assets/ml.jpg';
import jonImg from '../assets/jon.jpg';
import tcImg from '../assets/tc.jpg';
import ssoImg from '../assets/sso.jpg';
import ilyImg from '../assets/ily.jpg';
import hellImg from '../assets/hell.jpg';
import mbImg from '../assets/mb.jpg';
import tosImg from '../assets/tos.jpg';
import araImg from '../assets/ara.jpg';
import amnseImg from '../assets/amnse.jpg';
import etwImg from '../assets/etw.jpg';
import hesImg from '../assets/hes.jpg';
import saaImg from '../assets/saa.jpg';
import wwwImg from '../assets/www.jpg';
import csImg from '../assets/cs.jpg';
import AuthorGame from './AuthorGame'; // Import the AuthorGame component

function AboutPage() {
  return (
    <>
      <section className="ilw">
        <h2>Why I Love Wattpad</h2>
        <p>
          Wattpad plays an important role in my life. It has become a safe and personal space where I find comfort and inspiration. Through the stories I have read, I have learned many lessons, gained new perspectives, and discovered meaningful insights that continue to shape my growth as a reader.
        </p>
      </section>

      <section className="previews">
        <div className="card">
          <img src={moonImg} width="200" height="200" alt="Moon story" />
        </div>
        <div className="card">
          <img src={mlImg} width="200" height="200" alt="ML story" />
        </div>
        <div className="card">
          <img src={jonImg} width="200" height="200" alt="Jon story" />
        </div>
        <div className="card">
          <img src={tcImg} width="200" height="200" alt="TC story" />
        </div>
        <div className="card">
          <img src={ssoImg} width="200" height="200" alt="SSO story" />
        </div>
        <div className="card">
          <img src={ilyImg} width="200" height="200" alt="ILY story" />
        </div>
        <div className="card">
          <img src={hellImg} width="200" height="200" alt="Hell story" />
        </div>
        <div className="card">
          <img src={mbImg} width="200" height="200" alt="MB story" />
        </div>
      </section>

      <br />
      <br />

      <section className="mwj">
        <h2>My Wattpad Journey</h2>
        <p>
          I started reading Wattpad at a young age. Over time, I explored different
          genres, which helped me discover stories that matched my interests and emotions. Wattpad has become my safe space-a place where I can relax, escape and immerse myself in creative worlds.
        </p>
      </section>

      <br />
      <br />

      <section className="previews">
        <div className="card">
          <img src={tosImg} width="200" height="200" alt="TOS story" />
        </div>
        <div className="card">
          <img src={araImg} width="200" height="200" alt="ARA story" />
        </div>
        <div className="card">
          <img src={amnseImg} width="200" height="200" alt="AMNSE story" />
        </div>
        <div className="card">
          <img src={etwImg} width="200" height="200" alt="ETW story" />
        </div>
        <div className="card">
          <img src={hesImg} width="200" height="200" alt="HES story" />
        </div>
        <div className="card">
          <img src={saaImg} width="200" height="200" alt="SAA story" />
        </div>
        <div className="card">
          <img src={wwwImg} width="200" height="200" alt="WWW story" />
        </div>
        <div className="card">
          <img src={csImg} width="200" height="200" alt="CS story" />
        </div>
      </section>

      <section className="genres">
        <h3>Genres I Enjoy Reading</h3>
        <ol>
          <li>Romance</li>
          <li>Fantasy</li>
          <li>Mystery</li>
          <li>Teen Fiction</li>
          <li>Slice of Life</li>
        </ol>

        <blockquote>
          "I didn't just read stories-I found comfort, lessons, and a safe place within them"
        </blockquote>
      </section>

      <section className="mini-game">
        <h2>Mini Game 🎮</h2>
        <p>Test your knowledge about Wattpad authors and stories!</p>
        <AuthorGame /> {/* Add the game component here */}
      </section>
    </>
  );
}

export default AboutPage;
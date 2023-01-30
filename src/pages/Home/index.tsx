import React from "react";
import { Link } from "react-router-dom"; // Single-Page Application
import { FiLogIn } from "react-icons/fi";
import logo from "../../assets/logo.svg";
import "./styles.css";

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Reciclagem" />
        </header>

        <main>
          <h1>Coleta Seletiva e reciclagem em geral.</h1>
          <p>
            Reciclagem de materiais diversos, tais como, papel, plástico, metal,
            pilhas e baterias, etc.
          </p>

          {/*tag a = estilizada pelo css como um botão */}
          <Link to="/create-location">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastrar novo local de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;

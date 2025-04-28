import { useNavigate } from "react-router-dom";
import "../styles/MenuElement.css";
export default function MenuElement({ titulo, active, setActive }) {
  const navigate = useNavigate();

  return (
    <h3
      className={`menu-element ${active === titulo ? "menu-active" : ""}`}
      onClick={() => {
        navigate(`/${titulo.toLowerCase()}`);
        setActive(titulo);
      }}
    >
      {titulo}
    </h3>
  );
}

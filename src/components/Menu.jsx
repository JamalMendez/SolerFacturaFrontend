import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";

import MenuElement from "./MenuElement";
export default function Menu() {
  const menusTitles = ["Factura", "NCF", "Clientes", "Productos"];
  const [active, setActive] = useState(null);
  const [menuActive, setMenuActive] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      {/*MENU HAMBURGUESA*/}
      <img
        className={menuActive ? "menu-hamburguesa-blanco" : "menu-hamburguesa"}
        src={
          menuActive
            ? "/images/menu-hamburguesa.svg"
            : "/images/menu-hamburguesa-negro.svg"
        }
        alt="menu-hamburguesa"
        onClick={() => setMenuActive(!menuActive)}
      />

      {/*MENU*/}
      <nav className={`nav-menu ${!menuActive ? "menu-disabled" : ""}`}>
        <img
          className="img-larga"
          width={"200px"}
          src="/images/R.electro solar logo (3).png"
          alt="Electro Solar Completo"
          onClick={() =>{
            setActive('Factura')
            navigate("/")
          }}
        />

        {/* PARA PANTALLAS PEQUEÑAS */}
        <img
          className="img-corta"
          style={{ margin: "40px auto 0" }}
          width={"90px"}
          src="/images/Isotipo relectro solar.png"
          alt="Electro Solar Corto"
        />

        <div className="container-menu-element">
          {menusTitles.map((menu, i) => (
            <MenuElement
              titulo={menu}
              key={i}
              active={active}
              setActive={setActive}
            />
          ))}
        </div>
      </nav>
    </>
  );
}

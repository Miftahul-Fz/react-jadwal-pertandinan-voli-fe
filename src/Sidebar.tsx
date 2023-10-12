import "./Sidebar.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
        faDashboard,
        faPeopleGroup, 
        faCalendarDay, 
        faLayerGroup,
        faRightFromBracket
      } from "@fortawesome/free-solid-svg-icons";
import {
        Sidebar,
        SubMenu,
        Menu,
        MenuItem
      } from "react-pro-sidebar";

function Sidebars() {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const token = localStorage.getItem('token')

  const toJadwal = () => {
    window.location. href = "/jadwal"
  }

  const toTeam = () => {
    window.location. href = "/team"
  }

  const toAtlit = () => {
    window.location. href = "/atlit"
  }

  const handleLogout = async () => {
    try {
      const logoutResponse = await fetch('http://jadwal-voli.test/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Accept: 'aplication/json',
          Authorization: `Bearer ${token}`
        }
      })
      const logout = await logoutResponse.json;
      localStorage.removeItem('token')
      window.location.href = "/login"
      return logout;
    }catch (error) {
      console.error('terjadi kesalahan', Error)
    }
  }

  return (
    <div>
      <div>
      <nav style={{position: 'fixed', zIndex: 2}} className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow fixed-top">
        <div className="container">
          <button></button>
          
          <div className="ml-auto">
            <button className="btn btn-outline-danger" onClick={handleLogout}> <FontAwesomeIcon icon={faRightFromBracket} /> LOGOUT</button>
          </div>
        </div>
      </nav>
      </div>
      <div className="sidebar " >
        <Sidebar
          className={`app ${toggled ? "toggled" : ""}`}
          style={{ height: "100%", position: "fixed", backgroundColor: 'F0FFFF', zIndex: 2 }}
          collapsed={collapsed}
          toggled={toggled}
          >
          <main>
            <Menu>
              <center>
              <a href="#"><img src="/img/proliga.png" alt="logo" style={{height: '40px'}}/></a>
              </center>
            </Menu>
            <hr />
            <Menu>
              <MenuItem> <FontAwesomeIcon icon={faDashboard}/> Dashboard</MenuItem>
              <MenuItem onClick={toJadwal}> <FontAwesomeIcon icon={faCalendarDay}/> Jadwal</MenuItem>
              <MenuItem onClick={toTeam}> <FontAwesomeIcon icon={faLayerGroup}/> Team</MenuItem>
              <MenuItem onClick={toAtlit}> <FontAwesomeIcon icon={faPeopleGroup}/> Atlit</MenuItem>
            </Menu>
          </main>
        </Sidebar>
      </div>
    </div>
  );
}
export default Sidebars;

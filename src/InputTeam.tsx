import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from "./header";
import './style.css'
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import Sidebars from "./Sidebar";



export const InputTeam = () => {
  const [inputTeam, setInputTeam] = useState({
    nama_team: "",
    asal_team: "",
  });
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
    }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputTeam({ ...inputTeam, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://jadwal-voli.test/api/v1/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: 'aplication/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(inputTeam),
      });
      if (response.ok) {
        console.log("Data berhasil ditambahkan");

        window.location.href = '/team';
      } else {
        
        console.error("Gagal menambahkan data");
      }
    } catch (error) {
      console.error("Terjadi kesalahan", error);
    }
  };

  const handleBack = () => {
    window.location.href = "/team";
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <Sidebars />
      </div>
      <br />
      <div className="content mt-5">
        <div className="header">
          <h1 style={{textAlign: 'center', fontFamily: 'Times New Roman'}} className="text-Primary"> Form Tambah Data </h1>
        </div>
        <div className="container shadow mt-5 bg-light">
          <br />
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label" >Nama Team:</label>
                <div className="col-sm-10">
                  <input
                    className="form-control"
                    type="text"
                    name="nama_team"
                    value={inputTeam.nama_team}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label" >Asal Team:</label>
                <div className="col-sm-10">
                  <input
                    className="form-control"
                    type="text"
                    name="asal_team"
                    value={inputTeam.asal_team}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <br />
              <button type="submit" className="btn btn-primary btn-sm"> <FontAwesomeIcon icon={faFloppyDisk}/> SIMPAN</button>
              <button className="btn btn-danger btn-sm" onClick={handleBack} ><FontAwesomeIcon icon={faBackwardStep} /> BATAL</button>
            </form>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputTeam;

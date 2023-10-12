import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Sidebars from "./Sidebar";
import "./style.css"

interface Team {
    id: number;
    nama_team: string;
    asal_team: string;
}

export const Team = () => {
    const [tableTeam, setTableTeam] = useState<Team[]>([]);
    const token = localStorage.getItem('token');
    //jika pages tidak memiliki token maka akan di arahakan kembali ke halaman login
    if (!token) {
    return <Navigate to="/login" />
    }

    const fetchTeam = async () => {
        try {
            const response = await fetch('http://jadwal-voli.test/api/v1/team', {
                headers: {
                    Accept: 'aplication/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.json();
            console.log('data', data)
            return data;
        } catch (error) {
            console.error('terjadi kesalahan', Error);
        }
    };

    useEffect(() => {
        fetchTeam().then((apiData) => {
          setTableTeam(apiData.data);
        });
    }, [setTableTeam]);

    //hapus data
    const handledeleteTeam = (id, team) => {
        fetch(`http://jadwal-voli.test/api/v1/team/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(team)
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Gagal menghapus data. Kode status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          const updatedTable = tableTeam.filter((team) => team.id !== id);        
          setTableTeam(updatedTable);
        })
        .catch((error) => {
          console.error('Terjadi kesalahan saat menghapus data:', error);
        });
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                < Sidebars />
            </div>
            <div className="content mt-4">
                <div className="header">
                    <h3 style={{fontFamily: 'fantasy'}} className="row justify-content-center mt-5">PROLIGA 2023</h3>
                    <p style={{fontFamily: 'times-new-roman'}} className="text-center ">Daftar Team Yang Bertanding</p>
                </div>
                <div className="card shadow mb-4 md-5">
                    <div className="card-body mt-2">
                        <Link to="/team/input">
                            <button  className="btn btn-success btn-sm"> <FontAwesomeIcon icon={faSquarePlus}/> Tambah Team</button>
                        </Link>
                        <hr />
                    </div>
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead>
                                <tr className="text-center">
                                    <th>NO</th>
                                    <th>Nama Team</th>
                                    <th>Asal Team</th>
                                    <th>Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                tableTeam && tableTeam.length > 0 ? (
                                    tableTeam.map((team, index) => {
                                        return (
                                            <tr key={team.id}>
                                                <td style={{textAlign: 'center'}} > {index +1} </td>
                                                <td style={{textAlign: 'left'}} > {team.nama_team} </td>
                                                <td style={{textAlign: 'left'}} > {team.asal_team} </td>
                                                <td style={{textAlign: 'center'}} >
                                                <Link to={`/team/${team.id}`}>
                                                    <button title="detail" className="btn btn-primary btn-sm"> <FontAwesomeIcon icon={faEye} style={{color: 'black'}}/> </button>
                                                    </Link>
                                                    <Link to={`/team/edit/${team.id}`}>
                                                    <button title="edit" className="btn btn-warning btn-sm"><FontAwesomeIcon icon={faPenToSquare} /></button>
                                                    </Link>
                                                    <button title="hapus" className="btn btn-danger btn-sm" onClick={() => handledeleteTeam(team.id, team)}> <FontAwesomeIcon icon={faTrash}  /> </button>
                                                </td>
                                            </tr>
                                        )}
                                )): (
                                        <tr>
                                            <td colSpan={5}> tidak ada data</td>
                                        </tr>
                                    )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
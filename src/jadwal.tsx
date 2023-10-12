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

interface Jadwal {
    id: number;
    waktu_tanding: string;
    match: string;
    team_A: number;
    tim_a: Tim_A;
    team_b: number;
    tim_b: Tim_B;
}

interface Tim_A {
    id: number;
    nama_team: string;
    asal_team: string;
}

interface Tim_B {
    id: number;
    nama_team: string;
    asal_team: string;
}

export const Jadwal = () => {
    const [tableJadwal, setTableJadwal] = useState<Jadwal[]>([]);
    const token = localStorage.getItem('token');
    // Jika pages tidak memiliki token maka akan diarahkan kembali ke halaman login
    if (!token) {
        return <Navigate to="/login" />
    }

    const fetchJadwal = async () => {
        try {
            const response = await fetch('http://jadwal-voli.test/api/v1/jadwal', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setTableJadwal(data)
                console.log('data', data)
                return data;
            }
        } catch (error) {
            console.error('terjadi kesalahan', error);
        }
    };

    useEffect(() => {
        // Panggil fetchJadwal() di dalam useEffect, bukan di dalamnya
        fetchJadwal().then((apiData) => {
            setTableJadwal(apiData.data);
        });
    }, [setTableJadwal]); 

    //hapus
    const deleteData = (id, jadwal) => {
        fetch(`http://jadwal-voli.test/api/v1/jadwal/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(jadwal)
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Gagal menghapus data. Kode status: ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          const updatedTable = tableJadwal.filter((team) => team.id !== id);
        
          setTableJadwal(updatedTable);
    
        })
        .catch((error) => {
          console.error('Terjadi kesalahan saat menghapus data:', error);
        });
      };
    return (
        <div className="app-container">
            <div className="sidebar">
                <Sidebars />
            </div>
            <br />
            <div className="content mt-4">
                <div className="header">
                    <h3 style={{ fontFamily: 'fantasy' }} className="row justify-content-center mt-5">PROLIGA 2023</h3>
                    <p style={{ fontFamily: 'times-new-roman' }} className="text-center">Daftar Jadwal Bertandingan</p>
                </div>
                <div className="card shadow mb-4 md-5">
                    <div className="card-body mt-2">
                        <Link to="/jadwal/input">
                            <button className="btn btn-success btn-sm"> <FontAwesomeIcon icon={faSquarePlus} /> Tambah Jadwal</button>
                        </Link>
                        <hr />
                    </div>
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead>
                                <tr className="text-center">
                                    <th>NO</th>
                                    <th>Waktu Tanding</th>
                                    <th>Match </th>
                                    <th>Nama Team</th>
                                    <th>VS</th>
                                    <th>Asal Team</th>
                                    <th>Tags</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableJadwal && tableJadwal.length > 0 ? (
                                    tableJadwal.map((jadwal, index) => {
                                        return (
                                            <tr key={jadwal.id}>
                                                <td style={{ textAlign: 'center' }} > {index + 1} </td>
                                                <td style={{ textAlign: 'center' }} > {(new Date(jadwal.waktu_tanding)).toLocaleString('id-ID', {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: 'numeric',
                                                    minute: "numeric",
                                                    hour12: false,
                                                })} </td>
                                                <td style={{ textAlign: 'center' }} > {jadwal.match} </td>
                                                <td style={{ textAlign: 'center' }} > {jadwal.tim_a.nama_team} </td>
                                                <td style={{ textAlign: 'center' }} > VS </td>
                                                <td style={{ textAlign: 'center' }} > {jadwal.tim_b.nama_team} </td>
                                                <td style={{ textAlign: 'center' }} >
                                                <Link to={`/jadwal/${jadwal.id}`}>
                                                        <button title="detail" className="btn btn-primary btn-sm"> <FontAwesomeIcon icon={faEye} /> </button>
                                                    </Link>
                                                    <Link to={`/jadwal/edit/${jadwal.id}`}>
                                                        <button title="edit" className="btn btn-warning btn-sm"> <FontAwesomeIcon icon={faPenToSquare} /> </button>
                                                    </Link>
                                                    <button title="hapus" className="btn btn-danger btn-sm" onClick={() => deleteData(jadwal.id, jadwal)}> <FontAwesomeIcon icon={faTrash} /> </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5}> tidak ada data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}



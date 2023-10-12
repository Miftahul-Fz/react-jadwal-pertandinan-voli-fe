import { useState, useEffect } from "react";
import { Navigate, useParams } from 'react-router-dom';
import Header from "./header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import Sidebars from "./Sidebar";

interface Team {
  id: number;
  nama_team: string;
  asal_team: string;
} 

function EditTeam() {
    const { id } = useParams();
    const [formData, setFormData] = useState<Team>({
            id: 0,
            nama_team: '',
            asal_team: '',
        });
    const token = localStorage.getItem('token')
        if (!token) {
                return <Navigate to="/login" />
            }

    const fetchTeam = async () => {
        console.log('formData', formData)
        try {
            const response = await fetch(`http://jadwal-voli.test/api/v1/team/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            const team = await response.json();
            console.log('data: ', team)
            return team;
        } catch (error) {
            console.error('terjadi kesalahan', Error);
        }
    }

    useEffect(() => {
        fetchTeam().then((apiData) => {
            setFormData(apiData.data);
        });
    }, [setFormData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log('value', name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://jadwal-voli.test/api/v1/team/${id}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`        
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                console.log("Data berhasil diperbarui");         
                window.location.href = "/team";
            } else {
                console.error("Gagal memperbarui data");
            }

        } catch (error) {
            console.error("Terjadi kesalahan", error);
        }
    };

    const handleBack = () => {
        window.location.href = '/team';
    }

    return (
        <div className="app-container">
            <div className="sidebar">
                <Sidebars />
            </div>
            <br />
            <div className="content mt-5">
                <div className="header">
                    <h1 style={{textAlign: 'center', fontFamily: 'Times New Roman'}} className="text-Primary"> Form Edit Data </h1>
                </div>
                <div className="container shadow mt-5 bg-light">
                    <br />
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" >Nama Team :</label>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="nama_team"
                                        defaultValue={formData.nama_team}
                                        onChange={handleChange}
                                        placeholder=""
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
                                        defaultValue={formData.asal_team}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                            <br />
                            <button type="submit" className="btn btn-primary btn-sm"><FontAwesomeIcon icon={faFloppyDisk} /> SIMPAN</button>
                            <button className="btn btn-danger btn-sm" onClick={handleBack} > <FontAwesomeIcon icon={faBackwardStep} /> BATAL</button>
                        </form>
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditTeam;

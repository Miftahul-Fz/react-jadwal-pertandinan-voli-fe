import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import Sidebars from "./Sidebar";

interface Jadwal {
    id: number;
    waktu_tanding: string;
    match: string;
    team_A: number;
    team_b: number;
}

interface Team {
    id: number;
    nama_team: string;
    asal_team: string;
}

export const InputJadwal = () => {
    const [inputJadwal, setInputJawdal] = useState<Jadwal>(
    {
        id: undefined,
        waktu_tanding: "",
        match: "",
        team_A: 0,
        team_b: 0,
    })
    const [teamList, setTeamList] = useState<Team[]>([])
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to="/login" />
    }

    const fetchTeam = async () => {
        try {
                const teamsResponse = await fetch('http://jadwal-voli.test/api/v1/team', {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                const teamlist = await teamsResponse.json();
                console.log('team: ', teamlist.data)
                setTeamList(teamlist.data);
                return teamlist;
        } catch (error) {
            console.error('terjadi kesalahan', Error)
        }
    }
    
    useEffect(() => {
        fetchTeam().then((apiData) => {
            setTeamList(apiData.data);
        })
    }, [setTeamList])
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Name: ${name}, Value: ${value}`);
        setInputJawdal({ ...inputJadwal, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://jadwal-voli.test/api/v1/jadwal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: 'aplication/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(
                    {
                        waktu_tanding: inputJadwal.waktu_tanding,
                        match : inputJadwal.match,
                        team_A: inputJadwal.team_A,
                        team_b: inputJadwal.team_b,
                    }),
                });
                console.log(inputJadwal.waktu_tanding)
            if (response.ok) {
                
                console.log("Data berhasil ditambahkan");
                // window.location.href = '/jadwal';
            }else {
                console.error("Gagal menambahkan data");
            }
        } catch (error) {
            console.error("Terjadi kesalahan", error);
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        window.location.href = "/jadwal";
    }

    return (
        <div className="app-container">
            <div className="sideber">
                <Sidebars />
            </div>
            <div className="content mt-5">
                <div className="header">
                    <h1 style={{textAlign: 'center', fontFamily: 'Times New Roman'}} className="text-Primary"> Form Tambah Jadwal Tanding </h1>
                </div>
                <div className="container shadow mt-5 bg-light">
                    <br />
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" >Waktu Pertandingan:</label>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        type="datetime-local"
                                        name="waktu_tanding"
                                        value={inputJadwal.waktu_tanding}
                                        onChange={handleChange}
                                    />
                                </div>
                                </div>
                                <br />
                                <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" >Match:</label>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="match"
                                        value={inputJadwal.match}
                                        onChange={handleChange}/>
                                </div>
                                </div>
                                <br />
                                <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" >Team A:</label>
                                <div className="col-sm-10">
                                    <select
                                    className="form-control"
                                    name="team_A"
                                    value={inputJadwal.team_A}
                                    onChange={handleChange}>
                                        <option value="">Pilih Team</option>
                                            {teamList.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.nama_team}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                </div>
                                <br />
                                <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" >Team B:</label>
                                <div className="col-sm-10">
                                    <select
                                    className="form-control"
                                    name="team_b"
                                    value={inputJadwal.team_b}
                                    onChange={handleChange}>
                                        <option value="">Pilih Team</option>
                                            {teamList.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.nama_team}
                                            </option>
                                        ))}    
                                    </select>
                                </div>
                            </div>
                        </form>
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary btn-sm"><FontAwesomeIcon icon={faFloppyDisk } /> SIMPAN</button>
                        <button className="btn btn-danger btn-sm" onClick={handleBack} > <FontAwesomeIcon icon={faBackwardStep} /> BATAL</button>
                    </div>
                    <br />
                </div>
            </div>
        </div>   
    )
}

const formatDateToISO8601 = (date: string) => {
    const theDate = new Date(date);
    const year = theDate.toLocaleDateString("default", { year: "numeric" });
    const month = theDate.toLocaleDateString("default", { month: "2-digit" });
    const day = theDate.toLocaleDateString("default", { day: "2-digit" });
    const hour = theDate.toLocaleString('id-ID', { hour: '2-digit' });
    const minute = theDate.toLocaleString('id-ID', { hour: '2-digit' });
    
    console.log(`${year}-${month}-${day}T${hour}:${minute}`);

    return `${year}-${month}-${day}T${hour}:${minute}`;
}

export default InputJadwal;


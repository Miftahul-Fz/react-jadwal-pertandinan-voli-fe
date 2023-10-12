import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Header from './header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import Sidebars from './Sidebar';

interface Team {
    id: number;
    nama_team: string;
    asal_team: string;
}

export const EditJadwal = () => {
    const { id } = useParams();
    const [editJadwal, setEditJadwal] = useState({
        id: undefined,
        waktu_tanding: "",
        match: "",
        team_A: 0,
        team_b: 0,
    })
    const [teamList, setTeamList] = useState<Team[]>([])
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = '/login'
    }

    const fetchJadwal = async () => {
        try {
            const response = await fetch(`http://jadwal-voli.test/api/v1/jadwal/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                },
            })
            const jadwal = await response.json();
            // console.log('data fetchJadwal', jadwal)
            // console.log('data.waktu_tanding fetchJadwal: ', jadwal.data.waktu_tanding)
            return jadwal 
        } catch (error) {
            console.error('terjadi kesalahan', Error)
        }
    }

    useEffect(() => {
        fetchJadwal().then((apiData) => {
            setEditJadwal({
                ...apiData.data,
                waktu_tanding: formatDateToISO8601(apiData.data.waktu_tanding)
            });
        })
    }, [setEditJadwal])

    const fetchTeam = async () => {
        try {
            const teamsResponse = await fetch('http://jadwal-voli.test/api/v1/team', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await teamsResponse.json();
            console.log('team: ', data.data)
            setTeamList(data.data);

            return data;
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
        setEditJadwal({ ...editJadwal, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://jadwal-voli.test/api/v1/jadwal/${id}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`        
                },
                body: JSON.stringify(editJadwal),
            }); 
            if (response.ok) {
                console.log("Data berhasil diperbarui");
                
                window.location.href = "/jadwal";
            } else {
                console.error('gagal memperbaharui data')
            }
        }catch (error) {
            console.error('terjadi kesalahan', Error)
        }
    }

    const handleBack = () => {
        window.location.href = '/jadwal';
    }
    
    return (
        <div className='app-container'>
            <div className='sidebar'>
                <Sidebars />
            </div>
            
            <div className='content mt-5'>
                <div className="header">
                    <h1 style={{textAlign: 'center', fontFamily: 'Times New Roman'}} className="text-Primary"> Form Edit Data </h1>
                </div>
                <div className="container shadow mt-4 bg-light">
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
                                        defaultValue={editJadwal.waktu_tanding}
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
                                        defaultValue={editJadwal.match}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" >Team A:</label>
                                <div className="col-sm-10">
                                    <select
                                    className="form-control"
                                    name="team_A"
                                    value={editJadwal.team_A}
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
                                    value={editJadwal.team_b}
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
                        <button type="submit" className="btn btn-primary btn-sm" onClick={handleSubmit}><FontAwesomeIcon icon={faFloppyDisk} /> UPDATE</button>
                        <button className="btn btn-danger btn-sm " onClick={handleBack} ><FontAwesomeIcon icon={faBackwardStep} /> BATAL</button>
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
    const minute = theDate.toLocaleString('default', { minute: 'numeric' })
                        .toString()
                        .padStart(2, '0');
    
    console.log(`${year}-${month}-${day}T${hour}:${minute}`);

    return `${year}-${month}-${day}T${hour}:${minute}`;
}


import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Header from './header';
import './img.css'

interface Jadwal {
    id: number;
    waktu_tanding: string;
    match: string;
    team_A: number;
    tim_a: TimA;
    team_b: number;
    tim_b: TimB;
}

interface TimA {
    id: number;
    nama_team: string;
    asal_team: string;
}

interface TimB {
    id: number;
    nama_team: string;
    asal_team: string;
}

export const DetailJadwal = () => {
    const { id } = useParams();
    const [getJadwal, setGetJadwal] = useState<Jadwal>()

    const token = localStorage.getItem('token');
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
            console.log('data: ', jadwal);

            return jadwal;
        }catch (error) {
            console.error('terjadi kesalahan', Error)
        }
    }

    useEffect(() => {
        fetchJadwal().then((apiData) => {
            setGetJadwal(apiData.data);
        })
    }, [setGetJadwal])

    return (
        <div >
            <div>
                <Header />
            </div>
            <br />
            <div className="mt-5">
                <h3 style={{fontFamily: 'fantasy'}} className="row justify-content-center text-danger mt-5">JADWAL PERTANDINGAN PROLIGA BOLA VOLI 2023🏐</h3>

            </div>
            <div className='row justify-content-center mt-5'>
                <div className='col-md-10' >
                    <div style={{backgroundColor: 'ButtonShadow'}} className='card p-4'>
                        <h3 style={{fontFamily: 'Algerian'}} className="text-danger text-center mt-5">
                            {getJadwal ? getJadwal.match : 'Memuat...'}
                        </h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{ width: '40%', textAlign: 'center' }}>
                                        <h3 style={{fontFamily: 'Clarendon Blk BT'}} className="text-drak text-left mt-5">
                                            {getJadwal ? getJadwal.tim_a.nama_team : 'Memuat...'}
                                        </h3>
                                    </td>
                                    <td style={{ width: '10%', textAlign: 'center' }}>
                                        <h3 style={{fontFamily: 'Algerian'}} className="text-warning text-left mt-5">
                                            VS
                                        </h3>
                                    </td>
                                    <td style={{ width: '40%', textAlign: 'center' }}>
                                        <h3 style={{fontFamily: 'Clarendon Blk BT'}} className="text-drak text-left mt-5">
                                            {getJadwal ? getJadwal.tim_b.nama_team : 'Memuat...'}
                                        </h3>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h6 style={{fontFamily: 'times new roman'}} className="text-dark text-center mt-5">
                            {( new Date(getJadwal ? getJadwal.waktu_tanding : 'Memuat...').toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: "numeric",
                                minute: "numeric"
                            }))}
                        </h6>   
                    </div>
                </div>
            </div>
        </div>
    )

}
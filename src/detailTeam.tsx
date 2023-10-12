import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Header from "./header";
import Sidebars from "./Sidebar";

interface AtlitResponse {
  id: number;
  nama: string;
  umur: number;
  no_punggung: number;
  tinggi: number;
  berat: number;
  posisi_id: number;
  posisi: Posisi;
  team_id: number;
  team: Team;
}
interface Posisi {
  id: number;
  nama: string;
}

interface Team {
  id: number;
  nama_team: string;
  asal_team: string;
}

function DetailTeam() {
  const { id } = useParams();
  const [atlitData, setAtlitData] = useState<AtlitResponse[]>([]);
  const [getTeam, setTeam] = useState<Team>();
  const token = localStorage.getItem('token')

  useEffect(() => {
    console.log('atlit', atlitData)
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://jadwal-voli.test/api/v1/atlit?team=${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
        }); 
        if (response.ok) {
          const dataAtlit = await response.json();
          console.log('data atlit', dataAtlit);
          setAtlitData(dataAtlit.data);
        }
      } catch (error) {
        console.error('Terjadi kesalahan', error);
      }
    };

    fetchTeam();
  }, [id]);

  //mengambil data Team bedasrkan Id
  const fetchTeam = async () => {
    // console.log('formData', formData)
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
      setTeam(apiData.data);
    });
}, [setTeam])

  // Filter atlet sesuai dengan tim_id
  const filteredAtlitData = atlitData.filter((detail) => detail.team_id === parseInt(id, 10));

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
          <h3 style={{ fontFamily: 'fantasy' }} className="row justify-content-center mt-5">Detail Team</h3>
        </div>
        <div className="container shadow mt-5">
          <div className="card-body ">
            <br />
            <h3 style={{fontFamily: 'times new Roman'}} className="text-primary text-center">
              {getTeam ? getTeam.nama_team : 'Memuat...'}
            </h3>
            <h6 className="text-center">{getTeam ? getTeam.asal_team : 'Memuat...'}</h6>
            <p className="">Daftar Atlet</p>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Team</th>
                  <th>No Punggung</th>
                  <th>Posisi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAtlitData && filteredAtlitData.length > 0 ? (
                  filteredAtlitData.map((detail, index) => {
                    return (
                      <tr key={detail.id}>
                        <td> {index + 1} </td>
                        <td> {detail.nama} </td>
                        <td> {detail.no_punggung} </td>
                        <td> {detail.posisi.nama} </td>                                        
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
            <button className="btn btn-danger btn-sm" onClick={handleBack}>KEMBALI</button>
          </div>
          <br />
        </div>
      </div>
    </div>
  )
}

export default DetailTeam;

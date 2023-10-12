import { useEffect, useState } from 'react';
import './style.css';
import { Navigate } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './header';
import Sidebars from './Sidebar';

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

interface AtlitRequest {
  id: number;
  nama: string;
  umur: number;
  no_punggung: number;
  tinggi: number;
  berat: number; 
  posisi_id: number;
  team_id: number;
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

export const Atlit = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tableAtlit, setTableAtlit] = useState<AtlitResponse[]>([]);
  const [formInputAtlit, setformInputAtlit] = useState<AtlitRequest>({
    id: undefined,
    nama: '',
    umur: 0,
    no_punggung: 0,
    tinggi:0,
    berat:0,
    posisi_id: 0,
    team_id: 0, 
  });
  const [edit, setEdit] = useState<boolean>(false);
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [posisiList, setPosisiList] = useState<Posisi[]>([]);

  //mengambil token dari local storage
  const token = localStorage.getItem('token')

  //jika pages tidak memiliki token maka akan di arahakan kembali ke halaman login
  if (!token) {
    return <Navigate to="/login" />
  }
  
  //mengambil data dari APi
  const fecthAtlit = async () => {
    setLoading(true)
    try {
      //response api Atlit
      const response = await fetch('http://jadwal-voli.test/api/v1/atlit', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      console.log('data', data)
      setLoading(false)

      //response api team
      const teamsResponse = await fetch('http://jadwal-voli.test/api/v1/team', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const teamData = await teamsResponse.json();
      setTeamList(teamData.data);

      //response api posisi
      const posisiResponse = await fetch('http://jadwal-voli.test/api/v1/posisi', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const posisiData = await posisiResponse.json();
      setPosisiList(posisiData.data);
      
      return data;
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    } 
  };

  useEffect(() => {
    fecthAtlit().then((apiData) => {
      setTableAtlit(apiData.data);
    });
  }, [setTableAtlit])

  //input data dari label
  const handleChange = (evnt) => {
    const newInput = {
      ...formInputAtlit,
      [evnt.target.name]: evnt.target.value,
    };                                     
    setformInputAtlit(newInput); 
  };

  //fungsi input data ke api
  const inputData = async (atlit) => {
    try {
      const response = await fetch('http://jadwal-voli.test/api/v1/atlit',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ${token}'
        },
        body: JSON.stringify({
          nama: atlit.nama,
          umur: atlit.umur,
          no_punggung: atlit.no_punggung,
          tinggi: atlit.tinggi,
          berat: atlit.berat,
          posisi_id: atlit.posisi_id,
          team_id: atlit.team_id,
        }),
      });

      if(!response.ok) {
        throw new Error('gagal menambah data');
      }
      const responseData = await response.json();
      return responseData;
    } catch(error) {
      console.error('terjadi kesalahan', error);
      throw error;
    }
  };

  //fungsi edit data ke api
  const editAtlit = async (id, atlit) => {
    try {
      const response = await fetch(`http://jadwal-voli.test/api/v1/atlit/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nama: atlit.nama,
          umur: atlit.umur,
          no_punggung: atlit.no_punggung,
          tinggi: atlit.tinggi,
          berat: atlit.berat,
          posisi: atlit.posisi_id,
          team_id: atlit.team_id 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Gagal mengedit data.');
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      throw error;
    }
  };
  
  //untuk megatur button tambah dan update
  const handleSubmit = async (evnt) => {
    evnt.preventDefault();
    try {

      if (formInputAtlit.id === undefined || formInputAtlit === undefined) {
        // Menambahkan data baru
        const newData: AtlitRequest = {
          ...formInputAtlit,
        };
        const addedData = await inputData(newData);

        // Mengupdate tabel dengan data baru
        const updatedTable = [...tableAtlit, addedData.data];
        setTableAtlit(updatedTable);  
      } 
      
      else {
        // Mengedit data yang sudah ada
        const updatedData = await editAtlit(formInputAtlit.id, formInputAtlit);

        // Mengupdate tabel dengan data yang sudah diubah
        const updatedTable= tableAtlit.map((atlit) =>
        atlit.id === formInputAtlit.id ? updatedData.data : atlit
        );
        setTableAtlit(updatedTable);
      }

      // Mereset input form setelah operasi selesai
      const emptyInput: AtlitRequest = {
        id: undefined,
        nama: '',
        umur: 0,
        no_punggung: 0  ,
        tinggi: 0 ,
        berat: 0  ,
        posisi_id: 0  ,
        team_id: 0  ,
      };
      setformInputAtlit(emptyInput);
      setEdit(false);
    } catch (error) {
      console.error('Terjadi kesalahan:', error.message);
    }
  };
  
  //mengembalikan data ke label untuk edit
  const editData = (id: number) => {
    const editAtlit = tableAtlit
      .filter((atlit) => atlit.id === id)
      .map((filterAtlit) => {
        return filterAtlit;
      });

    setformInputAtlit({
      id: editAtlit[0].id,
      nama: editAtlit[0].nama,
      umur: editAtlit[0].umur,
      no_punggung: editAtlit[0].no_punggung,
      tinggi: editAtlit[0].tinggi,
      berat: editAtlit[0].berat,
      posisi_id: editAtlit[0].posisi_id,
      team_id: editAtlit[0].team_id,
    });
    setEdit(true);
  };

  //Delete data yang sudah ada
  const deleteData = (id, atlit) => {
    fetch(`http://jadwal-voli.test/api/v1/atlit/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(atlit)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Gagal menghapus data. Kode status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      //menghapus data di table local
      const updatedTable = tableAtlit.filter((atlit) => atlit.id !== id);
    
      setTableAtlit(updatedTable);

    })
    .catch((error) => {
      console.error('Terjadi kesalahan saat menghapus data:', error);
    });
  };

  //logout
  const handleLogout = () => {
    //menghapus token dari local storage
    localStorage.removeItem('token')
    //menuju halaman login
    window.location.href = '/login'; 
  }

  if (isLoading) return <p>loading</p>

  return (
    <div className='app-container'>
      <div className='sidebar'>
      <Sidebars/> 
      </div>
      <div className='content'>
      <h1 className='row justify-content-center mt-5'>PROLIGA 2023</h1>
      <p className='row justify-content-center'>Daftar atlit proliga bola voli 2023</p>
      <h5>Input atlit</h5>
      <table>
        <tbody>
          <tr>
            <td>Nama</td>
            <td>:</td>
            <td>
              <input
                type="text"
                onChange={handleChange}
                value={formInputAtlit.nama}
                name="nama"
                className="form-control"
                placeholder="Masukan nama"
              />
            </td>
          </tr>
          <tr>
            <td>Umur</td>
            <td>:</td>
            <td>
              <input
                type="number"
                onChange={handleChange}
                value={formInputAtlit.umur}
                name="umur"
                className="form-control"
                placeholder="Masukan umur"
              />
            </td>
          </tr>
          <tr>
            <td>No Punggung</td>
            <td>:</td>
            <td>
              <input
                type="number"
                onChange={handleChange}
                value={formInputAtlit.no_punggung}
                name="no_punggung"
                className="form-control"
                placeholder="Masukan no punggung"
              />
            </td>
          </tr>
          <tr>
            <td>tinggi</td>
            <td>:</td>
            <td>
              <input
                type="number"
                onChange={handleChange}
                value={formInputAtlit.tinggi}
                name="tinggi"
                className="form-control"
                placeholder="Masukan no punggung"
              />
            </td>
          </tr>
          <tr>
            <td>berat</td>
            <td>:</td>
            <td>
              <input
                type="number"
                onChange={handleChange}
                value={formInputAtlit.berat}
                name="berat"
                className="form-control"
                placeholder="Masukan no punggung"
              />
            </td>
          </tr>
          <tr>
            <td>Posisi</td>
            <td>:</td>
            <td>
              <select
                onChange={handleChange}
                value={formInputAtlit.posisi_id}
                name="posisi_id"
                className="form-control"
                placeholder="Masukan posisi">
              <option value="">Pilih Posisi</option>
                {posisiList.map((posisi) => (
                <option key={posisi.id} value={posisi.id}>
                  {posisi.nama}
                </option>
                ))}   
                </select>
            </td>
          </tr>
          <tr>
            <td>Team</td>
            <td>:</td>
            <td>
              <select
                onChange={handleChange}
                value={formInputAtlit.team_id}
                name="team_id"
                className="form-control"> 
              <option value="">Pilih Team</option>
                {teamList.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.nama_team}
                </option>
              ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input
                className='btn btn-success btn-sm'
                type="submit"
                onClick={handleSubmit}
                value={edit ? 'Update' : 'Tambah'}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <hr />
      <br />
      <p><b>Daftar nama atlit yang bertanding</b></p>
      <table className="table table-striped" border={1} width="100%">
        <thead>
          <tr style={{textAlign: 'center'}}>
            <th>No</th>
            <th>ID</th>
            <th>Nama</th>
            <th>Umur</th>
            <th>No Punggung</th>
            <th>tinggi</th>
            <th>berat</th>
            <th>Posisi</th>
            <th>Team</th>
            <th>tags</th>
          </tr>
        </thead>
        <tbody>
        {
          // console.log('table atlite :',tableAtlit)
          tableAtlit && tableAtlit.length > 0 ? (
            tableAtlit.map((atlit, index) => {
              // console.log('id', atlit.id)
              return (
                <tr key={atlit.id}>
                  <td style={{ textAlign: 'center' }}> {index + 1}</td>
                  <td style={{ textAlign: 'center' }}> {atlit.id} </td>
                  <td style={{ textAlign: 'left' }}> {atlit.nama} </td>
                  <td style={{ textAlign: 'center' }}> {atlit.umur} </td>
                  <td style={{ textAlign: 'center' }}> {atlit.no_punggung} </td>
                  <td style={{ textAlign: 'center' }}> {atlit.tinggi} </td>
                  <td style={{ textAlign: 'center' }}> {atlit.berat} </td>
                  <td style={{ textAlign: 'left' }}> {atlit.posisi.nama} </td>
                  <td style={{ textAlign: 'left' }}> {atlit.team.nama_team} </td>
                  <td style={{ textAlign: 'center' }}>  
                    <button onClick={() => editData(atlit.id)}> Edit</button>
                    <button onClick={() => deleteData(atlit.id, atlit)}>hapus</button>
                  </td>
                </tr>
              )}
            )): (
              <tr>
                <td colSpan={8}>Tidak ada data yang tersedia</td>
              </tr>
              )
        }
        </tbody>
      </table>
      </div>
    </div>
  );  
};

export default Atlit;
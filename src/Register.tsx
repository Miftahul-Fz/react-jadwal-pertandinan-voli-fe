import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { faSquareArrowUpRight } from '@fortawesome/free-solid-svg-icons'

export const Register = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
      name: '',
      email: '',
      password: '',
  });
  
  const handleChange = (envt) => {
      const{ name, value } = envt.target;
      setRegister({...register, [name]: value});
  }

  const handleSubmit = async (envt) => {
    envt.preventDefault();
      // Kirim data ke API 
    try {
      const response = await fetch('http://jadwal-voli.test/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(register),
      });

      if (response.ok) {
        console.log('Registrasi Berhasil')
        window.location.href = "/login";
      } else {
        console.error('Gagal mendaftar');
      }
    } catch (error) {
      console.error('Gagal mendaftar');
    }
  }

  //kembali ke halaman sebelumnya
  const handleBack = () => {
    navigate('/login')
  }

  return (
    <div>
      <h1 className='row justify-content-center'>Halaman Register</h1>
      <div style={{marginTop: "50px"}}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div className='card p-4'>
                <div className='card-body'>
                  <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="name">Nama:</label>
                        <input 
                          className='form-control'
                          type="text"
                          id="name"
                          name="name"
                          value={register.name}
                          onChange={handleChange}
                          required
                        />
                    </div>
                    <br />
                    <div className='form-group'>
                        <label htmlFor="email">Email:</label>
                        <input 
                          className='form-control'
                          type="text"
                          id="email"
                          name="email"
                          value={register.email}
                          onChange={handleChange}
                          required
                        />
                    </div>
                    <br />
                    <div className='form-group'>
                        <label htmlFor="password">Password:</label>
                        <input
                          className='form-control'
                          type="text"
                          id="password"
                          name="password"
                          value={register.password}
                          onChange={handleChange}
                          required
                        />
                    </div>
                    <br />
                    <div className='form-group'>
                      <button className="btn btn-success btn-sm" type="submit"> <FontAwesomeIcon icon={faSquareArrowUpRight} /> Register</button>
                      <button className="btn btn-danger btn-sm" type="submit" onClick={handleBack}> <FontAwesomeIcon icon={faBackward} /> Batal</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>   
          </div>
        </div>
      </div>
    </div>
  )
}
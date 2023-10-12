import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const handleUsernameChange = (evnt) => {
    setEmail(evnt.target.value);
  };

  const handlePasswordChange = (evnt) => {
    setPassword(evnt.target.value);
  };

  const handleLogin = async () => {
    try {
      // Lakukan permintaan POST ke API untuk autentikasi
      const response = await fetch('http://jadwal-voli.test/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const login = await response.json();
        console.log('Login berhasil:', login);
        //menyimpan data ke localstorage 
        const token = login.token;
        localStorage.setItem('token', token);
        
        //setelah berhasil login akan di arahkan ke halaman yang di tuju
        navigate('/jadwal')
      } else {
        // Login gagal, tampilkan pesan kesalahan
        console.error('Login gagal');
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <h1 className='row justify-content-center'>Halaman Login</h1>
      <div style={{marginTop: "50px"}}>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='card p-4'>
              <div className='card-body'>
                <div className='form-group'>
                  <label>Email:</label>
                  <input
                    className='form-control' 
                    type="text" 
                    value={email} 
                    onChange={handleUsernameChange} 
                  />
                </div>
                <br />
                <div className='form-group'>
                  <label>Password:</label>
                  <input 
                    className='form-control'
                    type="password" 
                    value={password} 
                    onChange={handlePasswordChange} 
                  />
                </div>
                <br />
                <div className='d-grid gap-2'>
                  <button className='btn btn-success' onClick={handleLogin}><FontAwesomeIcon icon={faRightToBracket} /> Login</button>
                  <br />
                  <p>jika belum daftar silahkan klik <Link to="/register">disini</Link> untuk daftar</p>
                </div>
              </div>
            </div>
          </div>   
        </div>
      </div>
    </div>
  );
}

export default Login;

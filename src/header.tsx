import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

function Header()  {
  const token = localStorage.getItem('token')

  const handleLogout = async () => {
    try {
      const logoutResponse = await fetch('http://jadwal-voli.test/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Accept: 'aplication/json',
          Authorization: `Bearer ${token}`
        }
      })
      const logout = await logoutResponse.json;
      localStorage.removeItem('token')
      window.location.href = "/login"
      return logout;
    }catch (error) {
      console.error('terjadi kesalahan', Error)
    }
  }
  
  return (
    <div>
      <nav style={{position: 'fixed', zIndex: 2}} className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow fixed-top">
        <div className="container">
          <a className="navbar-brand text-primary" href="#"><img src="/img/proliga.png" alt="logo" style={{height: '40px'}}/></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="ml-auto">
            <button className="btn btn-outline-danger" onClick={handleLogout}> <FontAwesomeIcon icon={faRightFromBracket} /> LOGOUT</button>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header;
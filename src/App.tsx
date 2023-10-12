import { useParams, BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Atlit from "./atlit";
import { Register } from "./Register";
import { Team } from "./Team";
import InputTeam from "./InputTeam";
import EditTeam from "./EditTeam";
import Header from "./header";
import Sidebar from "./Sidebar";
import { Jadwal } from "./jadwal";
import DetailTeam from "./detailTeam";
import InputJadwal from "./inputJadwal";
import { EditJadwal } from "./editJadwal";
import { DetailJadwal } from "./detailJadwal";



export default function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
        <Route path="/login" element={<Login />} />
        {/* jadwal */} 
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/jadwal/input" element={<InputJadwal />} />
        <Route path="jadwal/edit/:id" element={<EditJadwal /> } />
        <Route path="jadwal/:id" element={<DetailJadwal /> } />
         {/*team*/}
        <Route path="/team" element={<Team />} />
        <Route path="team/input" element={<InputTeam />} />
        <Route path="/team/edit/:id" element={<EditTeam /> } />
        <Route path="team/:id" element={<DetailTeam />}/>
        {/* Alit */}
        <Route path="/atlit" element={<Atlit/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/header" element={<Header />} />
        <Route path="/sidebar" element={<Sidebar />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  )
}

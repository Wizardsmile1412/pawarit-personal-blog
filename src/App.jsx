import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import "./assets/Global.css";
import LandingPage from './pages/LandingPage';
import ViewPostPage from './pages/ViewPostPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { ProfilePage, ResetPasswordPage } from './pages/MemberManagement';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/post/:postId' element={<ViewPostPage/>} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/member-profile' element={<ProfilePage/>} />
        <Route path='/member-profile/reset-password' element={<ResetPasswordPage/>} />
      </Routes>
    </Router>
  )
}

export default App

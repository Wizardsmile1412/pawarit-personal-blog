import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import "./assets/Global.css";
import LandingPage from './pages/LandingPage';
import ViewPostPage from './pages/ViewPostPage';
import {SignupPage, RegisterSuccess} from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { ProfilePage, ResetPasswordPage } from './pages/MemberManagement';
import { AdminLoginPage } from './pages/AdminPages/AdminLoginPage';
import { ArticleManagement, CreateArticle, CategoryManagement, CreateCategory } from './pages/AdminPages/ArticleManagement';
import { AdminProfileManagement } from './pages/AdminPages/AdminProfilePage';
import { NotificationPage } from './pages/AdminPages/NotificationPage';
import { AdminResetPasswordPage } from './pages/AdminPages/AdminResetPassword';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/post/:postId' element={<ViewPostPage/>} />
        <Route path='/register' element={<SignupPage/>} />
        <Route path='/register-success' element={<RegisterSuccess/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/member-profile' element={<ProfilePage/>} />
        <Route path='/member-profile/reset-password' element={<ResetPasswordPage/>} />
        <Route path='/admin-login' element={<AdminLoginPage/>} />
        <Route path='/article-management' element={<ArticleManagement/>} />
        <Route path='/create-article' element={<CreateArticle/>} />
        <Route path='/category-management' element={<CategoryManagement/>} />
        <Route path='/create-category' element={<CreateCategory/>} />
        <Route path='/admin-profile' element={<AdminProfileManagement/>} />
        <Route path='/notification-page' element={<NotificationPage/>} />
        <Route path='/admin-reset-password' element={<AdminResetPasswordPage/>} />
      </Routes>
    </Router>
  )
}

export default App

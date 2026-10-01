import Navbar from '../Components/navbar.jsx'

function UserLayout({ cartCount, currentUser, onLogout }) {
  return <Navbar cartCount={cartCount} currentUser={currentUser} onLogout={onLogout} />
}

export default UserLayout

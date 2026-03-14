import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './SettingsPage.css';
import { FaEject, FaUser } from 'react-icons/fa';
import LoadingCircle from '../../components/LoadingCircle';


function SettingsPage() {
  // Get users from Outlet context
  const { user, onProfileEdit, sending, onLogOut } = useOutletContext();

  // Active tab
  const [activeTab, setActiveTab] = useState("profile");

  // Profile fields
  const [formObj, setFormObj] = useState({
    name:"",
    email:"",
    id:""
  })
  const [profilePic, setProfilePic] = useState('')

  // Security fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Populate form when users data is available
  useEffect(() => {
    if (user) {
      setFormObj({
        fullname:user.fullname||"",
        email:user.email||"",
        id:user.id||""
      })
      setProfilePic(user.profile_image)
      setUsername(user.username || '');
      setPassword(user.password || '');
    }
  }, [user]);

  // Apply dark mode on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.body.classList.add("darkmode");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.body.classList.add("darkmode");
    else document.body.classList.remove("darkmode");
  }, [darkMode]);

  function handleChange(e){
    const {name, value} = e.target
    setFormObj(prev=>({...prev, [name]:value}))
    // console.log(formObj)
  }

  const handleThemeToggle = () => {
    setDarkMode(prev=>!prev);
    if (darkMode) document.body.classList.add("darkmode");
    else document.body.classList.remove("darkmode");
  };

  const saveSecurity = () => {
    alert("Security saved!");
  };


  return (
    <div className="settings-page">
      {/* Tabs */}
      <div className="settings-tabs">
        {["profile", "security", "notifications", "appearance"].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "profile" ? "Profile" :
              tab === "security" ? "Account Security" :
              tab === "notifications" ? "Notifications" :
              "Appearance"}
          </button>
        ))}
      </div>

      <div className="settings-card">
        {/* Profile */}
        {activeTab === "profile" && (
          <section>
            <div className="content">
              <h3>Profile Section</h3>
              {profilePic?<img className="avatar" src={profilePic} alt='profile image'/>:<FaUser/>}

              <form onSubmit={(e)=>onProfileEdit(e, formObj)} className='profile-form'>
                <label>Name</label>
                <input name='fullname' value={formObj.fullname} onChange={handleChange} placeholder="Enter your name" />

                <label>Email</label>
                <input name='email' value={formObj.email} onChange={handleChange} placeholder="Enter your email" />

                <button type='submit' className={!sending?'save-btn':"saving"}>{!sending?'Save Changes'
                    :
                    <LoadingCircle/>
                }</button>
              </form>
            </div>
            <button type='button' onClick={onLogOut} className='log-out'>Log Out<FaEject/></button>
          </section>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div className="content">
            <h3>Account Security</h3>

            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />

            <label>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter new password" />

            <button className="save-btn" onClick={saveSecurity}>Save Security</button>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="content">
            <h3>Notifications</h3>

            <div className="toggle-item">
              <span>Two-Factor Authentication</span>
              <input type="checkbox" />
            </div>

            <div className="toggle-item">
              <span>Email Alerts</span>
              <input type="checkbox" />
            </div>

            <div className="toggle-item">
              <span>SMS Alerts</span>
              <input type="checkbox" />
            </div>

            <button className="save-btn">Save Notifications</button>
          </div>
        )}

        {/* Appearance */}
        {activeTab === "appearance" && (
          <div className="content">
            <h3>Appearance</h3>

            <div className="toggle-item">
              <span>Light / Dark Mode</span>
              <input type="checkbox" checked={darkMode} onChange={handleThemeToggle} />
            </div>

            <button className="save-btn" onClick={handleThemeToggle}>Apply Theme</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;

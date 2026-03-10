import "./App.css";

function App() {
  return (
    <div className="container">
      <div className="login-card">
        <h1>Demeter</h1>
        <p>Bastion University Smart Cafeteria</p>

        <input type="text" placeholder="University ID" />
        <input type="password" placeholder="Password" />

        <button>Login as Student</button>

        <div className="staff-section">
          <span>Staff Access</span>
          <div className="staff-buttons">
            <button className="outline">Staff</button>
            <button className="outline">Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
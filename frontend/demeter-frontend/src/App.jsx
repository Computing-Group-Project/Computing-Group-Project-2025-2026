import { ThemeProvider } from './contexts/ThemeContext';
import AdminConsole from './admin/AdminConsole';

function App() {
  return (
    <ThemeProvider>
      <AdminConsole />
    </ThemeProvider>
  );
}

export default App;
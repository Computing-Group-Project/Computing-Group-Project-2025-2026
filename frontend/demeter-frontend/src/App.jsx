import { ThemeProvider } from './contexts/ThemeContext';
import Orders from './student/Orders';

function App() {
  return (
    <ThemeProvider>
      <Orders />
    </ThemeProvider>
  );
}

export default App;
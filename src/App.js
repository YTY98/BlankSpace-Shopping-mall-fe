import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import "./common/style/common.style.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import AiAssistant from './component/aiAssistant';

function App() {
  return (
    <div>
      <AppLayout>
        <AppRouter />
        <AiAssistant />
      </AppLayout>
    </div>
  );
}

export default App;

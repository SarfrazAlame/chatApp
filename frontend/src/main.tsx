import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import SocketContextProvider from "./context/SocketContext.tsx";
import { AuthContextProvider } from "./context/authContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<BrowserRouter>
		<AuthContextProvider>
			<SocketContextProvider>
				<App />
			</SocketContextProvider>
		</AuthContextProvider>
	</BrowserRouter>
	// </React.StrictMode>
);
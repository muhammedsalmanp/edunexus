import AppRouter from "./router"
import Notification from "./Components/Notification"
import Loading from "./Components/LoadingPage"

function App() {


  return (
    <>
      <Notification />
      <Loading/>
      <AppRouter />
    </>
  )
}

export default App

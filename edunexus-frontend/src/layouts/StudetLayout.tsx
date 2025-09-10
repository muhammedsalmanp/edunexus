import Navbar from "../Components/layout/Navebar";
import { Outlet } from "react-router-dom";

const StudentLayout = ()=>{
    return (
        <>
         <Navbar/>
          <main>
            <Outlet/>
          </main>
        </>
    )
}

export default StudentLayout;
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
// import {
//    type Container,
// } from "@tsparticles/engine";
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { particles_config } from "../utils/particles_config";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import type { UserSignup } from "../types/user";
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

export function Home() {

   const navigate = useNavigate();
   const [init, setInit] = useState(false);
   const [user_data, set_user_data] = useState<UserSignup>();

   useEffect(() => {
      const cookieValue = Cookies.get("user_syntherra_180825");
      if (cookieValue) {
         set_user_data(JSON.parse(cookieValue));
      } else {
         navigate('/login')
      }
   }, []);

   // this should be run only once per application lifetime
   useEffect(() => {
      initParticlesEngine(async (engine) => {
         await loadSlim(engine);
      }).then(() => {
         setInit(true);
      });
   }, []);

   // const particlesLoaded = async (container?: Container): Promise<void> => {
   //    console.log(container);
   // };

   const options: any = useMemo(
      () => (particles_config),
      []
   );

   function handleLogout() {
      Cookies.remove("user_syntherra_180825");
      navigate("/login");
   }

   return (
      <>
         {init && (
            <Particles
               id="tsparticles"
               // particlesLoaded={particlesLoaded}
               options={options}
               className="absolute inset-0 -z-10"
            />
         )}
         <div className="flex items-center justify-center min-h-screen">
            <button
               onClick={handleLogout}
               className="cursor-pointer absolute py-4 px-5 bg-lime-400 top-5 right-5 rounded-md transition border-4 border-transparent hover:border-white"
            >
               Logout
            </button>
            <h1 className="text-white text-center text-6xl w-4/5 line-1 anim-typewriter">
               Olá, {user_data?.user}
            </h1>
         </div>
      </>
   )
}
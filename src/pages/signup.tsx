import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { IoEye, IoEyeOff } from "react-icons/io5"
import local_storage_service from "../services/storage"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const schema = z.object({
   user: z.string().min(3, "O nome de usuario deve ter pelo menos 3 caracteres"),
   email: z.email({ message: "Email inválido" }),
   password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

export function Signup() {

   const navigate = useNavigate();

   const [pwdVisible, set_pwdVisible] = useState(false)

   const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(schema),
   })

   local_storage_service.get_all()

   function handleSignup(data: { user: string, email: string; password: string }) {

      const result = local_storage_service.create_signup(data)
      // console.log(result)

      if(result?.status === 201) {
         toast.success(result?.message);
         navigate("/login");
      } else {
         toast.warn(result?.message);
      }

   }

   return (
      <div className="flex justify-center">
         <div className="w-4/5 md:w-2/5">
            <div className="flex flex-col gap-5 bg-lime-400 my-10 p-5 rounded-md">
               <h1 className="text-3xl text-center">Cadastro</h1>
               <hr className="text-gray-900" />
               <form
                  onSubmit={handleSubmit(handleSignup)}
                  className="flex flex-col gap-2.5"
               >
                  <div className="flex flex-col gap-1">
                     <input className="bg-gray-900 outline-0 rounded-md text-white p-3 placeholder:text-gray-500" placeholder="usuarío" {...register("user")} />
                     {errors.user && <p className="text-xs p-2 rounded-md text-white bg-red-400">{errors.user.message}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                     <input className="bg-gray-900 outline-0 rounded-md text-white p-3 placeholder:text-gray-500" placeholder="email" {...register("email")} />
                     {errors.email && <p className="text-xs p-2 rounded-md text-white bg-red-400">{errors.email.message}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                     <div className="flex w-full bg-gray-900 rounded-md items-center">
                        <input type={pwdVisible ? "text" : "password"} className="outline-0 w-full rounded-md text-white p-3 placeholder:text-gray-500" placeholder="senha" {...register("password")} />
                        <div className="pr-3">
                           {
                              pwdVisible
                                 ? <IoEye className="cursor-pointer text-white" size={20} onClick={() => set_pwdVisible(false)} />
                                 : <IoEyeOff className="cursor-pointer text-white" size={20} onClick={() => set_pwdVisible(true)} />
                           }
                        </div>
                     </div>
                     {errors.password && <p className="text-xs p-2 rounded-md text-white bg-red-400">{errors.password.message}</p>}
                  </div>
                  <input className="bg-gray-900 rounded-md text-white p-3 border-2 border-transparent cursor-pointer hover:bg-lime-400 hover:border-gray-900 hover:text-gray-900 transition" type="submit" />
               </form>
               <hr className="text-gray-900" />
               <p className="text-center text-gray-900">Ja tem cadastro? <Link to="/login" className="bg-gray-900 rounded-md py-1 px-2 text-white hover:underline">faça login</Link></p>
            </div>
         </div>
      </div>
   )
}
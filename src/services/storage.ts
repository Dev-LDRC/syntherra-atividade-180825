import bcrypt from "bcryptjs";
import type { UserLogin, UserSignup } from "../types/user";


class LocalStorageService {
   private localStorage_name = "local_storage_syntherra_180825";
   private localStorage_item_name = "users";

   build_local_storage() {
      if (!localStorage.getItem(this.localStorage_name)) {
         localStorage.setItem(this.localStorage_name, JSON.stringify({ users: [] }));
      }
   }

   add_to_local_storage(data: any, new_user: UserSignup) {

      const parsed = JSON.parse(data);
      const emailExists = parsed[this.localStorage_item_name].some(
         (user: { email: string }) => user.email === new_user.email
      );
      if (emailExists) {
         return { status: 409, message: 'Este e-mail já está cadastrado' };
      }
      new_user.password = bcrypt.hashSync(new_user.password, 8);
      parsed[this.localStorage_item_name].push(new_user);
      localStorage.setItem(this.localStorage_name, JSON.stringify(parsed));
      return { status: 201, message: 'Usuário cadastrado com sucesso!' };

   }

   create_signup(new_user: UserSignup) {

      let data = localStorage.getItem(this.localStorage_name);

      let result_create = null

      if (data) {
         result_create = this.add_to_local_storage(data, new_user);
      } else {
         this.build_local_storage();
         // Atualize o valor de `data` após criar o localStorage
         data = localStorage.getItem(this.localStorage_name);
         if (data) {
            result_create = this.add_to_local_storage(data, new_user);
         } else {
            console.error('Failed to initialize localStorage.');
         }
      }

      return result_create;

   }

   get_all() {
      const data = localStorage.getItem(this.localStorage_name);
      if (data) {
         const parsed = JSON.parse(data);
         console.log(parsed);
      } else {
         console.log('No data found in localStorage.');
      }
   }

   login_user(login_user: UserLogin) {
      const data = localStorage.getItem(this.localStorage_name);
      if (data) {
         const parsed = JSON.parse(data);
         const user: UserSignup = parsed[this.localStorage_item_name].find(
            (user: UserLogin) => (
               user.email === login_user.email &&
               bcrypt.compareSync(login_user.password, user.password)
            )
         );
         if (user) {
            return { status: 200, message: 'Login feito com sucesso!', user_data: user };
         } else {
            return { status: 401, message: 'Email ou senha inválidos' };
         }
      }
   }

}

const local_storage_service = new LocalStorageService();

local_storage_service.build_local_storage();

export default local_storage_service;
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

class AuthController {
    // Listar todos os usuários
  async getAllUsers(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  }

  // Registrar novo usuário
  async register(req, res) {
    try {
        const { name, email, password } = req.body;

        //validação basica
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        //verifica se o user já existe
        const UserExists = await UserModel.findByEmail(email);
        if (UserExists) {
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }

        //Hash 
        const hashedPassword = await bcrypt.hash(password, 10);

        //criar objeto do usuario
        const data = {
            name,
            email,
            password: hashedPassword
        };

        //criar usuario
        const user = await UserModel.create(data);

        return res.status(201).json({ message: "Usuário criado com sucesso", user });
    } catch (error) {
        console.error("Erro ao criar um novo usuário:", error);
        return res.status(500).json({ error: "Erro ao criar um novo usuário" });
    }
  }
}

export default new AuthController();
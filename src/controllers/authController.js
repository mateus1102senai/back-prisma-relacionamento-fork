import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

  async login(req, res) {
    try {
        const {email, password} = req.body;

        //validação basica
        if (!email || !password) {
            return res.status(400).json({ error: "Os campos email e senha são obrigatórios!" });
        }

        //verifica se o user existe
        const UserExists = await UserModel.findByEmail(email);
        if (!UserExists) {
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }

        // Verificar Senha
        const isPasswordValid = await bcrypt.compare(password, UserExists.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciais inválidas!" });
        }

        // Gerar Token
        const token = jwt.sign({ id: UserExists.id, name: UserExists.name, email: UserExists.email }, process.env.JWT_SECRET, { expiresIn: "24h", });

        return res.status(200).json({ message: "Login realizado com sucesso!", token, UserExists });
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({error: "Erro ao realizar login!"});
    }
  }

}

export default new AuthController();

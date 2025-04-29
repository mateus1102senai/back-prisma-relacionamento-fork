import UserModel from "../models/userModel";
import bcrypt from "bcrypt";

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
      
      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Os campos nome, email e senha são obrigatórios!" });
      }

        // Verifica se o usuário já existe
    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

     // Criar objeto do usuário
     const data = {
      name,
      email,
      password: hashPassword,   
    };

    // Criar usuário 
    const user = await UserModel.create(data);

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user,
    });
  } catch (error) {
    console.error("Erro ao criar um novo usuário:", error);
    return res.status(500).json({ error: "Erro ao criar um novo usuário" });

  }

  }

}

export default new AuthController();
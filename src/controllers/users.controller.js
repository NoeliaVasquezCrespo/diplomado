import { User } from '../models/user.js';
import { Task } from '../models/task.js';
import { Status } from '../constants/index.js';
import { encriptar } from '../common/bcrypt.js';
import { Op } from 'sequelize';

async function getUsers(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "password", "status"],
      order: [["id", "DESC"]],
      where: {
        status: Status.ACTIVE,
      },
    });
    res.json(users);
  } catch (error) {
    next(error); 
  }
}

async function createUser(req, res, next) {
  console.log('Entró al controlador');
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const user = await User.create({ 
      username, 
      password 
    });
    res.json(user);
  } catch (error) {
    next(error); 
  }
}

async function getUser(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username', 'password', 'status'],
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }
    const passwordEncriptado = await encriptar(password);
    const user = await User.update({
        username,
        password: passwordEncriptado,
    }, {
        where: {
            id,
        },
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;
  try {
    await User.destroy({
      where: {
        id,
      },
    });
   
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
}

async function activateInactivate(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    try {
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(user.status === status) {
            return res.status(400).json({ message: "Same status" });
        }
        user.status = status;
        await user.save();
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function getTasks(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username'],
      include: [{
        model: Task,
        attributes: ['name', 'done'],
       /* where: {
          done: true
        },*/
      }],
      where: {
        id,
      },
    })
    res.json(user);
  } catch (error) {
    next(error);
  }
}


async function getUsersListPagination (req, res, next) {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const orderBy = req.query.orderBy || 'id';
  const orderDir = req.query.orderDir || 'DESC';

  try {
    const { count, rows } = await User.findAndCountAll({
      attributes: ["id", "username", "status"],
      order: [["id", "DESC"]],
      where: {
        username: {
          [Op.like]: `%${search}%`
        },
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[orderBy, orderDir]],
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    next(error);
  }

}

export default {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  activateInactivate,
  getTasks,
  getUsersListPagination
};
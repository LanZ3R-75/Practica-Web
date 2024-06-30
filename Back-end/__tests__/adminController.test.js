const { 
  postRegisterAdmin, 
  loginAdmin, 
  postComercio, 
  putComercio, 
  getComercios,
  getComercio, 
  deleteComercio,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPassword,
  updateUserEmail,
  deleteUser
} = require('../controllers/admin');
const { adminModel, comerciosModel, contenidoModel, reviewModel, userModel } = require('../models');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

jest.mock('../models');
jest.mock('jsonwebtoken');

describe('Admin Controller', () => {
  describe('postRegisterAdmin', () => {
    it('debería registrar un nuevo administrador', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/admin/register',
        body: { username: 'admin2', password: 'password123' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      adminModel.findOne.mockResolvedValue(null);
      adminModel.prototype.save = jest.fn().mockResolvedValue(req.body);

      await postRegisterAdmin(req, res, next);

      expect(res.statusCode).toBe(201);
      expect(res._getData()).toEqual(expect.objectContaining({
        mesage: 'Administrador registrado con exito'
      }));
    });

    it('debería devolver un error si el administrador ya existe', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/admin/register',
        body: { username: 'admin1', password: 'password123' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      adminModel.findOne.mockResolvedValue(req.body);

      await postRegisterAdmin(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Adminstrador ya existente'
      }));
    });
  });

  describe('loginAdmin', () => {
    it('debería devolver un token si las credenciales son correctas', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/admin/login',
        body: { username: 'admin1', password: 'password123' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockAdmin = {
        _id: '1',
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      adminModel.findOne.mockResolvedValue(mockAdmin);
      jwt.sign.mockReturnValue('token');

      await loginAdmin(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({ token: 'token' });
    });

    it('debería devolver un error si las credenciales no son válidas', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/admin/login',
        body: { username: 'admin1', password: 'wrongpassword' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockAdmin = {
        _id: '1',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      adminModel.findOne.mockResolvedValue(mockAdmin);

      await loginAdmin(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toEqual({ message: 'Credenciales no válidas' });
    });
  });

  describe('postComercio', () => {
    it('debería registrar un nuevo comercio', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/comercios',
        body: { nombre: 'Comercio1', CIF: '12345678X', direccion: 'Calle Falsa 123', email: 'comercio1@example.com', telefono: '123456789' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      comerciosModel.findOne.mockResolvedValue(null);
      contenidoModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'content1' });
      comerciosModel.prototype.save = jest.fn().mockResolvedValue(req.body);
      jwt.sign.mockReturnValue('token');

      await postComercio(req, res, next);

      expect(res.statusCode).toBe(201);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Comercio registrado con éxito',
        comercio: expect.objectContaining({
          nombre: 'Comercio1'
        })
      }));
    });

    it('debería devolver un error si el comercio ya existe', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/comercios',
        body: { nombre: 'Comercio1', CIF: '12345678X', direccion: 'Calle Falsa 123', email: 'comercio1@example.com', telefono: '123456789' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      comerciosModel.findOne.mockResolvedValue(req.body);

      await postComercio(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Comercio ya existe'
      }));
    });
  });

  describe('putComercio', () => {
    it('debería actualizar un comercio existente', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/comercios/1',
        params: { id: '1' },
        body: { nombre: 'Comercio Actualizado' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      comerciosModel.findByIdAndUpdate.mockResolvedValue({ nombre: 'Comercio Actualizado' });

      await putComercio(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Comercio actualizado',
        comercio: expect.objectContaining({
          nombre: 'Comercio Actualizado'
        })
      }));
    });

    it('debería devolver un error si el comercio no se encuentra', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/comercios/1',
        params: { id: '1' },
        body: { nombre: 'Comercio Actualizado' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      comerciosModel.findByIdAndUpdate.mockResolvedValue(null);

      await putComercio(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Comercio no encontrado'
      }));
    });
  });

  describe('getComercios', () => {
    it('debería obtener todos los comercios', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/comercios'
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockComercios = [{ nombre: 'Comercio1' }, { nombre: 'Comercio2' }];
      comerciosModel.find.mockResolvedValue(mockComercios);

      await getComercios(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(mockComercios);
    });
  });

  describe('getComercio', () => {
    it('debería obtener un comercio por su id', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/comercios/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockComercio = { nombre: 'Comercio1' };
      comerciosModel.findById.mockResolvedValue(mockComercio);

      await getComercio(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(mockComercio);
    });

    it('debería devolver un error si no se encuentra el comercio', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/comercios/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      comerciosModel.findById.mockResolvedValue(null);

      await getComercio(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'No se ha encontrado el comercio'
      }));
    });
  });

  describe('deleteComercio', () => {
    it('debería eliminar un comercio', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/api/comercios/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockComercio = { _id: '1', paginaID: 'content1' };
      comerciosModel.findById.mockResolvedValue(mockComercio);
      contenidoModel.findById.mockResolvedValue({ reviews: [] });
      comerciosModel.findByIdAndDelete.mockResolvedValue(mockComercio);

      await deleteComercio(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Comercio y contenido eliminado correctamente'
      }));
    });

    it('debería devolver un error si el comercio no se encuentra', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/api/comercios/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      comerciosModel.findById.mockResolvedValue(null);

      await deleteComercio(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Comercio no encontrado'
      }));
    });
  });

  describe('getAllUsers', () => {
    it('debería obtener todos los usuarios', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users'
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockUsers = [{ nombre: 'User1' }, { nombre: 'User2' }];
      userModel.find.mockResolvedValue(mockUsers);

      await getAllUsers(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(mockUsers);
    });
  });

  describe('getUser', () => {
    it('debería obtener un usuario por su id', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockUser = { nombre: 'User1' };
      userModel.findById.mockResolvedValue(mockUser);

      await getUser(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(mockUser);
    });

    it('debería devolver un error si no se encuentra el usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      userModel.findById.mockResolvedValue(null);

      await getUser(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Usuario no encontrado'
      }));
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/users/1',
        params: { id: '1' },
        body: { ciudad: 'Madrid' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      userModel.findByIdAndUpdate.mockResolvedValue({ ciudad: 'Madrid' });

      await updateUser(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Usuario actualizado correctamente',
        user: expect.objectContaining({
          ciudad: 'Madrid'
        })
      }));
    });

    it('debería devolver un error si no se encuentra el usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/users/1',
        params: { id: '1' },
        body: { ciudad: 'Madrid' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      userModel.findByIdAndUpdate.mockResolvedValue(null);

      await updateUser(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Usuario no encontrado'
      }));
    });
  });

  describe('updateUserPassword', () => {
    it('debería actualizar la contraseña de un usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/users/1/password',
        params: { id: '1' },
        body: { newPassword: 'newpassword' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockUser = { save: jest.fn() };
      userModel.findById.mockResolvedValue(mockUser);

      await updateUserPassword(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Cotraseña actualizada con exito'
      }));
    });

    it('debería devolver un error si no se encuentra el usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/users/1/password',
        params: { id: '1' },
        body: { newPassword: 'newpassword' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      userModel.findById.mockResolvedValue(null);

      await updateUserPassword(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Usuario no encontrado'
      }));
    });
  });

  describe('updateUserEmail', () => {
    it('debería actualizar el correo electrónico de un usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/users/1/email',
        params: { id: '1' },
        body: { newEmail: 'nuevoemail@example.com' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockUser = { email: 'email@example.com', save: jest.fn() };
      userModel.findById.mockResolvedValue(mockUser);
      userModel.findOne.mockResolvedValue(null);

      await updateUserEmail(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Correo electrónico actualizado correctamente',
        user: expect.objectContaining({
          email: 'nuevoemail@example.com'
        })
      }));
    });

    it('debería devolver un error si el correo electrónico ya está en uso', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/users/1/email',
        params: { id: '1' },
        body: { newEmail: 'nuevoemail@example.com' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      userModel.findById.mockResolvedValue({ email: 'email@example.com' });
      userModel.findOne.mockResolvedValue({ email: 'nuevoemail@example.com' });

      await updateUserEmail(req, res, next);

      expect(res.statusCode).toBe(400);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'El correo electrónico ya está en uso'
      }));
    });

    it('debería devolver un error si no se encuentra el usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'PUT',
        url: '/api/users/1/email',
        params: { id: '5' },
        body: { newEmail: 'nuevoemail@example.com' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      userModel.findById.mockResolvedValue(null);

      await updateUserEmail(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Usuario no encontrado'
      }));
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/api/users/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockUser = { _id: '1' };
      userModel.findById.mockResolvedValue(mockUser);
      reviewModel.find.mockResolvedValue([]);
      userModel.findByIdAndDelete.mockResolvedValue(mockUser);

      await deleteUser(req, res, next);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Cuenta de usuario y reseñas asociadas eliminadas con éxito'
      }));
    });

    it('debería devolver un error si no se encuentra el usuario', async () => {
      const req = httpMocks.createRequest({
        method: 'DELETE',
        url: '/api/users/1',
        params: { id: '1' }
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      userModel.findById.mockResolvedValue(null);

      await deleteUser(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual(expect.objectContaining({
        message: 'Usuario no encontrado'
      }));
    });
  });
});

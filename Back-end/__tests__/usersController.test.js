const {
    getContenido,
    getContenidoByCiudad,
    getContenidoByActividad,
    getContenidoByCiudadAndActividad,
    getContenidoByID,
    getReviewsByContenido,
    registerUser,
    loginUser,
    getUserProfile,
    updateUser,
    updateEmail,
    updatePassword,
    deleteUser,
    postReview,
    getUserReview,
    pruebaSlack
  } = require('../controllers/user');
  
  const { comerciosModel, contenidoModel, userModel, reviewModel } = require('../models');
  const httpMocks = require('node-mocks-http');
  const jwt = require('jsonwebtoken');
  const { matchedData } = require('express-validator');
  
  jest.mock('../models');
  jest.mock('jsonwebtoken');
  jest.mock('express-validator');
  
  describe('User Controller', () => {
  
    describe('getContenido', () => {
      it('debería obtener todos los contenidos', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido'
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockContenidos = [{ nombre: 'Contenido1' }, { nombre: 'Contenido2' }];
        comerciosModel.find.mockResolvedValue(mockContenidos);
  
        await getContenido(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockContenidos);
      });
    });
  
    describe('getContenidoByCiudad', () => {
      it('debería obtener todos los contenidos por ciudad', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/ciudad',
          query: { ciudad: 'Madrid' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockContenidos = [{ ciudad: 'Madrid' }];
        contenidoModel.find.mockResolvedValue(mockContenidos);
  
        await getContenidoByCiudad(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockContenidos);
      });
    });
  
    describe('getContenidoByActividad', () => {
      it('debería obtener todos los contenidos por actividad', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/actividad',
          query: { actividad: 'Restaurante' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockContenidos = [{ actividad: 'Restaurante' }];
        contenidoModel.find.mockResolvedValue(mockContenidos);
  
        await getContenidoByActividad(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockContenidos);
      });
    });
  
    describe('getContenidoByCiudadAndActividad', () => {
      it('debería obtener todos los contenidos por ciudad y actividad', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/ciudad/actividad',
          query: { ciudad: 'Madrid', actividad: 'Restaurante' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockContenidos = [{ ciudad: 'Madrid', actividad: 'Restaurante' }];
        contenidoModel.find.mockResolvedValue(mockContenidos);
  
        await getContenidoByCiudadAndActividad(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockContenidos);
      });
    });
  
    describe('getContenidoByID', () => {
      it('debería obtener un contenido por su ID', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/1',
          params: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockContenido = { nombre: 'Contenido1' };
        comerciosModel.findById.mockResolvedValue(mockContenido);
  
        await getContenidoByID(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockContenido);
      });
  
      it('debería devolver un error si no se encuentra el contenido', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/1',
          params: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await getContenidoByID(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'No se ha encontrado ningun contenido para el ID introducido' });
      });
    });
  
    describe('getReviewsByContenido', () => {
      it('debería obtener todas las reviews de un contenido', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/reviews/1',
          params: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { paginaID: { reviews: ['review1', 'review2'] } };
        const mockReview1 = { usuarioID: { nombre: 'User1' }, puntuacion: 4, comentario: 'Comentario 1' };
        const mockReview2 = { usuarioID: { nombre: 'User2' }, puntuacion: 5, comentario: 'Comentario 2' };
  
        comerciosModel.findById.mockResolvedValue(mockComercio);
        reviewModel.findById
          .mockResolvedValueOnce(mockReview1)
          .mockResolvedValueOnce(mockReview2);
  
        await getReviewsByContenido(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual([
          { userName: 'User1', scoring: 4, comentario: 'Comentario 1' },
          { userName: 'User2', scoring: 5, comentario: 'Comentario 2' }
        ]);
      });
  
      it('debería devolver un error si no se encuentra el comercio', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/reviews/1',
          params: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await getReviewsByContenido(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
    });
  
    describe('registerUser', () => {
      it('debería registrar un nuevo usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/users/register',
          body: { email: 'user@test.com', password: 'password123' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
        userModel.findOne.mockResolvedValue(null);
        userModel.prototype.save = jest.fn().mockResolvedValue(req.body);
  
        await registerUser(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(req.body);
      });
  
      it('debería devolver un error si el usuario ya existe', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/users/register',
          body: { email: 'user@test.com', password: 'password123' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
        userModel.findOne.mockResolvedValue(req.body);
  
        await registerUser(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'El usuario ya existe' });
      });
    });
  
    describe('loginUser', () => {
      it('debería iniciar sesión y devolver un token', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/users/login',
          body: { email: 'user@test.com', password: 'password123' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockUser = {
          _id: '1',
          comparePassword: jest.fn().mockResolvedValue(true)
        };
  
        matchedData.mockReturnValue(req.body);
        userModel.findOne.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('token');
  
        await loginUser(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ token: 'token' });
      });
  
      it('debería devolver un error si el usuario no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/users/login',
          body: { email: 'user@test.com', password: 'password123' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
        userModel.findOne.mockResolvedValue(null);
  
        await loginUser(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Usuario no encontrado' });
      });
  
      it('debería devolver un error si la contraseña es incorrecta', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/users/login',
          body: { email: 'user@test.com', password: 'password123' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockUser = {
          _id: '1',
          comparePassword: jest.fn().mockResolvedValue(false)
        };
  
        matchedData.mockReturnValue(req.body);
        userModel.findOne.mockResolvedValue(mockUser);
  
        await loginUser(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Contraseña incorrecta' });
      });
    });
  
    describe('getUserProfile', () => {
      it('debería obtener el perfil del usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/profile',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockUser = { nombre: 'User1', email: 'user1@test.com' };
        userModel.findById.mockResolvedValue(mockUser);
  
        await getUserProfile(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockUser);
      });
  
      it('debería devolver un error si no se encuentra el usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/profile',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        userModel.findById.mockResolvedValue(null);
  
        await getUserProfile(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Usuario no encontrado' });
      });
    });
  
    describe('updateUser', () => {
      it('debería actualizar los datos del usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update',
          user: { id: '1' },
          body: { ciudad: 'Madrid', intereses: ['Deporte'], ofertas: true }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
  
        const mockUser = {
          ciudad: 'Madrid',
          intereses: ['Deporte'],
          ofertas: true
        };
  
        userModel.findById.mockResolvedValue(mockUser);
        userModel.findByIdAndUpdate.mockResolvedValue(mockUser);
  
        await updateUser(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Usuario actualizado con éxito',
          contenido: mockUser
        }));
      });
  
      it('debería devolver un error si no se encuentra el usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update',
          user: { id: '1' },
          body: { ciudad: 'Madrid', intereses: ['Deporte'], ofertas: true }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        userModel.findById.mockResolvedValue(null);
  
        await updateUser(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Usuario no encontrado' });
      });
    });
  
    describe('updateEmail', () => {
      it('debería actualizar el correo electrónico del usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update/email',
          user: { id: '1' },
          body: { email: 'newemail@test.com' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
  
        const mockUser = { email: 'user@test.com' };
        userModel.findById.mockResolvedValue(mockUser);
        userModel.findOne.mockResolvedValue(null);
  
        await updateEmail(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Correo electrónico actualizado con éxito',
          user: expect.objectContaining({
            email: 'newemail@test.com'
          })
        }));
      });
  
      it('debería devolver un error si el correo electrónico ya está en uso', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update/email',
          user: { id: '1' },
          body: { email: 'newemail@test.com' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
  
        const mockUser = { email: 'user@test.com' };
        userModel.findById.mockResolvedValue(mockUser);
        userModel.findOne.mockResolvedValue({ email: 'newemail@test.com' });
  
        await updateEmail(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'El correo electrónico ya está en uso' });
      });
  
      it('debería devolver un error si no se encuentra el usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update/email',
          user: { id: '1' },
          body: { email: 'newemail@test.com' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        userModel.findById.mockResolvedValue(null);
  
        await updateEmail(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Usuario no encontrado' });
      });
    });
  
    describe('updatePassword', () => {
      it('debería actualizar la contraseña del usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update/password',
          user: { id: '1' },
          body: { oldPassword: 'oldpassword', newPassword: 'newpassword' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
  
        const mockUser = {
          comparePassword: jest.fn().mockResolvedValue(true),
          save: jest.fn()
        };
  
        userModel.findById.mockResolvedValue(mockUser);
  
        await updatePassword(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ message: 'Contraseña actualizado con éxito' });
      });
  
      it('debería devolver un error si la contraseña antigua es incorrecta', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update/password',
          user: { id: '1' },
          body: { oldPassword: 'wrongpassword', newPassword: 'newpassword' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
  
        const mockUser = {
          comparePassword: jest.fn().mockResolvedValue(false)
        };
  
        userModel.findById.mockResolvedValue(mockUser);
  
        await updatePassword(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Contraseña antigua incorrecta' });
      });
  
      it('debería devolver un error si no se encuentra el usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/users/update/password',
          user: { id: '1' },
          body: { oldPassword: 'oldpassword', newPassword: 'newpassword' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        userModel.findById.mockResolvedValue(null);
  
        await updatePassword(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Usuario no encontrado' });
      });
    });
  
    describe('deleteUser', () => {
      it('debería eliminar un usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/users/delete',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockUser = { _id: '1' };
        userModel.findById.mockResolvedValue(mockUser);
        reviewModel.find.mockResolvedValue([]);
        userModel.findByIdAndDelete.mockResolvedValue(mockUser);
  
        await deleteUser(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ message: 'Cuenta de usuario y reseñas asociadas eliminadas con éxito' });
      });
  
      it('debería devolver un error si no se encuentra el usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/users/delete',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        userModel.findById.mockResolvedValue(null);
  
        await deleteUser(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Usuario no encontrado' });
      });
    });
  
    describe('postReview', () => {
      it('debería publicar una reseña', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/contenido/1/review',
          params: { contenidoId: '1' },
          user: { id: '1' },
          body: { comentario: 'Comentario', puntuacion: 5 }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
  
        const mockContenido = {
          _id: '1',
          reviews: [],
          numScoring: 0,
          scoring: 0
        };
  
        contenidoModel.findById.mockResolvedValue(mockContenido);
        reviewModel.findOne.mockResolvedValue(null);
        reviewModel.prototype.save = jest.fn().mockResolvedValue(req.body);
        contenidoModel.findByIdAndUpdate.mockResolvedValue(mockContenido);
  
        await postReview(req, res, next);
  
        expect(res.statusCode).toBe(201);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Reseña publicada correctamente',
          review: req.body
        }));
      });
  
      it('debería devolver un error si ya existe una reseña del usuario para ese contenido', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/contenido/1/review',
          params: { contenidoId: '1' },
          user: { id: '1' },
          body: { comentario: 'Comentario', puntuacion: 5 }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        matchedData.mockReturnValue(req.body);
  
        const mockReview = { usuarioID: '1', contenidoID: '1' };
        reviewModel.findOne.mockResolvedValue(mockReview);
  
        await postReview(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Ya has escrito una reseña para este contenido' });
      });
    });
  
    describe('getUserReview', () => {
      it('debería listar todas las reviews escritas por un usuario', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/reviews',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockReviews = [
          { usuarioID: '1', comentario: 'Comentario 1', puntuacion: 4 },
          { usuarioID: '1', comentario: 'Comentario 2', puntuacion: 5 }
        ];
  
        userModel.findById.mockResolvedValue({ _id: '1' });
        reviewModel.find.mockResolvedValue(mockReviews);
  
        await getUserReview(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(mockReviews);
      });
  
      it('debería devolver un error si el usuario no ha publicado ninguna review', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/users/reviews',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        userModel.findById.mockResolvedValue({ _id: '1' });
        reviewModel.find.mockResolvedValue([]);
  
        await getUserReview(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'El usuario no ha publicado ninguna review' });
      });
    });
  
    describe('pruebaSlack', () => {
      it('debería forzar un error para probar Slack', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/testSlack'
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        await pruebaSlack(req, res, next);
  
        expect(next).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });
  
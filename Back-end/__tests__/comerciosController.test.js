const { 
    loginComercio,
    getComercioyContenido,
    deleteComercio,
    createContenido,
    deleteContenido,
    updateContenido,
    uploadText,
    deleteText,
    uploadFoto,
    deleteFoto,
    consultarIntereses
  } = require('../controllers/comercios');
  const { comerciosModel, contenidoModel, userModel, reviewModel } = require('../models');
  const httpMocks = require('node-mocks-http');
  const jwt = require('jsonwebtoken');
  const fs = require('fs');
  const path = require('path');
  
  jest.mock('../models');
  jest.mock('jsonwebtoken');
  jest.mock('fs');
  
  describe('Comercios Controller', () => {
    describe('loginComercio', () => {
      it('debería loguear un comercio y devolver un token', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/login',
          body: { email: 'comercio@test.com', cif: '12345678X' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', email: 'comercio@test.com', CIF: '12345678X', tokenJWT: null };
        comerciosModel.findOne.mockResolvedValue(mockComercio);
        jwt.sign.mockReturnValue('token');
  
        await loginComercio(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          token: 'token',
          comercio: expect.objectContaining({ email: 'comercio@test.com' })
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/login',
          body: { email: 'comercio@test.com', cif: '12345678X' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findOne.mockResolvedValue(null);
  
        await loginComercio(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
  
      it('debería devolver un error si las credenciales son incorrectas', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/login',
          body: { email: 'comercio@test.com', cif: 'wrongcif' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', email: 'comercio@test.com', CIF: '12345678X' };
        comerciosModel.findOne.mockResolvedValue(mockComercio);
  
        await loginComercio(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Credenciales incorrectas' });
      });
    });
  
    describe('getComercioyContenido', () => {
      it('debería obtener el contenido asociado al comercio', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/info',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', nombre: 'Comercio1', email: 'comercio@test.com', CIF: '12345678X', paginaID: { ciudad: 'Ciudad', actividad: 'Actividad' } };
        comerciosModel.findById.mockResolvedValue(mockComercio);
  
        await getComercioyContenido(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          nombre: 'Comercio1',
          email: 'comercio@test.com',
          CIF: '12345678X',
          contenido: expect.objectContaining({ ciudad: 'Ciudad', actividad: 'Actividad' })
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/info',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await getComercioyContenido(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
    });
  
    describe('createContenido', () => {
      it('debería crear un nuevo contenido', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido',
          user: { id: '1' },
          body: { ciudad: 'Ciudad', actividad: 'Actividad' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: null };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.prototype.save = jest.fn().mockResolvedValue(req.body);
        comerciosModel.prototype.save = jest.fn().mockResolvedValue(mockComercio);
  
        await createContenido(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Contenido nuevo creado con éxito',
          contenido: expect.objectContaining({ ciudad: 'Ciudad', actividad: 'Actividad' })
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await createContenido(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
  
      it('debería devolver un error si el contenido ya existe para el comercio', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        comerciosModel.findById.mockResolvedValue(mockComercio);
  
        await createContenido(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'Contenido ya existe para este comercio' });
      });
    });
  
    describe('deleteContenido', () => {
      it('debería eliminar el contenido de un comercio', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', reviews: [] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findByIdAndDelete.mockResolvedValue(mockContenido);
        reviewModel.deleteMany.mockResolvedValue({ deletedCount: 0 });
        comerciosModel.prototype.save = jest.fn().mockResolvedValue(mockComercio);
  
        await deleteContenido(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ message: 'Contenido eliminado con exito' });
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await deleteContenido(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
  
      it('debería devolver un error si el comercio no tiene contenido asociado', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: null };
        comerciosModel.findById.mockResolvedValue(mockComercio);
  
        await deleteContenido(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'El comercio no tiene un contenido asociado' });
      });
    });
  
    describe('deleteComercio', () => {
      it('debería eliminar un comercio y su contenido', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', reviews: [] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
        reviewModel.deleteMany.mockResolvedValue({ deletedCount: 0 });
        contenidoModel.findByIdAndDelete.mockResolvedValue(mockContenido);
        comerciosModel.findByIdAndDelete.mockResolvedValue(mockComercio);
  
        await deleteComercio(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ message: 'Comercio y contenido eliminado correctamente' });
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await deleteComercio(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
    });
  
    describe('updateContenido', () => {
      it('debería actualizar el contenido de un comercio', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/comercios/contenido',
          user: { id: '1' },
          body: { ciudad: 'Ciudad Actualizada' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', ciudad: 'Ciudad Actualizada' };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findByIdAndUpdate.mockResolvedValue(mockContenido);
  
        await updateContenido(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Página web actualizada con éxito',
          contenido: expect.objectContaining({ ciudad: 'Ciudad Actualizada' })
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/comercios/contenido',
          user: { id: '1' },
          body: { ciudad: 'Ciudad Actualizada' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await updateContenido(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
  
      it('debería devolver un error si el contenido no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'PUT',
          url: '/api/comercios/contenido',
          user: { id: '1' },
          body: { ciudad: 'Ciudad Actualizada' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findByIdAndUpdate.mockResolvedValue(null);
  
        await updateContenido(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Página web no encontrada' });
      });
    });
  
    describe('uploadText', () => {
      it('debería subir un texto', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido/text',
          user: { id: '1' },
          body: { text: 'Nuevo texto' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', text: [] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
        contenidoModel.prototype.save = jest.fn().mockResolvedValue(mockContenido);
  
        await uploadText(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Texto añadido correctamente',
          texto: expect.arrayContaining(['Nuevo texto'])
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido/text',
          user: { id: '1' },
          body: { text: 'Nuevo texto' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await uploadText(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
    });
  
    describe('deleteText', () => {
      it('debería eliminar un texto', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido/text/0',
          user: { id: '1' },
          params: { textIndex: '0' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', text: ['Texto a eliminar'] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
        contenidoModel.prototype.save = jest.fn().mockResolvedValue(mockContenido);
  
        await deleteText(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Texto eliminado correctamente',
          texto: []
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido/text/0',
          user: { id: '1' },
          params: { textIndex: '0' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await deleteText(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
  
      it('debería devolver un error si el texto no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido/text/0',
          user: { id: '1' },
          params: { textIndex: '0' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', text: [] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
  
        await deleteText(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Texto no encontrado' });
      });
    });
  
    describe('uploadFoto', () => {
      it('debería subir una foto', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido/foto',
          user: { id: '1' },
          file: { path: 'path/to/foto.jpg' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', fotos: [] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
        contenidoModel.prototype.save = jest.fn().mockResolvedValue(mockContenido);
  
        await uploadFoto(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Foto añadida correctamente',
          fotos: expect.arrayContaining(['path/to/foto.jpg'])
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido/foto',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await uploadFoto(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
  
      it('debería devolver un error si no se ha subido ninguna foto', async () => {
        const req = httpMocks.createRequest({
          method: 'POST',
          url: '/api/comercios/contenido/foto',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        comerciosModel.findById.mockResolvedValue(mockComercio);
  
        await uploadFoto(req, res, next);
  
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toEqual({ message: 'No se ha subido ninguna foto' });
      });
    });
  
    describe('deleteFoto', () => {
      it('debería eliminar una foto', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido/foto/0',
          user: { id: '1' },
          params: { fotoIndex: '0' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', fotos: ['path/to/foto.jpg'] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
        contenidoModel.prototype.save = jest.fn().mockResolvedValue(mockContenido);
        fs.unlinkSync.mockReturnValue();
  
        await deleteFoto(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual(expect.objectContaining({
          message: 'Foto eliminada correctamente',
          fotos: []
        }));
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido/foto/0',
          user: { id: '1' },
          params: { fotoIndex: '0' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await deleteFoto(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
  
      it('debería devolver un error si la foto no es encontrada', async () => {
        const req = httpMocks.createRequest({
          method: 'DELETE',
          url: '/api/comercios/contenido/foto/0',
          user: { id: '1' },
          params: { fotoIndex: '0' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', fotos: [] };
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
  
        await deleteFoto(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Foto no encontrado' });
      });
    });
  
    describe('consultarIntereses', () => {
      it('debería consultar los intereses y devolver los emails de los usuarios', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/intereses',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        const mockComercio = { _id: '1', paginaID: 'content1' };
        const mockContenido = { _id: 'content1', ciudad: 'Ciudad', actividad: 'Actividad' };
        const mockUsers = [{ email: 'user1@test.com' }, { email: 'user2@test.com' }];
        comerciosModel.findById.mockResolvedValue(mockComercio);
        contenidoModel.findById.mockResolvedValue(mockContenido);
        userModel.find.mockResolvedValue(mockUsers);
  
        await consultarIntereses(req, res, next);
  
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ emails: ['user1@test.com', 'user2@test.com'] });
      });
  
      it('debería devolver un error si el comercio no es encontrado', async () => {
        const req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/comercios/contenido/intereses',
          user: { id: '1' }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
  
        comerciosModel.findById.mockResolvedValue(null);
  
        await consultarIntereses(req, res, next);
  
        expect(res.statusCode).toBe(404);
        expect(res._getData()).toEqual({ message: 'Comercio no encontrado' });
      });
    });
  });
  
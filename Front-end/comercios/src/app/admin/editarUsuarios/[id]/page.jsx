import EditarUsuarios from '@/components/admin/editarUsuario';

const EditarUsuariosPage = ({ params }) => {
  const { id } = params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <EditarUsuarios id={id} />
    </main>
  );
};

export default EditarUsuariosPage;
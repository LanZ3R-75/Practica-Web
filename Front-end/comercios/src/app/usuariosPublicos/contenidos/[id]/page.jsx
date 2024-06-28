import Contenido from '@/components/usuariosPublicos/contenido';

const ComercioPage = ({ params }) => {
  const { id } = params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Contenido id={id} />
    </main>
  );
};

export default ComercioPage;

// src/app/admin/editarComercio/[id]/page.jsx
import EditComercio from '@/components/admin/editarComercio';

const EditComercioPage = ({ params }) => {
  const { id } = params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <EditComercio id={id} />
    </main>
  );
};

export default EditComercioPage;

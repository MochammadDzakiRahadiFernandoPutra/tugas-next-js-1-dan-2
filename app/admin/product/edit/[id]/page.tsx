import { EditProductForm } from "@/components/edit-product-form";

export default function Page({ params }: { params: { id: string } }) {
  // params.id diambil otomatis dari URL /admin/product/edit/1
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <EditProductForm idBarang={params.id} />
      </div>
    </div>
  );
}
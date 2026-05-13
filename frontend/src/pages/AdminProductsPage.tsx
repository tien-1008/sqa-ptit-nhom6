import { FormEvent, useEffect, useState } from "react";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { formatCurrency } from "../lib/format";
import type { Category, Product } from "../types";

interface ProductFormState {
  categoryId: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  status: "ACTIVE" | "INACTIVE";
  imageUrl: string;
}

const emptyForm: ProductFormState = {
  categoryId: "1",
  name: "",
  description: "",
  price: "",
  stock: "",
  status: "ACTIVE",
  imageUrl: ""
};

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadPage();
  }, []);

  async function loadPage() {
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        api<Product[]>("/admin/products"),
        api<Category[]>("/products/categories")
      ]);
      setProducts(nextProducts);
      setCategories(nextCategories);
      if (nextCategories[0]) {
        setForm((current) => ({
          ...current,
          categoryId: current.categoryId || String(nextCategories[0].id)
        }));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong tai duoc du lieu admin.");
    }
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      categoryId: String(product.categoryId),
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
      imageUrl: product.imageUrl ?? ""
    });
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      categoryId: Number(form.categoryId),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
      imageUrl: form.imageUrl
    };

    try {
      if (editingId) {
        await api(`/admin/products/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        setMessage("Da cap nhat san pham.");
      } else {
        await api("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setMessage("Da tao san pham.");
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadPage();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong luu duoc san pham.");
    }
  }

  async function deleteProduct(productId: number) {
    if (!window.confirm("Xoa san pham nay? San pham co lich su don hang se bi tu choi.")) {
      return;
    }

    setError("");
    setMessage("");
    try {
      await api(`/admin/products/${productId}`, { method: "DELETE" });
      setMessage("Da xoa san pham.");
      await loadPage();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Khong xoa duoc san pham.");
    }
  }

  return (
    <section className="admin-grid">
      <form className="form-panel" onSubmit={submitProduct}>
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow">Admin Product</p>
            <h1>{editingId ? "Sua san pham" : "Them san pham"}</h1>
          </div>
        </div>
        <label>
          Danh muc
          <select
            value={form.categoryId}
            onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ten san pham
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        </label>
        <label>
          Mo ta
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
        </label>
        <div className="two-column-fields">
          <label>
            Gia
            <input
              min="1000"
              type="number"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            />
          </label>
          <label>
            Ton kho
            <input
              min="0"
              type="number"
              value={form.stock}
              onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
            />
          </label>
        </div>
        <label>
          Trang thai
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as ProductFormState["status"]
              }))
            }
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </label>
        <label>
          Image URL
          <input value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} />
        </label>
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <button className="primary-button" type="submit">
          <PlusCircle size={18} />
          {editingId ? "Luu thay doi" : "Tao san pham"}
        </button>
      </form>

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>San pham</th>
              <th>Danh muc</th>
              <th>Gia</th>
              <th>Ton</th>
              <th>Trang thai</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.categoryName}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td>{product.status}</td>
                <td>
                  <div className="row-actions">
                    <button className="icon-button" type="button" onClick={() => editProduct(product)}>
                      <Pencil size={16} />
                    </button>
                    <button
                      className="icon-button danger-button"
                      type="button"
                      onClick={() => void deleteProduct(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

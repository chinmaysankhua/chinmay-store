import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { addData, deleteData, readData, updateData } from "../firebase/database";

const EMPTY = { label: "Home", fullName: "", phone: "", address: "", city: "", state: "", pinCode: "" };
const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#263E32]";

function formatAddress(address) {
  return [address.address, address.city, address.state, address.pinCode].filter(Boolean).join(", ");
}

export default function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const path = user?.uid ? `users/${user.uid}/addresses` : null;

  const loadAddresses = useCallback(async () => {
    if (!path || !user?.idToken) {
      setAddresses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await readData(path, user.idToken);
      const list = data ? Object.entries(data).map(([id, value]) => ({ ...value, id })) : [];
      list.sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));
      setAddresses(list);
    } catch (err) {
      setError(err.message || "Could not load your addresses.");
    } finally {
      setLoading(false);
    }
  }, [path, user?.idToken]);

  useEffect(() => { loadAddresses(); }, [loadAddresses]);

  function change(event) {
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
  }

  function startEdit(address) {
    setEditingId(address.id);
    setForm({ ...EMPTY, ...address });
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    const phone = form.phone.replace(/\D/g, "");
    if (phone.length !== 10) return setError("Enter a valid 10-digit phone number.");
    if (!/^\d{6}$/.test(form.pinCode.trim())) return setError("Enter a valid 6-digit PIN code.");
    if (!user?.uid || !user?.idToken || !path) return setError("Please sign in again.");

    setSaving(true);
    try {
      const addressData = {
        label: form.label.trim() || "Other",
        fullName: form.fullName.trim(),
        phone,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pinCode: form.pinCode.trim(),
        isDefault: addresses.length === 0 || Boolean(form.isDefault),
        updatedAt: new Date().toISOString(),
      };

      if (addressData.isDefault) {
        await Promise.all(addresses.filter((item) => item.id !== editingId && item.isDefault)
          .map((item) => updateData(`${path}/${item.id}`, { isDefault: false }, user.idToken)));
      }

      if (editingId) {
        await updateData(`${path}/${editingId}`, addressData, user.idToken);
        setNotice("Address updated successfully.");
      } else {
        addressData.createdAt = new Date().toISOString();
        await addData(path, addressData, user.idToken);
        setNotice("Address saved successfully.");
      }
      resetForm();
      await loadAddresses();
    } catch (err) {
      setError(err.message || "Unable to save this address.");
    } finally {
      setSaving(false);
    }
  }

  async function makeDefault(address) {
    setError(""); setNotice("");
    try {
      await Promise.all(addresses.map((item) =>
        updateData(`${path}/${item.id}`, { isDefault: item.id === address.id }, user.idToken)
      ));
      setNotice("Default address updated.");
      await loadAddresses();
    } catch (err) {
      setError(err.message || "Unable to update default address.");
    }
  }

  async function removeAddress(address) {
    if (!window.confirm(`Delete the ${address.label || "saved"} address?`)) return;
    setError(""); setNotice("");
    try {
      await deleteData(`${path}/${address.id}`, user.idToken);
      const remaining = addresses.filter((item) => item.id !== address.id);
      if (address.isDefault && remaining.length) {
        await updateData(`${path}/${remaining[0].id}`, { isDefault: true }, user.idToken);
      }
      setNotice("Address deleted.");
      await loadAddresses();
    } catch (err) {
      setError(err.message || "Unable to delete this address.");
    }
  }

  if (!user) return (
    <><Header /><main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Sign in to manage addresses</h1>
      <Link to="/login" state={{ from: "/addresses" }} className="mt-5 inline-block rounded-lg bg-[#263E32] px-5 py-3 font-semibold text-white">Sign in</Link>
    </main><Footer /></>
  );

  return (
    <><Header /><main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-widest text-[#8A806F]">Your account</p>
          <h1 className="mt-2 text-3xl font-bold text-[#292820]">My Addresses</h1>
          <p className="mt-2 text-gray-600">Manage the delivery addresses for your orders.</p></div>
        <Link to="/checkout" className="rounded-lg bg-[#263E32] px-4 py-3 font-semibold text-white">Continue to checkout</Link>
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-gray-200 p-5 sm:p-7">
        <h2 className="text-xl font-semibold">{editingId ? "Edit address" : "Add a new address"}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Address label
            <select name="label" value={form.label} onChange={change} className={`${inputClass} mt-2`}>
              <option>Home</option><option>Work</option><option>Other</option>
            </select>
          </label>
          <label className="text-sm font-medium">Full name
            <input name="fullName" value={form.fullName} onChange={change} required maxLength={100} className={`${inputClass} mt-2`} autoComplete="name" />
          </label>
          <label className="text-sm font-medium">Phone number
            <input name="phone" type="tel" value={form.phone} onChange={change} required maxLength={15} className={`${inputClass} mt-2`} autoComplete="tel" />
          </label>
          <label className="text-sm font-medium sm:col-span-2">House number and street
            <textarea name="address" value={form.address} onChange={change} required maxLength={300} rows={2} className={`${inputClass} mt-2`} autoComplete="street-address" />
          </label>
          <label className="text-sm font-medium">City
            <input name="city" value={form.city} onChange={change} required maxLength={100} className={`${inputClass} mt-2`} autoComplete="address-level2" />
          </label>
          <label className="text-sm font-medium">State
            <input name="state" value={form.state} onChange={change} required maxLength={100} className={`${inputClass} mt-2`} autoComplete="address-level1" />
          </label>
          <label className="text-sm font-medium">PIN code
            <input name="pinCode" value={form.pinCode} onChange={change} required maxLength={6} inputMode="numeric" className={`${inputClass} mt-2`} autoComplete="postal-code" />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button disabled={saving} className="rounded-lg bg-[#263E32] px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : editingId ? "Update address" : "Save address"}</button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-5 py-3 font-semibold">Cancel edit</button>}
        </div>
      </form>

      <section className="mt-9">
        <h2 className="text-xl font-semibold">Saved addresses</h2>
        {loading ? <p className="py-8 text-gray-600">Loading addresses...</p> : addresses.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-600">No saved addresses yet. Add your first address above.</p>
        ) : <div className="mt-4 grid gap-4 md:grid-cols-2">
          {addresses.map((address) => <article key={address.id} className="rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3"><div>
              <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{address.label || "Address"}</h3>
                {address.isDefault && <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">Default</span>}</div>
              <p className="mt-3 font-medium">{address.fullName}</p><p className="mt-1 text-sm text-gray-600">{address.phone}</p>
              <p className="mt-2 text-sm leading-6 text-gray-600">{formatAddress(address)}</p>
            </div></div>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
              <button onClick={() => startEdit(address)} className="text-sm font-semibold text-[#263E32] underline">Edit</button>
              {!address.isDefault && <button onClick={() => makeDefault(address)} className="text-sm font-semibold text-[#263E32] underline">Make default</button>}
              <button onClick={() => removeAddress(address)} className="text-sm font-semibold text-red-600 underline">Delete</button>
            </div>
          </article>)}
        </div>}
      </section>
    </main><Footer /></>
  );
}

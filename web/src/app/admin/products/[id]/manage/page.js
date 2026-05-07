"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { getImageUrl } from "@/utils/imageUtils";
import Loader from "@/components/common/Loader";
import StarRating from "@/components/store/StarRating";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { swalConfirm, swalToast, swalError } from "@/utils/swal";

export default function ProductManagement() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("stock");
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    field: "",
    value: "",
    extraData: null,
  });

  const {
    data: product,
    isLoading: pLoading,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => (await api.get(`/products/${id}`)).data,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => (await api.get(`/reviews/product/${id}`)).data,
  });

  const { updateProduct: updateMutation } = useAdminProducts();

  const salePrice = useMemo(() => {
    if (!product) return 0;
    return (
      product.price -
      (product.price * (product.discount || 0)) / 100
    ).toFixed(2);
  }, [product]);

  if (pLoading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );
  if (!product)
    return (
      <div className="p-20 text-center font-black text-4xl text-zinc-300 dark:text-zinc-800 uppercase">
        Product Not Found
      </div>
    );

  const syncWithBackend = async (changes) => {
    const formData = new FormData();
    const finalData = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discount: product.discount,
      category: product.category._id,
      subcategory: product.subcategory?._id,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      tags: product.tags,
      sizes: product.sizes.map((s) => ({ size: s.size._id, stock: s.stock })),
      images: product.images,
      ...changes,
    };

    Object.keys(finalData).forEach((key) => {
      if (["sizes", "tags", "images"].includes(key)) {
        formData.append(key, JSON.stringify(finalData[key]));
      } else if (finalData[key] !== undefined && key !== "newFiles") {
        formData.append(key, finalData[key]);
      }
    });

    if (changes.newFiles) {
      for (let i = 0; i < changes.newFiles.length; i++) {
        formData.append("images", changes.newFiles[i]);
      }
    }

    try {
      await updateMutation({ id, data: formData });
      swalToast("Databanks Synchronized", "success");
      setModal({ ...modal, isOpen: false });
      refetch(); // refresh product data
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Check connection.";
      swalError("Sync Protocol Failed", msg);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const val = e.target.inputVal?.value;

    if (modal.type === "stock") {
      const newSizes = product.sizes.map((s) =>
        s.size._id === modal.extraData
          ? { size: s.size._id, stock: parseInt(val) }
          : { size: s.size._id, stock: s.stock },
      );
      syncWithBackend({
        sizes: newSizes.map((s) => ({ size: s.size, stock: s.stock })),
      });
    } else if (modal.type === "bulkStock") {
      syncWithBackend({
        sizes: product.sizes.map((s) => ({
          size: s.size._id,
          stock: parseInt(val),
        })),
      });
    } else if (modal.type === "image") {
      const files = fileInputRef.current.files;
      if (product.images.length + files.length > 5) {
        return swalError("Quota Exceeded", "Limit: 5 images per product.");
      }
      syncWithBackend({ newFiles: files });
    } else {
      syncWithBackend({ [modal.field]: val });
    }
  };

  const handleRemoveImage = async (index) => {
    const isConfirmed = await swalConfirm(
      "Purge Visual?",
      "This image will be permanently deleted.",
    );
    if (isConfirmed) {
      syncWithBackend({
        images: product.images.filter((_, idx) => idx !== index),
      });
    }
  };

  const handleDeleteReview = async (revId) => {
    const isConfirmed = await swalConfirm(
      "Moderate Review?",
      "This feedback will be removed.",
    );
    if (isConfirmed) {
      try {
        await api.delete(`/reviews/${revId}`);
        refetchReviews();
        swalToast("Review Removed", "success");
      } catch (err) {
        swalError(
          "Action Blocked",
          err.response?.data?.message || "Could not delete.",
        );
      }
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
      {/* HEADER */}
      <div className="bg-white dark:bg-[#0a0a0a] p-8 rounded-[2.5rem] shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <img
            src={getImageUrl(product.images?.[0])}
            className="h-24 w-24 rounded-[1.5rem] object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm"
            alt=""
          />
          <div>
            <Link
              href="/admin/products"
              className="text-[9px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-white tracking-[0.3em] mb-2 block uppercase transition-colors"
            >
              ← Back to List
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
              {product.name}
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => syncWithBackend({ isActive: !product.isActive })}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${product.isActive ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800"}`}
          >
            {product.isActive ? "● PUBLIC" : "○ HIDDEN"}
          </button>
          <button
            onClick={() => syncWithBackend({ isFeatured: !product.isFeatured })}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${product.isFeatured ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800"}`}
          >
            {product.isFeatured ? "★ FEATURED" : "☆ FEATURE"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex bg-white dark:bg-[#111] p-2 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-x-auto gap-2 no-scrollbar">
        {["stock", "pricing", "media", "reviews", "details"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-1 min-w-[120px] py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-full transition-all ${activeTab === t ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* STOCK */}
      {activeTab === "stock" && (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Inventory Logic
            </h3>
            <button
              onClick={() =>
                setModal({
                  isOpen: true,
                  type: "bulkStock",
                  title: "Global Sync",
                  value: 0,
                })
              }
              className="text-[10px] font-black text-zinc-900 dark:text-black bg-zinc-100 dark:bg-white px-5 py-2.5 rounded-full uppercase tracking-widest hover:scale-105 transition-all"
            >
              Bulk Update
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.sizes?.map((s) => (
              <div
                key={s._id}
                className="p-6 bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] flex justify-between items-center group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
              >
                <div>
                  <p className="text-3xl font-black text-zinc-900 dark:text-white uppercase leading-none mb-2">
                    {s.size?.name}
                  </p>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest ${s.stock < 10 ? "text-rose-500" : "text-zinc-500"}`}
                  >
                    Stock: {s.stock}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setModal({
                      isOpen: true,
                      type: "stock",
                      title: `Update ${s.size?.name}`,
                      extraData: s.size._id,
                      value: s.stock,
                    })
                  }
                  className="w-12 h-12 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRICING */}
      {activeTab === "pricing" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">
              Pricing Architecture
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-8 bg-zinc-50 dark:bg-[#111] rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                    Base Price
                  </p>
                  <p className="text-4xl font-black text-zinc-900 dark:text-white leading-none">
                    ৳{product.price}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setModal({
                      isOpen: true,
                      type: "price",
                      title: "Edit Base Price",
                      field: "price",
                      value: product.price,
                    })
                  }
                  className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all text-zinc-900 dark:text-white"
                >
                  Edit
                </button>
              </div>
              <div className="flex justify-between items-center p-8 bg-rose-500/5 dark:bg-rose-500/10 rounded-3xl border border-rose-500/20 text-rose-600 dark:text-rose-400">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">
                    Active Discount
                  </p>
                  <p className="text-4xl font-black leading-none">
                    {product.discount || 0}% OFF
                  </p>
                </div>
                <button
                  onClick={() =>
                    setModal({
                      isOpen: true,
                      type: "discount",
                      title: "Edit Discount",
                      field: "discount",
                      value: product.discount,
                    })
                  }
                  className="bg-rose-600 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-rose-500/20"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 dark:bg-white rounded-[2.5rem] p-10 text-white dark:text-black flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">
                Customer End Price
              </p>
              <h2 className="text-8xl md:text-[8rem] font-black tracking-tighter leading-none">
                ৳{salePrice}
              </h2>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-black/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          </div>
        </div>
      )}

      {/* MEDIA */}
      {activeTab === "media" && (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                Media Assets
              </h3>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                Limit: 5 Visuals
              </p>
            </div>
            <button
              disabled={product.images.length >= 5}
              onClick={() =>
                setModal({ isOpen: true, type: "image", title: "Upload Media" })
              }
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${product.images.length >= 5 ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed" : "bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105 shadow-xl"}`}
            >
              {product.images.length >= 5 ? "Max Reached" : "+ Upload"}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {product.images?.map((img, i) => (
              <div
                key={i}
                className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-50 dark:bg-[#111]"
              >
                <img
                  src={getImageUrl(img)}
                  className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  alt=""
                />
                <button
                  onClick={() => handleRemoveImage(i)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  <svg
                    className="w-8 h-8 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILS */}
      {activeTab === "details" && (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] p-10 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">
            Text Content
          </h3>
          {[
            { label: "Display Name", field: "name", value: product.name },
            {
              label: "Description",
              field: "description",
              value: product.description,
            },
            { label: "URL Slug", field: "slug", value: product.slug },
          ].map((d) => (
            <div
              key={d.field}
              className="p-8 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111] rounded-3xl flex flex-col md:flex-row justify-between md:items-center gap-6 group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all"
            >
              <div className="flex-1">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                  {d.label}
                </p>
                <p className="text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
                  {d.value}
                </p>
              </div>
              <button
                onClick={() =>
                  setModal({
                    isOpen: true,
                    type: "details",
                    title: `Edit ${d.label}`,
                    field: d.field,
                    value: d.value,
                  })
                }
                className="bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* REVIEWS */}
      {activeTab === "reviews" && (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-8 bg-zinc-50 dark:bg-[#111] border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
              Community Feedback
            </h3>
            <span className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              {reviewsData?.totalReviews || 0} Reviews
            </span>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {reviewsData?.reviews?.map((rev) => (
              <div
                key={rev._id}
                className="p-8 flex flex-col md:flex-row justify-between items-start gap-6 hover:bg-zinc-50 dark:hover:bg-[#111]/50 transition-colors"
              >
                <div className="flex gap-6 w-full">
                  <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-black text-zinc-900 dark:text-white shrink-0">
                    {rev.user?.avatar ? (
                      <img
                        src={getImageUrl(rev.user.avatar)}
                        className="h-full w-full rounded-full object-cover grayscale"
                      />
                    ) : (
                      rev.user?.name?.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                        {rev.user?.name}
                      </p>
                      <StarRating rating={rev.rating} size="small" />
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                      "{rev.comment}"
                    </p>
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {rev.images.map((img, idx) => {
                          const safePath =
                            typeof img === "string" ? img : img?.url || "";
                          if (!safePath) return null;
                          return (
                            <div
                              key={idx}
                              className="relative group w-20 h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                            >
                              <img
                                src={getImageUrl(safePath)}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 cursor-zoom-in"
                                onClick={() =>
                                  window.open(getImageUrl(safePath), "_blank")
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-[9px] text-zinc-400 mt-4 font-bold uppercase tracking-widest">
                      {new Date(rev.createdAt).toDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReview(rev._id)}
                  className="text-rose-500 font-black text-[9px] border border-rose-500/20 bg-rose-500/5 px-5 py-2.5 rounded-full hover:bg-rose-600 hover:text-white transition-all uppercase tracking-widest shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
            {reviewsData?.reviews?.length === 0 && (
              <p className="p-24 text-center text-zinc-400 font-black text-sm uppercase tracking-[0.3em]">
                No Data Found
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-zinc-50 dark:bg-[#111]">
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">
                {modal.title}
              </h3>
              <button
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-transform hover:rotate-90"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-10">
              {modal.type === "image" ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-[2rem] p-10 text-center hover:border-zinc-900 dark:hover:border-white transition-all bg-zinc-50 dark:bg-[#111]">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="modalFile"
                    />
                    <label htmlFor="modalFile" className="cursor-pointer block">
                      <span className="text-4xl block mb-4 grayscale opacity-50">
                        🖼️
                      </span>
                      <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest bg-white dark:bg-[#0a0a0a] px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        Select Files
                      </span>
                    </label>
                  </div>
                </div>
              ) : modal.field === "description" ? (
                <textarea
                  name="inputVal"
                  defaultValue={modal.value}
                  required
                  rows="5"
                  className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 text-zinc-900 dark:text-zinc-100 font-medium outline-none focus:border-zinc-900 dark:focus:border-white transition-all resize-none"
                />
              ) : (
                <input
                  name="inputVal"
                  type={
                    ["price", "discount", "stock", "bulkStock"].includes(
                      modal.field || modal.type,
                    )
                      ? "number"
                      : "text"
                  }
                  defaultValue={modal.value}
                  required
                  autoFocus
                  className="w-full bg-zinc-50 dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 text-3xl font-black text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-center"
                />
              )}
              <div className="flex gap-4 mt-10">
                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {updateMutation.isLoading ? "Syncing..." : "Save Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

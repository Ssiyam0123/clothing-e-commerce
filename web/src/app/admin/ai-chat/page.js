"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Database,
  ArrowUpRight,
  Info,
  Ticket,
  Zap,
  Users,
  User,
  BookOpen,
  Search,
  ShoppingCart,
  Cpu,
  RefreshCw,
  Terminal,
  Activity,
  ArrowLeft,
  Package,
  Menu,
  X
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminAiChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "System Initialized. I am your Command AI assistant. I have direct telemetry access to your MongoDB catalog, orders, and promo engines. How can I assist you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("chat"); // chat or commands
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const inputContainerRef = useRef(null);

  const suggestionChips = [
    { label: "📊 Store Summary", prompt: "Give me the store business summary and dashboard metrics" },
    { label: "🛒 Recent Orders", prompt: "Show me the last 5 recent orders in the store" },
    { label: "🔍 Search Products", prompt: "Search products for 'Shirt' in the catalog" },
    { label: "💡 Stock Alerts", prompt: "Check for any critical or low stock inventory alerts" },
    { label: "🎟️ Create Coupon", prompt: "Create a 15% discount coupon 'FLASH15' with 100 usage limits valid for 30 days" },
  ];

  const quickCommands = [
    { cmd: "Dashboard Summary", desc: "View total revenue, orders, and stock warnings", prompt: "Give me the store business summary" },
    { cmd: "Recent Sales List", desc: "List recent orders with status", prompt: "Show me the last 5 recent orders" },
    { cmd: "Low Stock Alert", desc: "Check if any items are running low", prompt: "Check for any critical or low stock inventory alerts" },
    { cmd: "Active Coupons List", desc: "Check current store promotions", prompt: "List active coupons in the store" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Mobile keyboard avoidance using visualViewport API
  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      const offset = window.innerHeight - vv.height;
      setKeyboardOffset(offset > 50 ? offset : 0);
      // Scroll to bottom when keyboard opens
      if (offset > 50) {
        setTimeout(() => scrollToBottom(), 100);
      }
    };

    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);
    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    if (!textToSend) setInputValue("");
    setError(null);
    setLoading(true);

    const userMessage = { role: "user", content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await api.post("/admin/ai-chat", {
        messages: updatedMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      if (response.data && response.data.success) {
        setMessages(prev => [
          ...prev,
          {
            role: "model",
            content: response.data.reply,
            toolExecutions: response.data.toolExecutions || []
          }
        ]);
      } else {
        throw new Error(response.data?.message || "Failed to get reply from AI");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "AI connection failure. Please confirm your GEMINI_API_KEY is configured in your Settings or environment variables.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderToolWidgets = (executions) => {
    if (!executions || executions.length === 0) return null;

    return (
      <div className="mt-4 space-y-3.5 w-full">
        {executions.map((exec, idx) => {
          if (exec.status !== "completed" || !exec.result) return null;
          const { name, result } = exec;

          // Widget 1: searchProducts
          if (name === "searchProducts" && result.success) {
            return (
              <div key={idx} className="border border-primary/20 bg-primary/5 rounded-xl p-4 shadow-inner w-full overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <span className="flex items-center gap-1.5"><Search size={14} /> Catalog Query Results</span>
                  <span className="bg-primary/20 px-2 py-0.5 rounded text-[10px]">{result.count} Match</span>
                </div>
                {result.products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-primary/10 text-muted-foreground">
                          <th className="py-2 pr-2 font-medium">Product</th>
                          <th className="py-2 px-2 font-medium">Price</th>
                          <th className="py-2 px-2 font-medium">Category</th>
                          <th className="py-2 px-2 font-medium">Status</th>
                          <th className="py-2 pl-2 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.products.map((prod) => (
                          <tr key={prod.id} className="border-b border-primary/5 hover:bg-primary/10 transition-colors">
                            <td className="py-2.5 pr-2 font-semibold text-foreground">{prod.name}</td>
                            <td className="py-2.5 px-2 font-mono text-foreground font-semibold">${prod.price}</td>
                            <td className="py-2.5 px-2 text-muted-foreground">{prod.category}</td>
                            <td className="py-2.5 px-2">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${prod.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                                {prod.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-2.5 pl-2 text-right">
                              <button
                                onClick={() => setInputValue(`Update stock of product ID ${prod.id} for size M to 25`)}
                                className="text-primary hover:opacity-80 hover:underline text-[10px] font-semibold"
                              >
                                Edit Stock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No matching products found.</p>
                )}
              </div>
            );
          }

          // Widget 2: updateProductStock / updateOrderStatus / createCoupon / toggleFlashSale / toggleUserStatus / updateProductSeo / createBlogDraft
          const successWidgets = {
            updateProductStock: { label: "Stock Updated", icon: <Package size={16} className="text-emerald-500" />, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400" },
            updateOrderStatus: { label: "Order Status Sync", icon: <ShoppingCart size={16} className="text-emerald-500" />, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400" },
            createCoupon: { label: "Coupon Issued", icon: <Ticket size={16} className="text-emerald-500" />, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400" },
            toggleFlashSale: { label: "Flash Sale Promo", icon: <Zap size={16} className="text-purple-500" />, color: "border-purple-500/20 bg-purple-500/5 text-purple-800 dark:text-purple-400" },
            toggleUserStatus: { label: "User Access Change", icon: <User size={16} className="text-amber-500" />, color: "border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-400" },
            updateProductSeo: { label: "SEO Metadata Live", icon: <Sparkles size={16} className="text-purple-500" />, color: "border-purple-500/20 bg-purple-500/5 text-purple-800 dark:text-purple-400" },
            createBlogDraft: { label: "Blog Drafted", icon: <BookOpen size={16} className="text-emerald-500" />, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400" },
            createProduct: { label: "Product Created", icon: <CheckCircle2 size={16} className="text-emerald-500" />, color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400" },
          };

          if (successWidgets[name]) {
            const config = successWidgets[name];
            return (
              <div key={idx} className={`border rounded-xl p-3 flex items-start gap-2.5 shadow-sm text-xs backdrop-blur-sm ${result.success ? config.color : "border-destructive/20 bg-destructive/10 text-destructive"}`}>
                {result.success ? (
                  <>
                    <div className="mt-0.5 shrink-0">{config.icon}</div>
                    <div>
                      <p className="font-bold tracking-wide uppercase text-[10px] text-muted-foreground">{config.label}</p>
                      <p className="mt-0.5 font-medium">{result.message}</p>
                      {result.productId && <p className="text-[9px] font-mono text-muted-foreground mt-1">ID: {result.productId}</p>}
                      {result.blogId && <p className="text-[9px] font-mono text-muted-foreground mt-1">ID: {result.blogId}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold tracking-wide uppercase text-[10px] text-destructive">Execution Failed</p>
                      <p className="mt-0.5 font-medium text-muted-foreground">{result.error}</p>
                    </div>
                  </>
                )}
              </div>
            );
          }

          // Widget 3: getDashboardSummary
          if (name === "getDashboardSummary" && result.success) {
            return (
              <div key={idx} className="border border-indigo-500/20 bg-indigo-500/5 rounded-xl p-4 shadow-sm w-full backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                  <Database size={14} />
                  <span>Real-time Telemetry Metrics</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="bg-background border border-border p-2.5 rounded-lg text-center shadow-sm">
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Total Revenue</p>
                    <p className="text-base font-bold text-indigo-500 dark:text-indigo-400 font-mono mt-0.5">${result.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-background border border-border p-2.5 rounded-lg text-center shadow-sm">
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Total Orders</p>
                    <p className="text-base font-bold text-foreground font-mono mt-0.5">{result.ordersCount}</p>
                  </div>
                  <div className="bg-background border border-border p-2.5 rounded-lg text-center shadow-sm">
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Products Catalog</p>
                    <p className="text-base font-bold text-foreground font-mono mt-0.5">{result.productsCount}</p>
                  </div>
                  <div className="bg-background border border-border p-2.5 rounded-lg text-center shadow-sm">
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold">Stock Alerts</p>
                    <p className={`text-base font-bold font-mono mt-0.5 ${result.criticalStockCount > 0 ? "text-amber-500 animate-pulse" : "text-emerald-500"}`}>{result.criticalStockCount}</p>
                  </div>
                </div>

                {result.criticalItems && result.criticalItems.length > 0 && (
                  <div className="mt-2.5">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-amber-500 mb-1.5 flex items-center gap-1">
                      <AlertCircle size={12} /> Low Stock Warnings:
                    </p>
                    <div className="text-[11px] space-y-1 bg-background/50 p-2.5 rounded border border-border">
                      {result.criticalItems.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-muted-foreground">{item.name}</span>
                          <span className="font-bold text-amber-500">{item.stock} in stock</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // Widget 4: getRecentOrders
          if (name === "getRecentOrders" && result.success) {
            return (
              <div key={idx} className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-4 shadow-sm w-full backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                  <ShoppingCart size={14} />
                  <span>Recent Sales Transactions</span>
                </div>
                {result.orders.length > 0 ? (
                  <div className="space-y-2">
                    {result.orders.map((ord) => (
                      <div key={ord.id} className="bg-background border border-border p-3 rounded-lg flex items-center justify-between text-xs hover:border-blue-500/30 transition-all">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">{ord.customer}</span>
                            <span className="text-[9px] text-muted-foreground font-mono bg-muted px-1.5 py-0.25 rounded">#{ord.id.slice(-6)}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-blue-500 dark:text-blue-400 font-mono text-xs">${ord.totalPrice}</p>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase border ${
                            ord.orderStatus === "Completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                            ord.orderStatus === "Processing" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                            "bg-muted text-muted-foreground border-border"
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No recent orders recorded.</p>
                )}
              </div>
            );
          }

          // Widget 5: searchCustomer
          if (name === "searchCustomer" && result.success) {
            return (
              <div key={idx} className="border border-teal-500/20 bg-teal-500/5 rounded-xl p-4 shadow-sm w-full backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-teal-500 dark:text-teal-400">
                  <Users size={14} />
                  <span>Found {result.count} Customers</span>
                </div>
                {result.users.length > 0 ? (
                  <div className="space-y-2">
                    {result.users.map((cust) => (
                      <div key={cust._id} className="bg-background border border-border p-3 rounded-lg flex items-center justify-between text-xs hover:border-teal-500/30 transition-all">
                        <div>
                          <p className="font-semibold text-foreground">{cust.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{cust.email}</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase ${
                            cust.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}>
                            {cust.isActive ? "Active" : "Blocked"}
                          </span>
                          <button
                            onClick={() => setInputValue(`Toggle customer account status for user ID ${cust._id}`)}
                            className="text-[9px] px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground transition-all font-semibold"
                          >
                            Toggle Ban
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No matching customers found.</p>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row border border-border bg-background shadow-2xl overflow-hidden relative text-foreground transition-colors duration-500" style={{ height: "100dvh" }}>
      
      {/* Dynamic glow backdrops */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/5 to-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main chat viewport */}
      <div className={`flex-1 flex-col border-r border-border/80 min-h-0 ${showSidebarMobile ? "hidden lg:flex" : "flex"}`} style={{ height: "100%" }}>
        
        {/* Console Header */}
        <div className="px-4 py-3 border-b border-border/80 bg-card/60 backdrop-blur-xl flex items-center justify-between z-20 shrink-0 sticky top-0">
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5 leading-none">
                Command AI
                <span className="hidden sm:inline-flex text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Terminal
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping shrink-0" />
              Live
            </div>
            
            {/* Mobile Sidebar Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold border-primary/20 hover:bg-muted h-7"
              onClick={() => setShowSidebarMobile(!showSidebarMobile)}
            >
              {showSidebarMobile ? (
                <>
                  <X size={12} /> Close
                </>
              ) : (
                <>
                  <Terminal size={12} /> Console
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 z-10 scrollbar-thin min-h-0">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Avatar */}
                  {msg.role === "user" ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-zinc-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                      <User size={14} />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md shadow-violet-500/10">
                      <Sparkles size={14} className="text-white animate-pulse" />
                    </div>
                  )}

                  {/* Message card */}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-md border leading-relaxed text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground border-primary/30 rounded-tr-none"
                        : "bg-card/90 backdrop-blur-md text-foreground border-border rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === "model" && msg.toolExecutions && renderToolWidgets(msg.toolExecutions)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[80%] items-start">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 text-primary shrink-0">
                  <Loader2 size={14} className="animate-spin" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-none p-4 shadow-sm backdrop-blur-md flex items-center gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-primary font-semibold flex items-center gap-1.5 animate-pulse">
                      <RefreshCw size={12} className="animate-spin" /> Resolving Agentic Telemetry...
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="p-4 border border-destructive/20 bg-destructive/10 text-destructive rounded-xl flex items-start gap-3 text-xs max-w-xl mx-auto">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Session Notice</p>
                <p className="text-muted-foreground mt-0.5">{error}</p>
                <button
                  onClick={() => {
                    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
                    if (lastUserMsg) {
                      setError(null);
                      handleSendMessage(lastUserMsg.content);
                    }
                  }}
                  className="mt-2 px-3 py-1.5 text-[11px] font-semibold rounded-lg bg-destructive/15 hover:bg-destructive/25 text-destructive border border-destructive/20 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw size={11} /> Retry
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && !loading && (
          <div className="px-4 sm:px-6 py-3 flex flex-nowrap overflow-x-auto gap-2.5 z-10 border-t border-border bg-muted/10 backdrop-blur-md scrollbar-none">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                className="text-[11px] px-4 py-2.5 rounded-full border border-border hover:border-primary/40 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
              >
                {chip.label}
                <ArrowUpRight size={11} className="opacity-50" />
              </button>
            ))}
          </div>
        )}

        {/* User Input Bar */}
        <div
          ref={inputContainerRef}
          className="p-3 sm:p-5 border-t border-border bg-card/85 backdrop-blur-xl z-20 shrink-0 sticky bottom-0 transition-all"
          style={{
            paddingBottom: keyboardOffset > 0
              ? `calc(${keyboardOffset}px + env(safe-area-inset-bottom, 8px))`
              : `max(12px, env(safe-area-inset-bottom, 8px))`
          }}
        >
          <div className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3 bg-background border border-border rounded-2xl p-2 sm:p-2.5 focus-within:ring-1 focus-within:ring-primary/45 transition-all shadow-sm">
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask AI to query products, list orders, create discounts..."
              className="flex-1 bg-transparent border-0 resize-none max-h-24 py-1.5 px-2 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground transition-all"
              style={{ fontSize: "16px" }}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputValue.trim()}
              size="icon"
              className="h-9 w-9 rounded-xl bg-primary hover:opacity-95 shadow-md text-primary-foreground shrink-0 flex items-center justify-center"
            >
              <Send size={14} />
            </Button>
          </div>
      </div>
      </div>

      {/* Telemetry Control Panel Sidebar */}
      <div className={`w-full lg:w-72 bg-card/45 backdrop-blur-2xl p-5 flex-col border-t lg:border-t-0 border-border ${showSidebarMobile ? "flex" : "hidden lg:flex"}`} style={{ height: showSidebarMobile ? "100%" : undefined }}>

        {/* Mobile Back Button */}
        {showSidebarMobile && (
          <button
            onClick={() => setShowSidebarMobile(false)}
            className="lg:hidden flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4 py-2 px-3 rounded-lg bg-muted/50 hover:bg-muted border border-border transition-all w-fit"
          >
            <ArrowLeft size={14} />
            Back to Chat
          </button>
        )}
        
        {/* Tabs */}
        <div className="flex border border-border rounded-lg p-1 bg-background text-xs gap-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-all text-center ${
              activeTab === "chat" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-all text-center ${
              activeTab === "tools" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AI Tools
          </button>
          <button
            onClick={() => setActiveTab("commands")}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-all text-center ${
              activeTab === "commands" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Shortcuts
          </button>
        </div>

        {activeTab === "chat" ? (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Status indicators */}
            <div className="border border-border rounded-xl p-4 bg-background/50 space-y-3.5 shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><Activity size={12} /> System Telemetry</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Mongoose Agent</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold"><span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" /> Linked</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Redis Session</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold"><span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" /> Running</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Gemini LLM Core</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold"><span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" /> Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="border border-border rounded-xl p-4 bg-background/50 flex-1 flex flex-col shadow-sm overflow-hidden">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-2.5"><Terminal size={12} /> System Details</h3>
              <div className="text-[11px] font-mono text-muted-foreground space-y-1.5 overflow-y-auto flex-1 scrollbar-thin">
                <p className="text-primary font-bold"># auth token status verified</p>
                <p># database: clothing-ecommerce</p>
                <p># schema: mongoose-prod-v9</p>
                <p># model: gemini-2.5-flash</p>
                <p># function tools registered: 13</p>
                <p className="text-emerald-600 dark:text-emerald-400"># ready for instructions</p>
              </div>
            </div>
          </div>
        ) : activeTab === "tools" ? (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"><Cpu size={12} /> Registered Tools</h3>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {[
                { name: "searchProducts", desc: "Search products in catalog" },
                { name: "updateProductStock", desc: "Update product stock levels" },
                { name: "getDashboardSummary", desc: "Retrieve dashboard business metrics" },
                { name: "getRecentOrders", desc: "List recent sales transactions" },
                { name: "createProduct", desc: "Create new product in catalog" },
                { name: "updateProductSeo", desc: "Save optimized SEO metadata" },
                { name: "updateOrderStatus", desc: "Update order delivery status" },
                { name: "createCoupon", desc: "Create discount coupon code" },
                { name: "listCoupons", desc: "List active discount coupons" },
                { name: "toggleFlashSale", desc: "Add/remove item from flash sale" },
                { name: "searchCustomer", desc: "Search customer profiles" },
                { name: "toggleUserStatus", desc: "Block or activate customer" },
                { name: "createBlogDraft", desc: "Draft marketing blog post" }
              ].map((tool, idx) => (
                <div key={idx} className="p-2.5 border border-border bg-background/50 rounded-lg hover:border-primary/20 transition-all flex flex-col gap-0.5">
                  <span className="text-[11px] font-mono font-bold text-primary">{tool.name}()</span>
                  <span className="text-[10px] text-muted-foreground leading-snug">{tool.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-3 overflow-hidden">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 mb-1"><Terminal size={12} /> Command Shortcuts</h3>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
              {quickCommands.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="w-full text-left p-3 border border-border bg-background hover:bg-muted rounded-xl transition-all group flex flex-col gap-1 shadow-sm"
                >
                  <span className="text-xs font-bold text-foreground group-hover:text-primary flex items-center justify-between">
                    {item.cmd}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-snug">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer credits */}
        <div className="text-[10px] text-muted-foreground font-mono text-center border-t border-border pt-4 mt-auto">
          Command Engine v1.0.4
        </div>
      </div>
    </div>
  );
}

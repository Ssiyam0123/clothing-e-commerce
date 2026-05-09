"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Maximize2, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Layout, 
  Save, 
  RefreshCcw,
  Zap,
  ShoppingBag,
  Grid,
  LayoutGrid,
  Tag,
  ArrowRight,
  Type,
  Sparkles,
  Percent,
  Star,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { swalToast, swalError } from "@/utils/swal";
import api from "@/lib/api";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";

/**
 * 🏗️ Architect Sortable Section Item
 */
function SortableSection({ section, onToggleVisibility, onRemove, onUpdateConfig, categories = [], campaigns = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0
  };

  const getIcon = (type) => {
    switch (type) {
      case 'USP': return <Zap size={18} />;
      case 'FLASH_SALE': return <ShoppingBag size={18} />;
      case 'CATEGORY_GRID': return <Grid size={18} />;
      case 'FEATURED_PRODUCTS': return <LayoutGrid size={18} />;
      case 'NEW_ARRIVALS': return <Tag size={18} />;
      case 'SALE_PRODUCTS': return <Tag size={18} />;
      case 'FEATURED_CATEGORY_SECTION': return <Layout size={18} />;
      case 'PROMO_BANNER': return <Maximize2 size={18} />;
      case 'HEADER': return <Type size={18} />;
      default: return <Layout size={18} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-card border border-border/50 rounded-[2.5rem] transition-all duration-300",
        isDragging ? "shadow-2xl border-primary/40 bg-accent/5" : "hover:border-primary/20",
        !section.isVisible && "opacity-50 grayscale-[50%]"
      )}
    >
      <div className="flex items-center gap-4 p-4">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-muted-foreground hover:text-foreground">
          <GripVertical size={20} />
        </div>

        <div className={cn("p-3 rounded-xl", section.isVisible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
          {getIcon(section.type)}
        </div>

        <div className="flex-1">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            {section.title || section.type.replace(/_/g, ' ')}
            {(section.config?.categoryName || section.config?.campaignName || section.config?.saleName) && (
              <Badge variant="outline" className="text-[8px] font-bold h-4 bg-muted/50">
                {section.config.categoryName || section.config.campaignName || section.config.saleName}
              </Badge>
            )}
          </h4>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
            {section.subtitle || "Default Header Logic"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)} className={cn("h-10 w-10 rounded-xl", isEditing && "bg-primary text-primary-foreground")}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onToggleVisibility(section.id)} className={cn("h-10 w-10 rounded-xl", section.isVisible ? "text-primary" : "text-muted-foreground")}>
            {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onRemove(section.id)} className="h-10 w-10 rounded-xl hover:text-destructive transition-all opacity-0 group-hover:opacity-100">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {isEditing && (
        <div className="p-6 border-t border-border/50 bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Display Protocol</h5>
              {section.type === 'HEADER' ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Main Heading</label>
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => onUpdateConfig(section.id, { title: e.target.value }, true)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-[11px] font-bold focus:border-primary/40 outline-none"
                      placeholder="Enter Main Title"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subtitle / Caption</label>
                    <input
                      type="text"
                      value={section.subtitle || ''}
                      onChange={(e) => onUpdateConfig(section.id, { subtitle: e.target.value }, true)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-[11px] font-bold focus:border-primary/40 outline-none"
                      placeholder="Enter Subtitle"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-2">
                   <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Typography is managed via</p>
                   <Badge variant="outline" className="text-[8px] font-black bg-primary/10 text-primary border-primary/20">HEADER BLOCK</Badge>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Module Logic</h5>
              {['PROMO_BANNER'].includes(section.type) ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manual Image Override</label>
                    <input
                      type="text"
                      value={section.imageUrl || ''}
                      onChange={(e) => onUpdateConfig(section.id, { imageUrl: e.target.value }, true)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-[11px] font-bold focus:border-primary/40 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action Link</label>
                    <input
                      type="text"
                      value={section.actionLink || ''}
                      onChange={(e) => onUpdateConfig(section.id, { actionLink: e.target.value }, true)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-[11px] font-bold focus:border-primary/40 outline-none"
                      placeholder="/category/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Button Text (Optional)</label>
                    <input
                      type="text"
                      value={section.buttonText || ''}
                      onChange={(e) => onUpdateConfig(section.id, { buttonText: e.target.value }, true)}
                      className="w-full bg-background border border-border/50 rounded-xl px-4 py-2 text-[11px] font-bold focus:border-primary/40 outline-none"
                      placeholder="Shop Now, Explore, etc."
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-primary leading-relaxed">
                    This module is managed via the global state. Change its parameters via the sidebar picker.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_LAYOUT = [
  { id: 'banner-default', type: 'PROMO_BANNER', isVisible: true, title: '', subtitle: '', imageUrl: '', actionLink: '', config: {} },
  { id: 'grid-default', type: 'CATEGORY_GRID', isVisible: true, title: '', subtitle: '', imageUrl: '', actionLink: '', config: {} },
  { id: 'new-arrivals', type: 'NEW_ARRIVALS', isVisible: true, title: '', subtitle: '', imageUrl: '', actionLink: '', config: {} },
];

export default function LayoutBuilderPage() {
  const queryClient = useQueryClient();
  const { categories } = useAdminCategories();
  const [layout, setLayout] = useState([]);

  const { data: remoteLayout, isLoading: isLayoutLoading } = useQuery({
    queryKey: ['homeLayout'],
    queryFn: async () => {
      const { data } = await api.get('/home-layouts/active');
      return data?.sections || DEFAULT_LAYOUT;
    }
  });

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/banner-campaigns');
      return data;
    }
  });

  const { data: flashSales = [] } = useQuery({
    queryKey: ['admin-flash-sales'],
    queryFn: async () => {
      const { data } = await api.get('/admin/flash-sales');
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (sections) => await api.put('/home-layouts', { sections }),
    onSuccess: () => {
      queryClient.invalidateQueries(['homeLayout']);
      swalToast("Blueprint Committed", "success");
    },
    onError: () => swalError("Sync Failure", "Could not persist blueprint.")
  });

  useEffect(() => {
    if (remoteLayout) setLayout(remoteLayout);
  }, [remoteLayout]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLayout((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleVisibility = useCallback((id) => {
    setLayout(prev => prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item));
  }, []);

  const removeSection = useCallback((id) => {
    setLayout(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateSectionConfig = useCallback((id, newConfig, isRoot = false) => {
    setLayout(prev => prev.map(item => {
      if (item.id === id) {
        if (isRoot) return { ...item, ...newConfig };
        return { ...item, config: { ...item.config, ...newConfig } };
      }
      return item;
    }));
  }, []);

  const addNewSection = (type, config = {}) => {
    const newId = `${type.toLowerCase()}-${Date.now()}`;
    const newSection = {
      id: newId,
      type: type,
      title: config.title || "",
      subtitle: config.subtitle || "",
      imageUrl: config.imageUrl || "",
      actionLink: config.actionLink || "",
      isVisible: true,
      config: config
    };
    setLayout(prev => [...prev, newSection]);
    swalToast(`${type.replace(/_/g, ' ')} Added`, "success");
  };

  const resetLayout = () => {
    if (remoteLayout) {
      setLayout(remoteLayout);
      swalToast("Blueprint Reverted", "info");
    }
  };

  if (isLayoutLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-section-header">
        <div>
          <h1 className="admin-title">Architect</h1>
          <p className="admin-subtitle">Blueprint Engine & Sequencer</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetLayout} className="rounded-full h-12 px-6 font-black text-[10px] uppercase tracking-widest border-border transition-all">
            <RefreshCcw size={14} className="mr-2" /> Reset
          </Button>
          <Button onClick={() => updateMutation.mutate(layout)} disabled={updateMutation.isPending} className="rounded-full h-12 px-10 font-black text-[10px] uppercase tracking-widest bg-foreground text-background hover:bg-primary transition-all">
            {updateMutation.isPending ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
            {updateMutation.isPending ? "Syncing..." : "Commit Blueprint"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-elevated border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <header className="mb-10 flex items-center justify-between border-b border-border/50 pb-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Structural Sequence</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Architectural flow of the storefront</p>
              </div>
              <Badge variant="outline" className="rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                {layout.length} Active Modules
              </Badge>
            </header>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={layout.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {layout.map((section) => (
                    <SortableSection key={section.id} section={section} onToggleVisibility={toggleVisibility} onRemove={removeSection} onUpdateConfig={updateSectionConfig} categories={categories} campaigns={campaigns} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-[2.5rem] p-8 shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground mb-8">Component Gallery</h4>
            <div className="grid grid-cols-1 gap-3">
              {[
                { type: 'HEADER', label: 'Typography Block', desc: 'Custom Title & Subtitle' },
                { type: 'CATEGORY_GRID', label: 'Category Matrix', desc: 'Curated groups' },
              ].map((comp) => (
                <button key={comp.type} onClick={() => addNewSection(comp.type)} className="group flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Plus size={16} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black uppercase tracking-widest text-foreground">{comp.label}</h5>
                    <p className="text-[8px] font-bold text-muted-foreground">{comp.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-8 mt-8 border-t border-border/50">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">System Blocks</h4>
              <div className="grid grid-cols-1 gap-2">
                {/* Global Collections */}
                {[
                  { id: 'NEW_ARRIVALS', name: 'New Arrivals', icon: <Sparkles size={12} /> },
                  { id: 'FEATURED_PRODUCTS', name: 'Featured Products', icon: <Star size={12} /> }
                ].map((item) => (
                  <button key={item.id} onClick={() => addNewSection(item.id)} className="flex items-center gap-3 p-2 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all group">
                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-primary ml-1">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase truncate flex-1">{item.name}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity mr-2" />
                  </button>
                ))}

                {/* Database Categories */}
                {categories.map((cat) => (
                  <button 
                    key={cat._id} 
                    onClick={() => addNewSection('CATEGORY_COLLECTION', { categoryId: cat._id, slug: cat.slug, title: cat.name })} 
                    className="flex items-center gap-3 p-2 rounded-xl border border-border/50 bg-background hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-5 h-5 rounded-md bg-muted flex items-center justify-center text-muted-foreground ml-1">
                      <LayoutGrid size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase truncate">{cat.name}</p>
                      <p className="text-[6px] font-bold uppercase text-primary/40 tracking-tighter">Infrastructure Node</p>
                    </div>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity mr-2" />
                  </button>
                ))}
              </div>
            </div>


            <div className="pt-8 mt-8 border-t border-border/50">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Quick-Deploy Flash Sales</h4>
              <div className="grid grid-cols-1 gap-3">
                {flashSales.length > 0 ? (
                  flashSales.map((sale) => (
                    <button key={sale._id} onClick={() => addNewSection('FLASH_SALE', { saleId: sale._id, saleName: sale.name, title: sale.name })} className="flex items-center gap-4 p-3 rounded-2xl border border-border/50 bg-background hover:bg-primary/5 transition-all text-left">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                        <ShoppingBag size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase truncate">{sale.name}</p>
                        <p className="text-[7px] font-bold uppercase text-rose-500 tracking-widest opacity-70">Deploy Sale</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 bg-muted/20 rounded-2xl border border-dashed border-border text-center">
                    <p className="text-[8px] font-bold uppercase text-muted-foreground">No active campaigns found in protocol</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-border/50">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Quick-Deploy Campaigns</h4>
              <div className="grid grid-cols-1 gap-3">
                {campaigns.map((camp) => (
                  <button key={camp._id} onClick={() => addNewSection('PROMO_BANNER', { campaignId: camp._id, campaignName: camp.name, title: camp.name, imageUrl: camp.slides?.[0]?.image || camp.imageUrl || "" })} className="flex items-center gap-4 p-3 rounded-2xl border border-border/50 bg-background hover:bg-primary/5 transition-all text-left">
                    <div className="w-14 h-10 rounded-xl overflow-hidden bg-muted border border-border/50">
                      {camp.slides?.[0]?.image ? <img src={camp.slides[0].image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary/10"><Plus size={12} className="text-primary/40" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase truncate">{camp.name}</p>
                      <p className="text-[7px] font-bold uppercase text-primary tracking-widest opacity-70">Deploy Banner</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

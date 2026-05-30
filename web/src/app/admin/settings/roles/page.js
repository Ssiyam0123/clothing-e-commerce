"use client";
 
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, createRole, updateRole, deleteRole } from "@/app/admin/settings/lib/settings";
import { useAuthStore } from "@/store/authStore";
import { 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Lock, 
  AlertCircle,
  ChevronRight,
  Info,
  ArrowLeft,
  Save,
  Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/utils/swal";
import { cn } from "@/lib/utils";

const RESOURCES = [
  "dashboard", "products", "categories", "orders", "users", "roles", 
  "coupons", "blogs", "settings", "banner-campaigns", "flash-sales", "chat", "ai-chat", "reports", "homeLayout"
];

const ACTIONS = ["view", "create", "update", "delete", "manage"];

const RESOURCE_LABELS = {
  "dashboard": "Dashboard",
  "products": "Products",
  "categories": "Categories",
  "orders": "Orders",
  "users": "Users",
  "roles": "Roles",
  "coupons": "Coupons",
  "blogs": "Blogs",
  "settings": "Settings",
  "banner-campaigns": "Banners",
  "flash-sales": "Flash Sales",
  "chat": "Live Chat",
  "ai-chat": "Manage with AI",
  "reports": "Reports",
  "homeLayout": "Layout Builder"
};

export default function RolesPage() {
  const queryClient = useQueryClient();
  const { checkSession } = useAuthStore();
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: []
  });

  // 🏛️ Fetch Roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // 🚀 Mutations
  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      checkSession(); // Refresh current user permissions
      notify.success("Role created successfully");
      setView("list");
    },
    onError: (err) => notify.error(err.response?.data?.message || "Failed to create role")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      checkSession(); // Refresh current user permissions
      notify.success("Role updated successfully");
      setView("list");
    },
    onError: (err) => notify.error(err.response?.data?.message || "Failed to update role")
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      notify.success("Role deleted successfully");
    },
    onError: (error) => notify.error(error.response?.data?.message || "Failed to delete role"),
  });

  const handleStartAdd = () => {
    setEditingRole(null);
    setFormData({
      name: "",
      description: "",
      permissions: []
    });
    setView("add");
  };

  const handleStartEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || []
    });
    setView("edit");
  };

  const handleTogglePermission = (permission) => {
    if (editingRole && !editingRole.isEditable && editingRole.isSystem) return;
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleToggleResourceAll = (resource) => {
    if (editingRole && !editingRole.isEditable && editingRole.isSystem) return;
    const resourcePermissions = ACTIONS.map(a => `${resource}:${a}`);
    const hasAll = resourcePermissions.every(p => formData.permissions.includes(p));

    setFormData(prev => {
      const otherPermissions = prev.permissions.filter(p => !p.startsWith(`${resource}:`));
      return {
        ...prev,
        permissions: hasAll ? otherPermissions : [...otherPermissions, ...resourcePermissions]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return notify.error("Role name is required");

    if (view === "edit" && editingRole) {
      updateMutation.mutate({ id: editingRole._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await notify.confirm(
      "Delete Role?",
      "This action will permanently delete this role and revoke all associated privileges."
    );
    
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (view === "list") {
    return (
      <div className="admin-page-container space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* 🚀 Header Section */}
        <div className="flex justify-end gap-6 mb-6">
          <Button 
            onClick={handleStartAdd}
            className="h-14 px-8 rounded-[1.5rem] bg-foreground text-background font-bold uppercase tracking-wider text-xs shadow-2xl hover:bg-primary hover:text-background transition-all group"
          >
            <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
            Create New Role
          </Button>
        </div>

        {/* 📊 Roles Table */}
        <div className="bg-card/40 backdrop-blur-2xl rounded-[2.5rem] border border-border/10 shadow-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border/5 hover:bg-transparent">
                <TableHead className="py-6 px-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Role</TableHead>
                <TableHead className="py-6 px-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Description</TableHead>
                <TableHead className="py-6 px-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Clearance</TableHead>
                <TableHead className="py-6 px-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">Operations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <TableRow key={i} className="border-border/5">
                    <TableCell className="p-8"><div className="h-6 w-32 bg-muted animate-pulse rounded-lg" /></TableCell>
                    <TableCell className="p-8"><div className="h-6 w-48 bg-muted animate-pulse rounded-lg" /></TableCell>
                    <TableCell className="p-8"><div className="h-6 w-24 bg-muted animate-pulse rounded-lg" /></TableCell>
                    <TableCell className="p-8 text-right"><div className="h-10 w-24 bg-muted animate-pulse rounded-xl ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : roles.map((role) => (
                <TableRow key={role._id} className="border-border/5 group hover:bg-accent/5 transition-colors">
                  <TableCell className="py-8 px-8">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black uppercase shadow-inner border border-border/10",
                        role.name === "superadmin" ? "bg-primary text-background" : "bg-accent/10 text-foreground"
                      )}>
                        {role.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black uppercase tracking-tight">{role.name}</span>
                          {role.isSystem && (
                            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 h-4 rounded-full">System</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">UID: {role._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-8 px-8 max-w-xs">
                    <span className="text-[11px] font-medium text-muted-foreground leading-relaxed italic line-clamp-2">
                      {role.description || "No tactical description provided."}
                    </span>
                  </TableCell>
                  <TableCell className="py-8 px-8">
                    <div className="flex flex-wrap gap-1.5">
                      {role.name === "superadmin" ? (
                        <Badge className="bg-rose-500/10 text-rose-500 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
                          Full Access
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-accent/30 text-foreground border-none text-[9px] font-bold px-2 py-0.5 rounded-lg">
                          {role.permissions.length} PERMISSIONS
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-8 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleStartEdit(role)}
                        className="w-10 h-10 rounded-xl hover:bg-primary/10 text-primary transition-all"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(role._id)}
                        disabled={role.isSystem}
                        className="w-10 h-10 rounded-xl hover:bg-destructive/10 text-destructive transition-all disabled:opacity-20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // 📝 Form View (Add/Edit)
  return (
    <div className="admin-page-container space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* 🛠️ Form Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => setView("list")}
            className="w-12 h-12 rounded-full hover:bg-accent/10 border border-border/10 animate-in fade-in"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">
              {view === "edit" ? "Edit Role" : "Create New Role"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {view === "edit" ? "Modify access permissions for this role" : "Setup a new administrative role"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => setView("list")}
            className="h-14 px-8 rounded-2xl font-bold text-xs uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createMutation.isLoading || updateMutation.isLoading}
            className="h-14 px-10 rounded-2xl bg-primary text-background font-bold text-xs uppercase tracking-wider shadow-2xl hover:scale-[1.02] transition-all"
          >
            <Save size={16} className="mr-2" />
            {view === "edit" ? "Save Changes" : "Create Role"}
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {/* 📝 Role Information (Top) */}
        <div className="bg-card/40 backdrop-blur-2xl rounded-[2.5rem] border border-border/10 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Role Name</label>
              <Input 
                placeholder="e.g. Manager"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={editingRole && !editingRole.isEditable}
                className="h-16 rounded-2xl bg-accent/5 border-border/10 px-6 font-bold tracking-tight text-lg"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Description</label>
              <textarea 
                placeholder="What is this role for?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full h-16 md:h-16 p-4 rounded-2xl bg-accent/5 border border-border/10 font-bold tracking-tight text-[14px] resize-none focus:ring-2 focus:ring-primary/20 outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 🛡️ Permission Matrix (Bottom) */}
        <div className="bg-card/40 backdrop-blur-2xl rounded-[2.5rem] border border-border/10 p-8 md:p-12">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Permissions Matrix</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Selected Permissions: <span className="text-primary font-bold">{formData.permissions.length}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {RESOURCES.map((resource) => {
              const resourcePermissions = ACTIONS.map(a => `${resource}:${a}`);
              const hasAll = resourcePermissions.every(p => formData.permissions.includes(p));
              const isLocked = editingRole && !editingRole.isEditable && editingRole.isSystem;

              return (
                <div key={resource} className={cn(
                  "p-6 rounded-[2rem] border transition-all duration-300",
                  hasAll ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5" : "bg-accent/5 border-border/10"
                )}>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">
                          {RESOURCE_LABELS[resource] || resource}
                        </h3>
                        {isLocked && <Lock size={12} className="text-muted-foreground/50" />}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleResourceAll(resource)}
                        disabled={isLocked}
                        className={cn(
                          "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full transition-all border",
                          hasAll 
                            ? "bg-primary text-background border-primary" 
                            : "bg-transparent text-muted-foreground border-border/10 hover:bg-accent/20"
                        )}
                      >
                        {hasAll ? "ALL_ON" : "ALL_OFF"}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {ACTIONS.map((action) => {
                        const perm = `${resource}:${action}`;
                        const isChecked = formData.permissions.includes(perm);
                        return (
                          <button
                            key={action}
                            type="button"
                            onClick={() => handleTogglePermission(perm)}
                            disabled={isLocked}
                            className={cn(
                              "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                              isChecked 
                                ? "bg-foreground text-background border-foreground shadow-lg" 
                                : "bg-background text-muted-foreground border-border/10 hover:border-primary/50"
                            )}
                          >
                            {action}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

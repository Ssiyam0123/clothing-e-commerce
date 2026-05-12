"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Calendar } from "lucide-react";

export function UsersTable({ users, isLoading }) {
  return (
    <Card className="bg-card rounded-[3rem] border border-border shadow-sm transition-all duration-500 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
          Recently Joined Users
        </CardTitle>
        <Link
          href="/admin/users"
          className="text-[9px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
        >
          Manage All →
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-muted/30 border border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground text-[10px] font-black uppercase tracking-widest italic opacity-50">
            No users found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-5 rounded-3xl bg-muted/30 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center font-black text-muted-foreground group-hover:text-primary transition-all overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-foreground flex items-center gap-2">
                      {user.name}
                    </h4>
                    <p className="text-[8px] font-bold text-muted-foreground tracking-widest flex items-center gap-1 opacity-70">
                      <Mail size={8} /> {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1 justify-end opacity-60">
                    <Calendar size={8} /> {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

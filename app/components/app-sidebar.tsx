import { IconDashboard, IconInnerShadowTop } from "@tabler/icons-react";
import { ListCheckIcon, MessageCircleDashed, UsersIcon } from "lucide-react";
import type * as React from "react";

import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "~/components/ui/sidebar";

const data = {
	user: {
		name: "Gabriel",
		email: "gabriel.stedile9@gmail.com",
		avatar: "/avatars/shadcn.svg",
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: IconDashboard,
		},
		{
			title: "Users",
			url: "/users",
			icon: UsersIcon,
		},
		{
			title: "Tasks",
			url: "/tasks",
			icon: ListCheckIcon,
		},
		{
			title: "Chats",
			url: "/chats",
			icon: MessageCircleDashed,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:[!p-1.5]"
						>
							<a href="/">
								<IconInnerShadowTop className="size-5" />
								<span className="text-base font-semibold">RocketSeat</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}

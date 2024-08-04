<script>
  import { logout } from "../stores/user";
  import { goto } from "$app/navigation";

  function handleLogout() {
    logout();
    goto("/");
  }
</script>

<nav class="bg-white border-gray-200 m-5 pl-24 pr-5">
  <div class="container mx-auto flex items-center justify-between">
    <!-- Logo -->
    <a href="../Dashboard">
      <div class="flex items-center space-x-4">
        <img src="/Logo.png" alt="Logo" class="h-10 w-10" />
        <span class="text-xl font-semibold text-slate-950">Blog Verse</span>
      </div>
    </a>
    <!-- Navigation Links -->
    <div class="flex items-center space-x-8">
      <a href="../Dashboard" class="text-slate-950 hover:text-blue-700"
        >Dashboard</a
      >
      <a href="../CreateBlog" class="text-slate-950 hover:text-blue-700"
        >Create Blog</a
      >
      <a href="../BrowseBlogs" class="text-slate-950 hover:text-blue-700"
        >Browse Blogs</a
      >
      <a href="../MyBlogs" class="text-slate-950 hover:text-blue-700"
        >My Blogs</a
      >
      <a
        href="../Profile"
        class="text-slate-950 hover:text-blue-700 flex items-center"
      >
        <img src="/profile.svg" alt="Profile" class="h-6 w-6 mr-2" />
      </a>
      <a
        href="../Settings"
        class="text-slate-950 hover:text-blue-700 flex items-center"
      >
        <img src="/settings.svg" alt="Settings" class="h-6 w-6 mr-2" />
      </a>
      <button
        on:click={handleLogout}
        class="text-slate-950 hover:text-blue-700 flex items-center"
      >
        <img src="/logout.svg" alt="Logout" class="h-6 w-6 mr-2" />
      </button>
    </div>
  </div>
</nav>

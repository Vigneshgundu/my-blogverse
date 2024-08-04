<script lang="ts">
  import { onMount } from "svelte";
  import custom_axios from "../../axios/AxiosSetup";
  import { goto } from "$app/navigation";

  type Blog = {
    id: string;
    title: string;
    content: string;
    price: number;
    category: string;
  };

  let recentBlogs: Blog[] = [];
  let filteredBlogs: Blog[] = [];
  let categories: string[] = []; // Define the type as string array
  const notifications = ["Notification 1", "Notification 2"];
  let selectedCategory: string | null = null;
  const limit = 3; // Define the number of recent blogs you want to display

  // Fetch recent blogs on component mount
  onMount(async () => {
    try {
      const response = await custom_axios.get("/api/blogs/");
      recentBlogs = response.data.slice(0, limit); // Limit the number of blogs on the frontend
      await getUniqueGenres(); // Fetch categories as well
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
    }
  });

  // Fetch blogs by genre
  async function fetchBlogsByGenre(genre: string) {
    try {
      const response = await custom_axios.get(`/api/blogs/search/genre`, {
        params: { genre },
      });
      filteredBlogs = response.data;
    } catch (error) {
      console.error(`Error fetching blogs by genre (${genre}):`, error);
      filteredBlogs = []; // Ensure filteredBlogs is always an array
    }
  }

  async function getUniqueGenres() {
    try {
      const response = await custom_axios.get("/api/blogs/search/unique-genre");
      categories = response.data; // Assume response.data is an array of genres
    } catch (error) {
      console.error("Error fetching unique genres:", error);
      categories = []; // Ensure categories is always an array
    }
  }

  function handleCategoryClick(category: string) {
    selectedCategory = category;
    fetchBlogsByGenre(category);
  }

  function handleBlogClick(blogId: string) {
    goto(`/BlogPage/${blogId}`);
  }

  function isBlogFree(blog: Blog): boolean {
    return blog.price === 0;
  }

  function getTruncatedContent(content: string): string {
    const words = content.split(" ");
    if (words.length > 30) {
      return words.slice(0, 30).join(" ") + "..."; // Truncate and add ellipsis
    }
    return content;
  }

  function shouldShowReadMore(content: string): boolean {
    return content.split(" ").length > 30;
  }
</script>

<div class="flex min-h-screen bg-gray-100">
  <!-- Sidebar -->
  <aside class="w-1/4 bg-gray-300 text-white p-6 shadow-lg hover:shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Categories</h2>
    <ul>
      {#each categories as category}
        <li class="mb-4">
          <button
            class="w-full px-3 py-2 bg-gray-500 rounded hover:bg-gray-600 text-left"
            on:click={() => handleCategoryClick(category)}
            type="button"
          >
            {category}
          </button>
        </li>
      {/each}
    </ul>

    <h2 class="text-2xl font-bold mt-10 mb-6 text-gray-700">Notifications</h2>
    <ul>
      {#each notifications as notification}
        <li class="mb-4">
          <div class="px-3 py-2 bg-gray-500 rounded">
            {notification}
          </div>
        </li>
      {/each}
    </ul>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 p-6">
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Recent Blogs -->
      <section class="bg-yellow-300 p-6 rounded-lg shadow-lg hover:shadow-xl">
        <h2 class="text-2xl font-bold mb-4 text-gray-800">Recent Blogs</h2>
        <ul>
          {#each recentBlogs as blog}
            <li
              class="mb-4 bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
              on:click={() => handleBlogClick(blog.id)}
            >
              <h3 class="text-lg font-semibold mb-2">{blog.title}</h3>
              <p class="text-gray-700 mb-2">
                {getTruncatedContent(blog.content)}
              </p>
              {#if shouldShowReadMore(blog.content)}
                <a
                  href="#"
                  class="text-blue-500 hover:underline"
                  on:click={() => handleBlogClick(blog.id)}
                >
                  Read More
                </a>
              {/if}
            </li>
          {/each}
        </ul>
      </section>

      <!-- Filtered Blogs by Genre -->
      {#if selectedCategory}
        <section class="bg-yellow-300 p-6 rounded-lg shadow-md hover:shadow-xl">
          <h2 class="text-xl font-bold mb-4">Blogs in {selectedCategory}</h2>
          {#if filteredBlogs.length === 0}
            <p>No blogs found in this category.</p>
          {:else}
            <ul>
              {#each filteredBlogs as blog}
                <li
                  class="mb-4 bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105"
                  on:click={() => handleBlogClick(blog.id)}
                >
                  <h3 class="text-lg font-semibold mb-2">{blog.title}</h3>
                  <p class="text-gray-700 mb-2">
                    {getTruncatedContent(blog.content)}
                  </p>
                  {#if shouldShowReadMore(blog.content)}
                    <a
                      href="#"
                      class="text-blue-500 hover:underline"
                      on:click={() => handleBlogClick(blog.id)}
                    >
                      Read More
                    </a>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        </section>
      {/if}
    </div>
  </main>
</div>

<style>
  /* Add any additional custom styles here */
  /* Example styles for enhancing visual appeal */
  button {
    transition:
      background-color 0.3s,
      color 0.3s;
  }
  button:hover {
    background-color: #434343;
  }
</style>

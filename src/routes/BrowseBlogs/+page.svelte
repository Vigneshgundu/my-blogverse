<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import custom_axios from "../../axios/AxiosSetup";

  type Blog = {
    id: string;
    title: string;
    price: number;
    genre: string;
  };

  let blogs: Blog[] = [];
  let searchQuery: string = "";
  let sortOption: string = "";
  let genreOption: string = "";
  let genres: string[] = []; // Array to store unique genres

  // Fetch all blogs on component mount
  async function fetchBlogs() {
    try {
      const response = await custom_axios.get("/api/blogs");
      blogs = response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  }

  // Fetch unique genres
  async function fetchGenres() {
    try {
      const response = await custom_axios.get("/api/blogs/search/unique-genre");
      genres = response.data; // Assume response.data is an array of genres
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }

  // Search blogs by title
  async function searchBlogs() {
    try {
      if (searchQuery.trim()) {
        const response = await custom_axios.get("/api/blogs/search/title", {
          params: { title: searchQuery },
        });
        blogs = response.data;
      } else {
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error searching blogs:", error);
    }
  }

  // Sort blogs by price
  async function sortBlogs() {
    try {
      if (sortOption) {
        const response = await custom_axios.get(
          "/api/blogs/search/price/sort",
          {
            params: { order: sortOption },
          }
        );
        blogs = response.data;
      } else {
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error sorting blogs:", error);
    }
  }

  // Filter blogs by genre
  async function filterBlogsByGenre() {
    try {
      if (genreOption) {
        const response = await custom_axios.get("/api/blogs/search/genre", {
          params: { genre: genreOption },
        });
        blogs = response.data;
      } else {
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error filtering blogs by genre:", error);
    }
  }

  // Handle blog click to navigate to the blog detail page
  function handleBlogClick(blogId: string) {
    goto(`/BlogPage/${blogId}`);
  }

  // Fetch blogs and genres initially
  onMount(() => {
    fetchBlogs();
    fetchGenres();
  });
</script>

<section id="browse-blogs" class="bg-gray-50 p-8">
  <div class="container mx-auto px-4 max-w-4xl">
    <div
      class="bg-yellow-300 p-6 shadow-lg mb-8 flex flex-col md:flex-row items-center rounded-lg hover:shadow-xl transition-shadow"
    >
      <h1 class="text-4xl font-bold mb-4 text-gray-800 text-center w-full">
        Explore Our Blogs
      </h1>
    </div>

    <div class="flex flex-col md:flex-row items-center mb-6 gap-4">
      <input
        type="text"
        placeholder="Search by title..."
        class="shadow-md appearance-none border rounded w-full md:w-2/5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        bind:value={searchQuery}
        on:input={searchBlogs}
      />
      <select
        class="shadow-md appearance-none border rounded w-full md:w-1/5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        bind:value={sortOption}
        on:change={sortBlogs}
      >
        <option value="">Sort by Price</option>
        <option value="asc">Price (Lowest to Highest)</option>
        <option value="desc">Price (Highest to Lowest)</option>
      </select>
      <select
        class="shadow-md appearance-none border rounded w-full md:w-1/5 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        bind:value={genreOption}
        on:change={filterBlogsByGenre}
      >
        <option value="">Filter by Genre</option>
        {#each genres as genre}
          <option value={genre}>{genre}</option>
        {/each}
      </select>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {#if blogs.length === 0}
        <p class="text-center col-span-full text-gray-500">No blogs found.</p>
      {/if}
      {#each blogs as blog}
        <div
          class="bg-white p-6 rounded-lg shadow-md mb-8 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
          on:click={() => handleBlogClick(blog.id)}
        >
          <h2 class="text-xl font-semibold mb-2 text-gray-800">
            {blog.title}
          </h2>
          {#if blog.price > 0}
            <p class="text-gray-700 mb-4">Requires payment to view</p>
          {/if}
          <p class="text-indigo-600 font-bold mb-2">Price: {blog.price} ETH</p>
          <p class="text-gray-600 mb-4">Genre: {blog.genre}</p>
          <p class="text-blue-500 font-semibold hover:underline">Read More</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* Add additional custom styles here */
  .container {
    max-width: 90%;
  }

  .hover\:shadow-xl:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .hover\:scale-105:hover {
    transform: scale(1.05);
  }

  .text-blue-500:hover {
    color: #2563eb;
  }
</style>

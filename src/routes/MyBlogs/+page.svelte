<script lang="ts">
  import { onMount } from "svelte";
  import { jwtDecode } from "jwt-decode";
  import custom_axios from "../../axios/AxiosSetup";

  interface UserInfo {
    userId: string;
    username: string;
    email: string;
    authorName: string;
  }

  interface Blog {
    id: string;
    title: string;
    content: string;
    price: number;
    isFree: boolean;
    genre: string;
    author: {
      username: string;
    };
  }

  let blogs: Blog[] = [];
  let userEmail: string | null = null;
  let errorMessage: string | null = null;

  onMount(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: UserInfo = jwtDecode(token);
        userEmail = decodedToken.email;

        if (userEmail) {
          const response = await custom_axios.get(
            `/api/blogs/search/user-email?userEmail=${encodeURIComponent(userEmail)}`
          );

          if (response.status === 200) {
            blogs = response.data;
          } else {
            errorMessage = "Failed to fetch blogs.";
            console.error("Failed to fetch blogs:", response.data);
          }
        }
      } catch (error) {
        errorMessage = "Error occurred while fetching user details or blogs.";
        console.error("Error:", error);
      }
    } else {
      errorMessage = "No token found.";
    }
  });
</script>

{#if errorMessage}
  <div class="bg-red-500 text-white p-4 rounded-lg shadow-md mb-4">
    {errorMessage}
  </div>
{/if}

{#if blogs.length === 0}
  <div class="bg-yellow-300 text-gray-800 p-4 rounded-lg shadow-md mb-4">
    No blogs found.
  </div>
{/if}

{#if blogs.length > 0}
  <div class="bg-gray-100 min-h-screen py-12">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-6 text-center">
        My Blogs
      </h1>
      <ul class="space-y-6">
        {#each blogs as blog}
          <li
            class="bg-gray shadow-lg rounded-lg p-6 border-4 border-yellow-300 hover:bg-gray-50 transition duration-300 ease-in-out"
          >
            <h2 class="text-2xl font-semibold text-gray-800">{blog.title}</h2>
            <p class="text-gray-700 mt-2">{blog.content}</p>
            <div class="mt-4">
              <p class="text-gray-500">
                Genre: <span class="font-medium text-gray-700"
                  >{blog.genre}</span
                >
              </p>
              <p class="text-gray-500">
                Price: <span class="font-medium text-gray-700"
                  >{blog.isFree ? "Free" : blog.price + " ETH"}</span
                >
              </p>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

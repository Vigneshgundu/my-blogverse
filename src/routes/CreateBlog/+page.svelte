<script lang="ts">
  import { onMount } from "svelte";
  import custom_axios from "../../axios/AxiosSetup";
  import { goto } from "$app/navigation";

  let title = "";
  let genre = "";
  let content = "";
  let price = 0;
  let selectedOption = "";
  let successMessage = "";
  let errorMessage = "";
  let walletAddress = "";
  let step = 1;

  function nextStep() {
    if (step < 4) step += 1;
  }

  async function fetchUserDetails() {
    try {
      const response = await custom_axios.get("/auth/details");
      console.log("User details:", response);
      walletAddress = response.data.user.walletAddress;
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    console.log("Form submitted");

    const blogData = {
      title,
      genre,
      content,
      price: selectedOption === "paid" ? price : 0,
      isFree: selectedOption === "free",
    };

    console.log("Blog Data:", blogData);

    try {
      const response = await custom_axios.post("/api/blogs", blogData);
      console.log("Response:", response);

      if (response.status === 201) {
        successMessage = "Blog created successfully!";
        title = "";
        genre = "";
        content = "";
        price = 0;
        selectedOption = "";
        goto("/MyBlogs");
      } else {
        errorMessage = "Failed to create blog.";
        console.error("Failed to create blog:", response.data);
      }
    } catch (error) {
      errorMessage = "Error occurred while creating the blog.";
      console.error("Error:", error);
    }
  }

  onMount(() => {
    fetchUserDetails();
  });
</script>

<div class="p-0 rounded-lg shadow-md my-2 hover:shadow-xl bg-slate-200">
  {#if walletAddress}
    {#if successMessage}
      <div class="bg-green-200 text-green-800 p-4 rounded mb-4">
        {successMessage}
      </div>
    {/if}

    {#if errorMessage}
      <div class="bg-red-500 text-white p-4 rounded mb-4">
        {errorMessage}
      </div>
    {/if}

    <form
      on:submit={handleSubmit}
      class="p-8 rounded-lg shadow-lg hover:shadow-xl"
    >
      <div class="bg-yellow-300 py-4 px-4 mx-auto max-w-screen-xl shadow-lg">
        <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">
          Create a New Blog
        </h1>

        <div class="mb-4">
          <label for="title" class="block text-gray-700 text-sm font-bold mb-2"
            >Title</label
          >
          <input
            type="text"
            id="title"
            name="title"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            bind:value={title}
            placeholder="Enter blog title"
            required
          />
        </div>

        <div class="mb-0">
          <label
            for="content"
            class="block text-gray-700 text-sm font-bold mb-2">Content</label
          >
          <textarea
            id="content"
            name="content"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-44"
            bind:value={content}
            placeholder="Enter blog content"
            required
          ></textarea>
        </div>

        <div class="p-4 mb-4 bg-gray-100 rounded-lg shadow-lg h-15">
          <div class="flex items-center mb-2">
            <label class="mr-8">
              <input
                type="radio"
                name="pricing"
                value="free"
                bind:group={selectedOption}
                class="mr-2"
                required
              />
              Free (with tip)
            </label>
            <label>
              <input
                type="radio"
                name="pricing"
                value="paid"
                bind:group={selectedOption}
                class="mr-2"
                required
              />
              Paid
            </label>
          </div>

          {#if selectedOption === "paid"}
            <div class="mt-8">
              <input
                type="number"
                id="price"
                name="price"
                class="shadow appearance-none border rounded w-full py-6 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                bind:value={price}
                placeholder="Enter price in ETH"
                required
              />
            </div>
          {/if}
        </div>

        <div class="mb-4">
          <label for="genre" class="block text-gray-700 text-sm font-bold mb-2"
            >Genre</label
          >
          <input
            type="text"
            id="genre"
            name="genre"
            class="shadow appearance-none border rounded mb-8 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            bind:value={genre}
            placeholder="Enter blog genre"
            required
          />
        </div>

        <div class="mb-4 items-center">
          <button
            type="submit"
            class=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </form>
  {/if}
  {#if !walletAddress}
    <div class="text-center text-gray-700 text-sm font-bold mb-2">
      <div class="container mx-auto mt-10 bg-gray-100 p-6 rounded-lg shadow-lg">
        <!-- Instruction -->
        <div class="text-center mb-6">
          <p class="text-lg font-semibold">
            Please connect your wallet to publish a blog.
          </p>
        </div>

        <!-- Navigation Steps -->
        <div class="flex items-center justify-center mb-8 space-x-6">
          <div class="flex items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full {step ===
              1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300'}"
            >
              1
            </div>
            <span class="ml-2 {step === 1 ? 'text-black' : 'text-gray-500'}"
              >Profile</span
            >
          </div>
          <div class="h-1 w-10 bg-gray-300"></div>
          <div class="flex items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full {step ===
              2
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300'}"
            >
              2
            </div>
            <span class="ml-2 {step === 2 ? 'text-black' : 'text-gray-500'}"
              >Signup</span
            >
          </div>
          <div class="h-1 w-10 bg-gray-300"></div>
          <div class="flex items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full {step ===
              3
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300'}"
            >
              3
            </div>
            <span class="ml-2 {step === 3 ? 'text-black' : 'text-gray-500'}"
              >Login</span
            >
          </div>
          <div class="h-1 w-10 bg-gray-300"></div>
          <div class="flex items-center">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full {step ===
              4
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300'}"
            >
              4
            </div>
            <span class="ml-2 {step === 4 ? 'text-black' : 'text-gray-500'}"
              >Connect Wallet</span
            >
          </div>
        </div>

        <!-- Step Content -->
        {#if step === 1}
          <div class="text-center">
            <p>
              Go to profiles. If you don't have a wallet, sign up for one using
              your email address and password.
            </p>
            <button
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              on:click={nextStep}
            >
              Go to Signup
            </button>
          </div>
        {/if}

        {#if step === 2}
          <div class="text-center">
            <p>Signup for a wallet using your email address and password.</p>
            <button
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              on:click={nextStep}
            >
              Go to Login
            </button>
          </div>
        {/if}

        {#if step === 3}
          <div class="text-center">
            <p>
              If you already have a wallet, login using your email address and
              password.
            </p>
            <button
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              on:click={nextStep}
            >
              Connect Wallet
            </button>
          </div>
        {/if}

        {#if step === 4}
          <div class="text-center">
            <p>Hit the connect wallet button to connect your wallet.</p>
            <a href="../Profile">
              <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Connect Wallet
              </button>
            </a>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

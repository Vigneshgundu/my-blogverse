<script lang="ts">
  import { onMount } from "svelte";
  import custom_axios from "../../axios/AxiosSetup";
  import { writable } from "svelte/store";

  export let form;
  let isWalletConnected = writable(false); // Start as false
  let user = {
    username: "",
    email: "",
  };
  let userId = "";
  let transactionHistory = writable([]);
  let showPopup = writable(false); // Control the visibility of the popup
  let statusMessage = writable(""); // Status message for success or failure
  let alertClass = writable(""); // CSS class for alert
  let showAlert = writable(false); // Control alert visibility

  // Fetch user details
  async function fetchUserDetails() {
    try {
      const response = await custom_axios.get("/auth/details");
      user = response.data.user;
      userId = user.id;
      fetchUserPayments(userId);
    } catch (error) {
      console.error("Error fetching user details:", error);
      displayAlert("Error fetching user details.", "error");
    }
  }

  // Fetch user payments
  async function fetchUserPayments(userId: string) {
    try {
      const response = await custom_axios.get(`/payments/user/${userId}`);
      transactionHistory.set(response.data);
    } catch (error) {
      console.error("Error fetching user payments:", error);
      displayAlert("Error fetching user payments.", "error");
    }
  }

  // Connect wallet (only after successful login)
  async function connectWallet() {
    try {
      console.log("Connecting wallet...");
      const response = await custom_axios.post(`/wallet/connect`, {
        walletAddress: form?.address,
      });
      isWalletConnected.set(true);
      displayAlert("Wallet connected successfully.", "success");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      displayAlert("Failed to connect wallet. Please try again.", "error");
    }
  }

  // Toggle popup visibility
  function toggleSignupPopup() {
    showPopup.set(!$showPopup);
  }

  // Function to display alerts
  function displayAlert(message: string, type: "success" | "error") {
    statusMessage.set(message);
    alertClass.set(
      type === "success"
        ? "bg-green-100 border-green-500 text-green-700"
        : "bg-red-100 border-red-500 text-red-700"
    );
    showAlert.set(true);

    setTimeout(() => {
      showAlert.set(false);
    }, 2000); // Hide alert after 2 seconds
  }

  // Check if login was successful and connect wallet
  $: if (form?.success && form?.address) {
    connectWallet();
  }

  onMount(() => {
    fetchUserDetails();
  });
</script>

<div class="p-6 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-md space-y-6">
  <div class="flex items-center space-x-4">
    <svg
      class="user-icon w-12 h-12 text-gray-900"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
    <div>
      <div class="text-gray-900 text-2xl font-bold">{user.username}</div>
      <div class="text-gray-500">{user.email}</div>
    </div>
  </div>

  <div class="mt-4">
    <div class="text-gray-900 text-xl font-semibold">
      Enter Neucron Wallet Credentials to connect the Wallet
    </div>
    <form method="post" action="?/login">
      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="email"
          >
            Email
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="email"
            type="text"
            placeholder="Enter email"
            name="email"
          />
        </div>
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label
            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="password"
            type="password"
            placeholder="Enter password"
            name="password"
          />
        </div>
        <button
          type="submit"
          class="bg-yellow-500 hover:bg-blue-700 text-white font-bold mt-5 ml-2 px-2 rounded"
        >
          Connect Wallet
        </button>
      </div>
    </form>
    <div class="mt-2 text-sm">
      Didn't SignUp for the Wallet?
      <a href="#" on:click={toggleSignupPopup}>SignUp</a>
    </div>
  </div>

  {#if $isWalletConnected}
    <div class="mt-4">
      <div class="flex items-center space-x-4">
        <svg
          class="wallet-icon w-12 h-12 text-gray-900"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 7H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM7 9h14v10H7V9zm-1 8H3v-2h3v2z"
          />
        </svg>
        <div>
          <div class="text-gray-900">Wallet Address: {form?.address}</div>
          <div class="text-gray-500">Wallet Balance: {form?.balance}</div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Display status message -->
  {#if $showAlert}
    <div class="mt-4 p-4 border-l-4 {$alertClass}">
      {$statusMessage}
    </div>
  {/if}

  <div class="mt-4">
    <div class="flex items-center space-x-4">
      <svg
        class="history-icon w-6 h-6 text-gray-900"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M13 3a9 9 0 0 0-9 9H1l4.39 4.38L9 12H5a7 7 0 1 1 7 7V21a9 9 0 0 0 1-17.93z"
        />
      </svg>
      <div class="text-gray-900 font-bold text-xl">List of Payments</div>
    </div>
    <ul class="mt-4 space-y-2">
      {#each $transactionHistory as payment}
        <li class="p-2 bg-gray-200 rounded">
          <div><b>Blog Title:</b> {payment.blogTitle}</div>
          <div><b>Author Name:</b> {payment.author}</div>
          <div><b>Amount:</b> {payment.amount}</div>
          <div><b>Date:</b> {payment.createdAt}</div>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Signup Popup -->
  {#if $showPopup}
    <div
      class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
    >
      <div class="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 class="text-lg font-bold mb-4">Sign Up for Wallet</h2>
        <form method="POST" action="?/signup">
          <div class="flex flex-wrap -mx-3 mb-2">
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="signup-email"
              >
                Email
              </label>
              <input
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="signup-email"
                type="text"
                placeholder="Enter email"
                name="email"
              />
            </div>
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                for="signup-password"
              >
                Password
              </label>
              <input
                class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="signup-password"
                type="password"
                placeholder="Enter password"
                name="password"
              />
            </div>
            <button
              type="submit"
              class="bg-yellow-500 hover:bg-blue-700 text-white font-bold mt-5 ml-2 px-2 rounded"
            >
              Signup
            </button>
          </div>
        </form>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded mt-4"
          on:click={toggleSignupPopup}>Close</button
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .user-icon,
  .wallet-icon {
    width: 50px;
    height: 50px;
  }
  .history-icon {
    height: 1.5em; /* Adjust height to match text */
  }
</style>

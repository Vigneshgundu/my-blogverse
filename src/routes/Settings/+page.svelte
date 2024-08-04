<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import axios from "../../axios/AxiosSetup";
  import { ApiConstants } from "../../api/apiConstants";
  import { onMount } from "svelte";
  import { logout } from "../../stores/user";
  import { goto } from "$app/navigation";

  let email = "";
  let username = "";
  let oldPassword = "";
  let newPassword = "";

  let showChangeEmail = false;
  let showChangeUsername = false;
  let showChangePassword = false;

  let emailAlert = "";
  let emailAlertSuccess = false;
  let usernameAlert = "";
  let usernameAlertSuccess = false;
  let passwordAlert = "";
  let passwordAlertSuccess = false;

  const dispatch = createEventDispatcher();

  function toggleChangeEmail() {
    showChangeEmail = !showChangeEmail;
    showChangeUsername = false;
    showChangePassword = false;
    emailAlert = "";
  }

  function toggleChangeUsername() {
    showChangeUsername = !showChangeUsername;
    showChangeEmail = false;
    showChangePassword = false;
    usernameAlert = "";
  }

  function toggleChangePassword() {
    showChangePassword = !showChangePassword;
    showChangeEmail = false;
    showChangeUsername = false;
    passwordAlert = "";
  }

  async function validateEmail() {
    try {
      await axios.patch(ApiConstants.Auth.UPDATE_EMAIL, { newEmail: email });
      emailAlert =
        "Email successfully updated! Please log in again to continue.";
      emailAlertSuccess = true;
      showChangeEmail = false;
      setTimeout(() => handleLogout(), 1000);
    } catch (error) {
      emailAlert = error.response?.data?.message || "Failed to update email";
      emailAlertSuccess = false;
    }
  }

  async function validateUsername() {
    try {
      await axios.patch(ApiConstants.Auth.UPDATE_USERNAME, {
        newUsername: username,
      });
      usernameAlert = "Username successfully updated!";
      usernameAlertSuccess = true;
      showChangeUsername = false;
    } catch (error) {
      usernameAlert =
        error.response?.data?.message || "Failed to update username";
      usernameAlertSuccess = false;
    }
  }

  async function validatePassword() {
    try {
      await axios.patch(ApiConstants.Auth.UPDATE_PASSWORD, {
        oldPassword,
        newPassword,
      });
      passwordAlert = "Password successfully updated!";
      passwordAlertSuccess = true;
      showChangePassword = false;
    } catch (error) {
      passwordAlert =
        error.response?.data?.message || "Failed to update password";
      passwordAlertSuccess = false;
    }
  }

  onMount(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  });

  function handleLogout() {
    alert(
      "Email successfully updated. Please log in again with the updated email."
    );
    logout();
    goto("/");
  }
</script>

<section id="settings" class="bg-gray-100 py-8">
  <div class="container mx-auto px-4 max-w-3xl">
    <!-- Account Settings Section -->
    <div
      class="bg-yellow-300 p-6 rounded-lg shadow-lg mb-8 transition-transform transform hover:scale-105 hover:shadow-xl"
    >
      <h2 class="text-3xl font-bold mb-4 text-gray-800">Account Settings</h2>

      <!-- Email Section -->
      <div class="mb-6">
        <button
          class="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          on:click={toggleChangeEmail}
        >
          Change Email
        </button>
        {#if showChangeEmail}
          <div class="mt-4">
            <input
              type="email"
              placeholder="Enter new email"
              bind:value={email}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              class="mt-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-gray-800"
              on:click={validateEmail}>Change Email</button
            >
          </div>
        {/if}
      </div>

      <!-- Username Section -->
      <div class="mb-6">
        <button
          class="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          on:click={toggleChangeUsername}
        >
          Change Username
        </button>
        {#if showChangeUsername}
          <div class="mt-4">
            <input
              type="text"
              placeholder="Enter new username"
              bind:value={username}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              class="mt-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-gray-800"
              on:click={validateUsername}>Change Username</button
            >
          </div>
        {/if}
      </div>

      <!-- Password Section -->
      <div>
        <button
          class="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          on:click={toggleChangePassword}
        >
          Change Password
        </button>
        {#if showChangePassword}
          <div class="mt-4">
            <input
              type="password"
              placeholder="Enter old password"
              bind:value={oldPassword}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Enter new password"
              bind:value={newPassword}
              class="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              class="mt-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-gray-800"
              on:click={validatePassword}>Change Password</button
            >
          </div>
        {/if}
      </div>
    </div>

    <!-- Alert Messages Section -->
    <div class="bg-white p-4 rounded-lg shadow-md">
      {#if emailAlert}
        <div class={`alert ${emailAlertSuccess ? "success" : "failure"}`}>
          {emailAlert}
        </div>
      {/if}
      {#if usernameAlert}
        <div class={`alert ${usernameAlertSuccess ? "success" : "failure"}`}>
          {usernameAlert}
        </div>
      {/if}
      {#if passwordAlert}
        <div class={`alert ${passwordAlertSuccess ? "success" : "failure"}`}>
          {passwordAlert}
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .alert {
    padding: 10px;
    margin-top: 8px;
    text-align: center;
    border-left-width: 5px;
  }
  .alert.success {
    background-color: #d4edda; /* Light green background */
    color: #155724; /* Dark green text */
    border: 1px solid #c3e6cb; /* Light green border */
    border-left-color: #28a745; /* Dark green border-left */
  }
  .alert.failure {
    background-color: #fdecea; /* Light red background */
    color: #a94442; /* Dark red text */
    border: 1px solid #ebccd1; /* Light red border */
    border-left-color: #a94442; /* Dark red border-left */
  }
</style>

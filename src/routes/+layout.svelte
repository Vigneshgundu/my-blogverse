<script>
  import { onMount } from "svelte";
  import Navbar from "$lib/Navbar.svelte";
  import NavbarPostlogin from "$lib/Navbar_postlogin.svelte";
  import Footer from "$lib/Footer.svelte";
  import "../app.css";
  import { isAuthenticated } from "../stores/user";
  import { checkAuthentication } from "../stores/user";

  onMount(() => {
    checkAuthentication();
  });
</script>

{#if $isAuthenticated}
  <NavbarPostlogin />
{:else}
  <Navbar />
{/if}

<slot></slot>
<Footer />

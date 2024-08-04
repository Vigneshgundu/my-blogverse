<script>
  import { logout } from '../../stores/user';
  import { goto } from '$app/navigation';

  function handleLogout() {
    logout();
    goto('/');
  }

  handleLogout();
</script>

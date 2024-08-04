// @ts-ignore
import NeucronSDK from "neucron-sdk";

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request }) => {
    console.log("Logging in...!!")
    const data = await request.formData();

    const neucron = new NeucronSDK();

    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    const loginResponse = await authModule.login({
      email: data.get("email"),
      password: data.get("password"),
    });
    console.log(loginResponse);

    const DefaultWalletBalance = await walletModule.getWalletBalance({});
    console.log(DefaultWalletBalance);
    const addresses = await walletModule.getAddressesByWalletId({});
    const defaultWalletAddress = addresses.data.addresses[0];
    console.log("Default Wallet Address:", defaultWalletAddress);

    return {
      success: true,
      balance: DefaultWalletBalance.data.balance.summary,
      address: defaultWalletAddress,
    };
  },

  signup: async ({ request }) => {
  
    const data = await request.formData();

    const neucron = new NeucronSDK();
    const authModule = neucron.authentication;

    const signUpResponse = await authModule.signUp({
      email: data.get("email"),
      password: data.get("password"),
    });
    console.log(signUpResponse);

    return { success: true,
      message: "Wallet created successfully" };
     
  }
}
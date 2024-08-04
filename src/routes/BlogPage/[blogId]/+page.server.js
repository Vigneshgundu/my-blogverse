
// @ts-ignore
import NeucronSDK from "neucron-sdk";

/** @type {import('./$types').Actions} */
export const actions = {
  pay: async ({ request }) => {

    console.log("Initiated Payment....")
        const data = await request.formData();
        const neucron = new NeucronSDK();

        const authModule = neucron.authentication;
        const walletModule = neucron.wallet;


        const loginResponse = await authModule.login({ email: data.get('email'), password: data.get('password') });
        console.log(loginResponse);



        const options = {
            outputs: [
                {
                    address: data.get("walletAddress"),
                    note: 'Payment Successful for the Blog ${data.get("blogTitle")}',
            
                    amount: Number(data.get('amount'))
                }
            ]
        };

        const payResponse = await neucron.pay.txSpend(options)
        console.log(payResponse)

        return { success: true, payment: payResponse.data.txid, amount:Number(data.get('amount'))  };

    }
}
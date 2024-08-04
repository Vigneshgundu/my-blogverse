import { redirect } from "@sveltejs/kit";

export const actions={
    register : async ({ cookies , request})=>{
        const data =await request.formData();
        const username=data.get('username');
        const email=data.get('email');
        const password=data.get('password');
        cookies.set('session id',await db.createSession(user),{path:'/'});
        return {success:true};
    }
};
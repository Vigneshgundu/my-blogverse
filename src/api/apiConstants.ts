// src/api/apiConstants.ts


export const ApiConstants = {
  Auth: {
    REGISTER: "/auth/Register",
    LOGIN: "/auth/Login",
    UPDATE_EMAIL:"/auth/update-email",//update email
    UPDATE_USERNAME:"/auth/update-username",// update username
    UPDATE_PASSWORD:"/auth/update-password",//update password
  },
  Blog:{
    GET_USER_BY_ID:(userId:string)=>{
      return "/api/blogs/search"+userId;
    }
  },
  Payments :{
    PAY: "/payments/pay-to-view",
    PAYMENT_DETAILS:(userId:string)=>{
      return "payments/user"
  }
}

};

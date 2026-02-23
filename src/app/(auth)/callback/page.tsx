import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

const AuthCallBackPage = async () => {
  const auth = await onAuthenticateUser();

  // Handle the response and redirect accordingly
  if (auth.status === 200 || auth.status === 201) {
    // Redirect to the dashboard if authentication is successful
    redirect("/dashboard");
  }
  else if(auth.status===403 || auth.status==400 || auth.status==500)  {
        redirect("/sign-in");
        console.log("hi this is error")

    }  
 
};

export default AuthCallBackPage;

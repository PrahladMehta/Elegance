

<script >

import {inject} from 'vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

import { otpRoute } from '@/Util';

export default {
  setup(){
  const router=useRouter();
  
  const user=reactive({
   otp:'',
   email:''
  
});

 const emailData=inject('emailData');

 user.email=emailData.email;
 console.log(user.email);

  const handleChange=(e)=>{   
        user[e.target.name]=e.target.value;
        console.log(user); 
  }

  const handleSubmit= async ()=>{

      try{
      if(user.otp.length<6||user.otp.length>6){
            alert("Enter 6 digits");
            return;
      }

   

       console.log("hello");

        const response=await fetch(otpRoute,{
        method:"POST",
        body:JSON.stringify(user),
        headers: {
        'Content-Type': 'application/json' 
     },  
      });

    
      const data=await response.json();
      console.log(data);
      if(data.success){
            alert("You sign in");
            
            router.push('/');
            return;
      }

      alert(data.message);
      router.push("/signup");

      }catch(e){
            console.log("ERROR")
            console.log(e);
      }
    
  }

return {user,handleChange,handleSubmit};

  }

};

      
</script> 

<template>

      <div class="auth-container">


            <div class="image-container"></div>
    
     <form  class="auth-form" action="" @submit.prevent="handleSubmit">

        <h1>Enter OTP</h1>

     <div>
        <input class="auth-input" type="text" placeholder="Enter Otp" name="otp" @change="handleChange">
     </div>

      

     <div class="buttoncontianer">
      <button class="auth-button">Verify</button>
      
     </div>
    

    
       
    </form>
     </div>
    
    </template>

<style>





</style>
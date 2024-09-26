<script >

import { reactive} from 'vue';
import { useRouter } from 'vue-router';


export default {
  setup(){
  const router=useRouter();
  const user=reactive({
   email:''
  
});

  const handleChange=(e)=>{   
        user[e.target.name]=e.target.value;
        console.log(user); 
  }

  const handleSubmit= async ()=>{


      if(user.email.length===0){
            alert("Email is empty");
            return;
      }

      try{

            const response=await fetch("http://localhost:4000/api/v1/forgetpassword",{
        method:"POST",
        body:JSON.stringify(user),

        headers: {
    'Content-Type': 'application/json' 
  },
        
      });

      const data=await response.json();
      
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
    
     <form class="auth-form" action="" @submit.prevent="handleSubmit">

        <h1>Enter G-mail</h1>
    
    <div>
        <input class="auth-input" type="email" placeholder="Email"  @change="handleChange" name="email">
    </div>

    <div class="buttoncontianer">

      
    <button class="auth-button">Continue</button>
    
    <p>Alerady have account<router-link to="/login" class="links"  > Log In</router-link></p> 
    </div>
    

    </form>
     </div>
    
    </template>

<style>




</style>
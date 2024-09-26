<script >

import { reactive} from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';


export default {
  setup(){
  const router=useRouter();
  const route=useRoute();
  const user=reactive({
   password:'',
   confirmpassword:'',

  
});

  const handleChange=(e)=>{   
        user[e.target.name]=e.target.value;
        console.log(user); 
  }

  const handleSubmit= async ()=>{

      try{
      if(user.confirmpassword.length===0||user.password.length===0){
            alert("Field is empty");
            return;
      }

       if(user.confirmpassword!==user.password){
            alert("Password are not equal");
            return;
       }

       console.log("hello");

     
        const token=route.params.token;
        const response=await fetch(`http://localhost:4000/api/v1/changeforgetpassword/${token}`,{
        method:"POST",
        body:JSON.stringify(user),
        headers: {
        'Content-Type': 'application/json' 
     },  
      });

      console.log("hello");
      const data=await response.json();
      console.log(data);
      if(data.success){
            alert("password update");
            router.push('/login');
            return;
      }

      alert(data.message);

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
    
     <form  class="auth-form"action="" @submit.prevent="handleSubmit">

        <h1>Update password</h1>

     <div>
        <input class="auth-input" type="password" placeholder="Password" name="password" @change="handleChange">
     </div>

       <div>
            <input class="auth-input" type="password" placeholder="Confirm Password" name="confirmpassword" @change="handleChange">
       </div>

       <div class="buttoncontianer">
              
                 <button class="auth-button">Change</button>
       </div>
  
  
    
       
    </form>
     </div>
    
    </template>

<style>





</style>
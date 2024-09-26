<script >

import { reactive} from 'vue';
import { useRouter } from 'vue-router';


export default {
  setup(){
  const router=useRouter();
  const user=reactive({
   email:'',
   password:'',
   role:'buyer'
  
});

  const handleChange=(e)=>{   
        user[e.target.name]=e.target.value;
        console.log(user); 
  }

  const handleSubmit= async ()=>{
  
     
      if(user.password.length===0){
        alert("password is empty");
        return;
      }

      if(user.email.length===0){
            alert("Email is empty");
            return;
      }

      try{

            const response=await fetch("http://localhost:4000/api/v1/login",{
        method:"POST",
        body:JSON.stringify(user),

        headers: {
    'Content-Type': 'application/json' 
  },
        
      });

      const data=await response.json();
      console.log(data);

      if(data.success){
        router.push('/home')
        localStorage.setItem("shoptoken",JSON.stringify(data.token));
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
     <form class="auth-form" action="" @submit.prevent="handleSubmit">

 

        <h1>LOG IN</h1>
    
    <div>
        <input class="auth-input" type="email" placeholder="Email"  @change="handleChange" name="email">
    </div>
    
    <div>
        <input  class="auth-input" type="password" placeholder="Password"  @change="handleChange" name="password">
        <br>
        <p><router-link to="/forgetpassword" class="links"> Forget password</router-link></p>
    </div>
    
    <div class="buttoncontianer">
      <button class="auth-button">Submit</button>
    
    <p  >Create account <router-link class="links" to="/signup" >  Signup</router-link></p> 
    </div>
 
   
    
   
    </form>
     </div>
    
    </template>

<style>

.links{
    
    

     padding-top:10px;
     cursor:pointer;
  

}



</style>